import { Link, useNavigate } from "react-router-dom";
import { LayoutDashboard, Package, ArrowLeft, LogOut } from "lucide-react";

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between min-h-screen">
      <div>
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <Link to="/" className="text-2xl font-black tracking-tight">
            <span className="text-indigo-600">Lux</span>
            <span className="text-slate-900">ora</span>
          </Link>
          <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded uppercase">
            Admin
          </span>
        </div>

        {/* Navigation */}
        <nav className="space-y-1.5 p-4">
          <Link
            className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition"
            to="/admin"
          >
            <LayoutDashboard size={20} /> Dashboard
          </Link>

          <Link
            className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-indigo-600 bg-indigo-50 transition"
            to="/admin/products"
          >
            <Package size={20} /> Products Inventory
          </Link>
        </nav>
      </div>

      {/* Footer / Actions */}
      <div className="p-4 border-t border-slate-100 space-y-2">
        <Link
          to="/"
          className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition text-sm"
        >
          <ArrowLeft size={18} /> Back to Store
        </Link>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-red-600 hover:bg-red-50 transition text-sm"
        >
          <LogOut size={18} /> Sign Out
        </button>
      </div>
    </aside>
  );
}