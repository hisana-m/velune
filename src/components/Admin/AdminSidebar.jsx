
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingBag,
  Store,
} from "lucide-react";

const menuItems = [
  {
    name: "Dashboard",
    path: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Products",
    path: "/admin/products",
    icon: Package,
  },
  {
    name: "Users",
    path: "/admin/users",
    icon: Users,
  },
  {
    name: "Orders",
    path: "/admin/orders",
    icon: ShoppingBag,
  },
];

export default function AdminSidebar() {
  return (
    <aside className="w-full shrink-0 bg-[#491225] text-[#FEF7F2] lg:min-h-screen lg:w-64">
      <div className="border-b border-white/15 px-6 py-6">
        <h1 className="text-2xl font-serif tracking-[0.2em]">
          VÉLUNE
        </h1>

        <p className="mt-1 text-xs tracking-widest text-[#D8C3C7]">
          ADMIN PANEL
        </p>
      </div>

      <nav className="flex flex-wrap gap-2 p-4 lg:flex-col">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-4 py-3 text-sm transition ${
                  isActive
                    ? "bg-[#FEF7F2] text-[#491225]"
                    : "text-[#E5D5D8] hover:bg-white/10 hover:text-white"
                }`
              }
            >
              <Icon size={18} />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="hidden px-6 pt-8 lg:block">
        <div className="flex items-center gap-2 text-xs text-[#D8C3C7]">
          <Store size={15} />
          <span>VÉLUNE Store Management</span>
        </div>
      </div>
    </aside>
  );
}
