import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  Calendar,
  CreditCard,
  Truck,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShoppingBag,
} from "lucide-react";

import { fetchMyOrders } from "../api/api.js";
import Spinner from "../components/ui/Spinner.jsx";
import Toast from "../components/ui/Toast.jsx";

export default function Orders() {
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

  const userString = localStorage.getItem("user");
  let user = null;
  try {
    user = userString ? JSON.parse(userString) : null;
  } catch {
    user = null;
  }

  useEffect(() => {
    if (!user?.email) {
      setLoading(false);
      return;
    }

    setLoading(true);
    fetchMyOrders(user.email)
      .then((res) => {
        setOrders(res.data);
      })
      .catch((err) => {
        console.error("Error fetching order history:", err);
        showToast("Could not load your orders", "error");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [user?.email]);

  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 py-20 text-center bg-slate-50">
        <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mb-4">
          <Package size={32} />
        </div>
        <h2 className="text-2xl font-black text-slate-900 mb-2">
          Sign In to View Orders
        </h2>
        <p className="text-slate-500 text-sm max-w-md mb-6">
          Please log in to your account to view your past purchases, order tracking, and delivery updates.
        </p>
        <Link
          to="/login"
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-3 rounded-xl transition text-sm shadow"
        >
          Sign In Now
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast((prev) => ({ ...prev, show: false }))}
      />

      <div className="max-w-5xl mx-auto px-6">
        {/* Profile Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
              Customer Account
            </span>
            <h1 className="text-3xl font-black text-slate-900 mt-2">
              My Orders & History
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              Logged in as <strong className="text-slate-800">{user.email}</strong>
            </p>
          </div>

          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-4 py-2.5 rounded-xl transition"
          >
            <ShoppingBag size={15} /> Continue Shopping
          </Link>
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <Spinner size="lg" />
            <p className="text-slate-500 text-sm font-medium">
              Loading your purchase history...
            </p>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm">
            <Package size={48} className="mx-auto text-slate-300 mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-1">
              No orders found
            </h3>
            <p className="text-slate-500 text-sm mb-6 max-w-sm mx-auto">
              You haven't placed any orders with this email yet. Explore our latest electronics and place your first order!
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-xl transition text-sm"
            >
              Start Shopping <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const id = order._id || order.id;
              const dateStr = new Date(order.createdAt).toLocaleDateString(
                "en-US",
                {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                }
              );

              const statusBadge = {
                Pending: "bg-amber-50 text-amber-700 border-amber-200",
                Processing: "bg-sky-50 text-sky-700 border-sky-200",
                Delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
                Cancelled: "bg-rose-50 text-rose-700 border-rose-200",
              };

              return (
                <div
                  key={id}
                  className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden"
                >
                  {/* Order Top Bar */}
                  <div className="bg-slate-50/80 p-5 sm:p-6 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs">
                    <div className="flex items-center gap-6">
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">
                          Order Number
                        </span>
                        <span className="font-mono font-bold text-slate-900 text-sm">
                          #{id.slice(-8).toUpperCase()}
                        </span>
                      </div>

                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">
                          Date Placed
                        </span>
                        <span className="font-semibold text-slate-700 flex items-center gap-1">
                          <Calendar size={13} /> {dateStr}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold text-right">
                          Total Amount
                        </span>
                        <span className="text-base font-black text-indigo-600">
                          ${order.totalPrice?.toFixed(2)}
                        </span>
                      </div>

                      <span
                        className={`px-3 py-1 rounded-full border text-xs font-bold ${
                          statusBadge[order.status] || "bg-slate-50 text-slate-700"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-6 divide-y divide-slate-100">
                    {order.orderItems?.map((item, idx) => (
                      <div
                        key={idx}
                        className="py-4 first:pt-0 last:pb-0 flex items-center gap-4"
                      >
                        <div className="w-16 h-16 bg-slate-50 rounded-xl flex items-center justify-center p-2 border border-slate-100 shrink-0">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="max-h-full max-w-full object-contain"
                            />
                          ) : (
                            <Package size={20} className="text-slate-400" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-slate-900 text-sm truncate">
                            {item.name}
                          </h4>
                          <p className="text-xs text-slate-400 mt-0.5">
                            Qty: <span className="font-semibold text-slate-700">{item.quantity}</span> × ${item.price}
                          </p>
                        </div>

                        <div className="text-right">
                          <span className="font-bold text-slate-900 text-sm">
                            ${(Number(item.price) * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Shipping Footer */}
                  <div className="bg-slate-50/50 p-4 sm:px-6 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs text-slate-500 gap-2">
                    <div className="flex items-center gap-1.5">
                      <Truck size={14} className="text-indigo-600" />
                      <span>
                        Shipping to: <strong className="text-slate-700">{order.customer?.address}, {order.customer?.city}</strong>
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <CreditCard size={14} className="text-slate-400" />
                      <span>Paid via {order.paymentMethod || "Card"}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}