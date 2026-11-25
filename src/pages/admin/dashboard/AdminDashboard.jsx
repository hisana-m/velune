
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Package,
  Users,
  ShoppingBag,
  IndianRupee,
} from "lucide-react";

import { fetchAdminProducts } from "../../../redux/adminProductSlice";
import { fetchAdminUsers } from "../../../redux/adminUserSlice";
import { fetchAdminOrders } from "../../../redux/adminOrderSlice";

import { formatPrice } from "../../../data/products";

export default function AdminDashboard() {
  const dispatch = useDispatch();

  const { products } = useSelector((state) => state.adminProducts);
  const { users } = useSelector((state) => state.adminUsers);
  const { orders } = useSelector((state) => state.adminOrders);

  useEffect(() => {
    dispatch(fetchAdminProducts());
    dispatch(fetchAdminUsers());
    dispatch(fetchAdminOrders());
  }, [dispatch]);

  const revenue = orders.reduce((total, order) => {
    if (order.status === "Cancelled") return total;

    return total + Number(order.total || 0);
  }, 0);

  const stats = [
    {
      title: "Total Products",
      value: products.length,
      icon: Package,
    },
    {
      title: "Total Users",
      value: users.length,
      icon: Users,
    },
    {
      title: "Total Orders",
      value: orders.length,
      icon: ShoppingBag,
    },
    {
      title: "Total Revenue",
      value: formatPrice(revenue),
      icon: IndianRupee,
    },
  ];

  const recentOrders = [...orders]
    .sort(
      (a, b) =>
        new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
    )
    .slice(0, 5);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-serif text-[#491225]">
          Dashboard Overview
        </h1>

        <p className="mt-2 text-sm text-[#8B7276]">
          Welcome to your VÉLUNE store management dashboard.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-xl border border-[#E9DED4] bg-[#FEF7F2] p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-[#8B7276]">
                  {stat.title}
                </p>

                <div className="rounded-lg bg-[#491225]/10 p-3">
                  <Icon size={21} className="text-[#491225]" />
                </div>
              </div>

              <h2 className="mt-5 text-2xl font-semibold text-[#491225]">
                {stat.value}
              </h2>
            </div>
          );
        })}
      </div>

      <section className="mt-10 overflow-hidden rounded-xl border border-[#E9DED4] bg-[#FEF7F2]">
        <div className="border-b border-[#E9DED4] px-6 py-5">
          <h2 className="font-semibold text-[#491225]">
            Recent Orders
          </h2>
        </div>

        {recentOrders.length === 0 ? (
          <p className="p-8 text-center text-sm text-[#8B7276]">
            No orders available yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] text-left text-sm">
              <thead className="bg-[#F5E8D5] text-[#491225]">
                <tr>
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>

              <tbody>
                {recentOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-t border-[#E9DED4] text-[#491225]"
                  >
                    <td className="px-6 py-4">#{order.id}</td>

                    <td className="px-6 py-4">
                      {order.customer?.name || "Customer"}
                    </td>

                    <td className="px-6 py-4">
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString()
                        : "—"}
                    </td>

                    <td className="px-6 py-4">
                      {formatPrice(Number(order.total || 0))}
                    </td>

                    <td className="px-6 py-4">
                      {order.status || "Pending"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
