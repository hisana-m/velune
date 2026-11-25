
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import {
  fetchAdminUsers,
  toggleUserBlock,
} from "../../../redux/adminUserSlice";

export default function AdminUsers() {
  const dispatch = useDispatch();

  const { users, loading, error } = useSelector(
    (state) => state.adminUsers
  );

  const currentUser = useSelector((state) => state.auth.user);

  useEffect(() => {
    dispatch(fetchAdminUsers());
  }, [dispatch]);

  const handleToggleBlock = async (user) => {
    if (user.role === "admin") {
      toast.error("Admin accounts cannot be blocked here");
      return;
    }

    try {
      await dispatch(toggleUserBlock(user)).unwrap();

      toast.success(
        user.isBlocked
          ? "User unblocked successfully"
          : "User blocked successfully"
      );
    } catch (error) {
      toast.error(error || "Unable to update user");
    }
  };

  const customers = users.filter(
    (user) => user.role !== "admin"
  );

  return (
    <div>
      <div className="mb-7">
        <h1 className="text-2xl font-serif text-[#491225]">
          User Management
        </h1>

        <p className="mt-2 text-sm text-[#8B7276]">
          View registered customers and manage their access.
        </p>
      </div>

      <div className="mb-5 rounded-xl border border-[#E9DED4] bg-[#FEF7F2] p-5">
        <p className="text-sm text-[#8B7276]">Total Customers</p>

        <h2 className="mt-2 text-2xl font-semibold text-[#491225]">
          {customers.length}
        </h2>
      </div>

      <div className="overflow-hidden rounded-xl border border-[#E9DED4] bg-[#FEF7F2]">
        {loading ? (
          <p className="p-8 text-center text-[#8B7276]">
            Loading users...
          </p>
        ) : error ? (
          <p className="p-8 text-center text-red-600">{error}</p>
        ) : customers.length === 0 ? (
          <p className="p-8 text-center text-[#8B7276]">
            No customers found.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left text-sm">
              <thead className="bg-[#491225] text-white">
                <tr>
                  <th className="px-5 py-4">Name</th>
                  <th className="px-5 py-4">Email</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Action</th>
                </tr>
              </thead>

              <tbody>
                {customers.map((user) => {
                  const isCurrentUser =
                    String(user.id) === String(currentUser?.id);

                  return (
                    <tr
                      key={user.id}
                      className="border-t border-[#E9DED4] text-[#491225]"
                    >
                      <td className="px-5 py-4 font-medium">
                        {user.name || "Customer"}
                      </td>

                      <td className="px-5 py-4">{user.email}</td>

                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs ${
                            user.isBlocked
                              ? "bg-red-100 text-red-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {user.isBlocked ? "Blocked" : "Active"}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <button
                          disabled={isCurrentUser}
                          onClick={() => handleToggleBlock(user)}
                          className={`rounded-lg px-4 py-2 text-xs text-white disabled:cursor-not-allowed disabled:opacity-40 ${
                            user.isBlocked
                              ? "bg-green-700 hover:bg-green-800"
                              : "bg-red-700 hover:bg-red-800"
                          }`}
                        >
                          {user.isBlocked ? "Unblock" : "Block"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
