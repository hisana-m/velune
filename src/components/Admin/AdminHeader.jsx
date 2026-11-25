
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LogOut, UserCircle } from "lucide-react";
import { logout } from "../../redux/authSlice";
import toast from "react-hot-toast";

export default function AdminHeader() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());

    toast.success("Logged out successfully");

    navigate("/login", { replace: true });
  };

  return (
    <header className="flex min-h-20 items-center justify-between gap-4 border-b border-[#E9DED4] bg-[#FEF7F2] px-5 py-4 md:px-8">
      <div>
        <h2 className="text-lg font-semibold text-[#491225]">
          Admin Dashboard
        </h2>

        <p className="text-xs text-[#8B7276]">
          Manage your VÉLUNE store
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-2 sm:flex">
          <UserCircle size={25} className="text-[#491225]" />

          <div>
            <p className="text-sm font-medium text-[#491225]">
              {user?.name || "Admin"}
            </p>

            <p className="text-xs text-[#8B7276]">
              Administrator
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-lg border border-[#491225] px-3 py-2 text-sm text-[#491225] transition hover:bg-[#491225] hover:text-white"
        >
          <LogOut size={16} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}
