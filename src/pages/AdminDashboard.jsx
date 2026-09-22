import { useEffect, useState } from "react";
import {
  DollarSign,
  PackageCheck,
  Clock,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";

import { fetchOrders, updateOrderStatus } from "../api/api.js";
import Toast from "../components/ui/Toast.jsx";
import Spinner from "../components/ui/Spinner.jsx";

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 3000);
  };

  const loadOrders = () => {
    setLoading(true);
    fetchOrders()
      .then((res) => {
        setOrders(res.data);
      })
      .catch((err) => {
        console.error("Error fetching admin orders:", err);
        showToast("Failed to load orders", "error");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((ord) =>
          (ord._id || ord.id) === orderId ? { ...ord, status: newStatus } : ord
        )
      );
      showToast(`Order status updated to ${newStatus}`, "success");
    } catch (err) {
      console.error("Status update error:", err);
      showToast("Failed to update status", "error");
    }
  };

  // Metrics
  const totalRevenue = orders.reduce(
    (sum, o) => sum + Number(o.totalPrice || 0),
    0
  );
  const pendingOrders = orders.filter((o) => o.status === "Pending").length;
  const completedOrders = orders.filter((o) => o.status === "Delivered").length;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast((prev) => ({ ...prev, show: false }))}
      />

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900">
          Executive Dashboard
        </h1>
        <p className="text-slate-500 mt-1 text-sm">
          Real-time store metrics, gross sales, and customer order management.
        </p>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Total Gross Sales
            </p>
            <h3 className="text-2xl font-black text-slate-900 mt-0.5">
              ${totalRevenue.toFixed(2)}
            </h3>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
            <PackageCheck size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Total Orders
            </p>
            <h3 className="text-2xl font-black text-slate-900 mt-0.5">
              {orders.length}
            </h3>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Pending Orders
            </p>
            <h3 className="text-2xl font-black text-slate-900 mt-0.5">
              {pendingOrders}
            </h3>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-sky-50 text-sky-600 rounded-xl flex items-center justify-center">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Delivered
            </p>
            <h3 className="text-2xl font-black text-slate-900 mt-0.5">
              {completedOrders}
            </h3>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Recent Customer Orders</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Orders placed by customers through the store cart
            </p>
          </div>

          <button
            onClick={loadOrders}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-lg transition"
          >
            Refresh List
          </button>
        </div>

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <Spinner size="md" />
            <p className="text-xs text-slate-400">Loading incoming orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="p-16 text-center text-slate-400">
            <PackageCheck size={40} className="mx-auto mb-3 opacity-40" />
            <p className="text-base font-semibold text-slate-700">No orders placed yet.</p>
            <p className="text-xs text-slate-400 mt-1">
              Add items to your cart on the store and test the checkout flow!
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-400 font-bold border-b border-slate-100">
                <tr>
                  <th className="py-4 px-6">Order ID</th>
                  <th className="py-4 px-6">Customer</th>
                  <th className="py-4 px-6">Items</th>
                  <th className="py-4 px-6">Total</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((order) => {
                  const id = order._id || order.id;

                  const statusColors = {
                    Pending: "bg-amber-50 text-amber-700 border-amber-200",
                    Processing: "bg-sky-50 text-sky-700 border-sky-200",
                    Delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
                    Cancelled: "bg-rose-50 text-rose-700 border-rose-200",
                  };

                  return (
                    <tr key={id} className="hover:bg-slate-50/50 transition">
                      <td className="py-4 px-6 font-mono text-xs font-bold text-slate-900">
                        #{id.slice(-6).toUpperCase()}
                      </td>

                      <td className="py-4 px-6">
                        <p className="font-semibold text-slate-900 text-xs">
                          {order.customer?.name}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          {order.customer?.email}
                        </p>
                        <p className="text-[10px] text-slate-400 truncate max-w-xs">
                          {order.customer?.address}, {order.customer?.city}
                        </p>
                      </td>

                      <td className="py-4 px-6 text-xs">
                        {order.orderItems?.map((item, idx) => (
                          <div key={idx} className="truncate max-w-xs">
                            {item.quantity}x {item.name}
                          </div>
                        ))}
                      </td>

                      <td className="py-4 px-6 font-black text-slate-900">
                        ${order.totalPrice?.toFixed(2)}
                      </td>

                      <td className="py-4 px-6">
                        <span
                          className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                            statusColors[order.status] || "bg-slate-50 text-slate-600"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>

                      <td className="py-4 px-6">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(id, e.target.value)}
                          className="text-xs bg-slate-50 border border-slate-200 rounded-lg py-1.5 px-2 font-medium text-slate-700 outline-none hover:border-slate-300"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
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