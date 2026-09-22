import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShoppingBag,
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  Loader2,
  Lock,
} from "lucide-react";
import axios from "axios";

import { useCart } from "../contexts/CartContext.jsx";
import { createOrder } from "../api/api.js";
import Toast from "../components/ui/Toast.jsx";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export default function Cart() {
  const { state, dispatch } = useCart();
  const [searchParams] = useSearchParams();

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [stripeLoading, setStripeLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);

  // Pre-fill if logged in
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const [shippingForm, setShippingForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    address: "",
    city: "",
    postalCode: "",
    paymentMethod: "Credit Card (Stripe)",
  });

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 3000);
  };

  // Check if returning from successful Stripe payment
  useEffect(() => {
    if (searchParams.get("payment_success") === "true") {
      dispatch({ type: "CLEAR_CART" });
      setOrderSuccess({
        _id: "STRIPE-" + Date.now().toString().slice(-6),
        customer: {
          email: user?.email || "customer",
          address: "Confirmed via Stripe Checkout",
          city: "Delivered to your address",
        },
        totalPrice: orderTotal,
      });
    }
  }, [searchParams]);

  const handleInputChange = (e) => {
    setShippingForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Calculations
  const subtotal = state.items.reduce(
    (total, item) => total + Number(item.price) * (item.quantity || 1),
    0
  );
  const shipping = subtotal > 150 || subtotal === 0 ? 0 : 15;
  const tax = Math.round(subtotal * 0.08 * 100) / 100;
  const orderTotal = Math.round((subtotal + shipping + tax) * 100) / 100;

  const handleQuantity = (id, delta, currentQty) => {
    const newQty = currentQty + delta;
    if (newQty <= 0) {
      dispatch({ type: "REMOVE_FROM_CART", payload: { id } });
      showToast("Item removed from cart", "info");
    } else {
      dispatch({
        type: "UPDATE_QUANTITY",
        payload: { id, quantity: newQty },
      });
    }
  };

  const handleRemove = (id) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: { id } });
    showToast("Item removed from cart", "info");
  };

  // Standard checkout (creates order directly in DB + triggers Nodemailer email)
  const handleStandardOrder = async (e) => {
    e.preventDefault();

    if (
      !shippingForm.name.trim() ||
      !shippingForm.email.trim() ||
      !shippingForm.address.trim() ||
      !shippingForm.city.trim() ||
      !shippingForm.postalCode.trim()
    ) {
      showToast("Please fill in all shipping details.", "error");
      return;
    }

    try {
      setSubmitting(true);

      const orderPayload = {
        customer: {
          name: shippingForm.name.trim(),
          email: shippingForm.email.trim(),
          address: shippingForm.address.trim(),
          city: shippingForm.city.trim(),
          postalCode: shippingForm.postalCode.trim(),
        },
        orderItems: state.items.map((item) => ({
          product: item._id || item.id,
          name: item.name || item.title || "Product",
          image: item.image || "",
          price: Number(item.price),
          quantity: item.quantity || 1,
        })),
        totalPrice: orderTotal,
        paymentMethod: "Standard Checkout",
      };

      const res = await createOrder(orderPayload);
      setOrderSuccess(res.data);
      dispatch({ type: "CLEAR_CART" });
    } catch (err) {
      console.error("Order creation failed:", err);
      showToast(
        err.response?.data?.message || "Failed to place order. Please try again.",
        "error"
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Stripe Checkout Flow
  const handleStripeCheckout = async () => {
    if (!shippingForm.email.trim()) {
      showToast("Please provide your email address first.", "error");
      return;
    }

    try {
      setStripeLoading(true);

      // Save order in MongoDB first as 'Pending'
      await createOrder({
        customer: {
          name: shippingForm.name || "Customer",
          email: shippingForm.email.trim(),
          address: shippingForm.address || "Stripe Payment",
          city: shippingForm.city || "Online",
          postalCode: shippingForm.postalCode || "00000",
        },
        orderItems: state.items.map((item) => ({
          product: item._id || item.id,
          name: item.name || item.title || "Product",
          image: item.image || "",
          price: Number(item.price),
          quantity: item.quantity || 1,
        })),
        totalPrice: orderTotal,
        paymentMethod: "Stripe Card",
      });

      // Call backend to generate Stripe Checkout Session
      const { data } = await axios.post(`${API_BASE}/payment/create-checkout-session`, {
        items: state.items,
        customerEmail: shippingForm.email.trim(),
      });

      if (data.url) {
        // Redirect customer to secure Stripe gateway!
        window.location.href = data.url;
      }
    } catch (err) {
      console.error("Stripe Checkout Error:", err);
      showToast(
        err.response?.data?.message || "Stripe session failed. Please try standard order.",
        "error"
      );
    } finally {
      setStripeLoading(false);
    }
  };

  // Screen: Order Placed Successfully
  if (orderSuccess) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-6 py-16 bg-slate-50">
        <div className="max-w-lg w-full bg-white rounded-3xl p-8 sm:p-12 text-center shadow-xl border border-slate-100">
          <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} />
          </div>

          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
            Payment & Order Confirmed
          </span>

          <h1 className="text-3xl font-black text-slate-900 mt-4">
            Thank You for Your Order!
          </h1>

          <p className="text-slate-500 text-sm mt-3 leading-relaxed">
            We've sent a detailed receipt to{" "}
            <strong className="text-slate-800">{orderSuccess.customer?.email}</strong>.
            Your order is confirmed and being prepared for express delivery.
          </p>

          <div className="bg-slate-50 rounded-2xl p-4 my-6 text-left border border-slate-100 text-xs text-slate-600 space-y-1.5">
            <div className="flex justify-between">
              <span>Order Reference:</span>
              <strong className="text-slate-900 font-mono">
                {orderSuccess._id?.slice(-8).toUpperCase()}
              </strong>
            </div>
            <div className="flex justify-between">
              <span>Delivery Status:</span>
              <span className="text-indigo-600 font-bold">Processing</span>
            </div>
            <div className="flex justify-between border-t border-slate-200 pt-1.5 mt-1.5">
              <span>Total Paid:</span>
              <strong className="text-indigo-600 font-bold text-sm">
                ${orderSuccess.totalPrice || orderTotal.toFixed(2)}
              </strong>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/orders"
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl transition text-sm text-center"
            >
              View in My Orders
            </Link>
            <Link
              to="/products"
              className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3.5 rounded-xl transition text-sm text-center"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Screen: Empty Cart
  if (state.items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 py-20 text-center bg-slate-50">
        <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag size={36} />
        </div>
        <h2 className="text-3xl font-black text-slate-900">Your Cart is Empty</h2>
        <p className="text-slate-500 max-w-md mt-2 mb-8 text-sm leading-relaxed">
          Looks like you haven't added anything to your cart yet. Explore our top-tier collection to find your next tech upgrade.
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-3.5 rounded-full shadow-lg shadow-indigo-200 transition"
        >
          Explore Catalog <ArrowRight size={18} />
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

      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mb-8">
          Shopping Cart ({state.items.length} {state.items.length === 1 ? "item" : "items"})
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          {/* Left Column: Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            {state.items.map((item) => {
              const id = item._id || item.id;
              const name = item.name || item.title || "Product";
              const qty = item.quantity || 1;

              return (
                <div
                  key={id}
                  className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col sm:flex-row items-center gap-5"
                >
                  <div className="w-24 h-24 bg-slate-50 rounded-xl flex items-center justify-center p-2 shrink-0 overflow-hidden">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={name}
                        className="max-h-full max-w-full object-contain"
                      />
                    ) : (
                      <span className="text-xs text-slate-400">No image</span>
                    )}
                  </div>

                  <div className="flex-1 text-center sm:text-left">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600">
                      {item.category || "Item"}
                    </span>
                    <h3 className="font-bold text-slate-900 text-base mt-0.5">
                      {name}
                    </h3>
                    <p className="text-sm font-semibold text-slate-700 mt-1">
                      ${item.price} each
                    </p>
                  </div>

                  <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-1">
                    <button
                      type="button"
                      onClick={() => handleQuantity(id, -1, qty)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 hover:bg-white transition"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-9 text-center font-bold text-sm text-slate-900">
                      {qty}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleQuantity(id, 1, qty)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 hover:bg-white transition"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-lg font-black text-indigo-600 min-w-[70px] text-right">
                      ${(Number(item.price) * qty).toFixed(2)}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemove(id)}
                      className="text-slate-400 hover:text-rose-600 transition p-2"
                      title="Remove item"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Order Summary & Checkout Form */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm sticky top-24">
            <h2 className="text-xl font-bold text-slate-900 mb-6">
              Order Summary
            </h2>

            <div className="space-y-3.5 text-sm text-slate-600 pb-6 border-b border-slate-100">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900">
                  ${subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Shipping</span>
                <span className="font-semibold text-slate-900">
                  {shipping === 0 ? (
                    <span className="text-emerald-600 font-bold">Free</span>
                  ) : (
                    `$${shipping.toFixed(2)}`
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Sales Tax (8%)</span>
                <span className="font-semibold text-slate-900">
                  ${tax.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-100">
                <span>Total Amount</span>
                <span className="text-2xl text-indigo-600">
                  ${orderTotal.toFixed(2)}
                </span>
              </div>
            </div>

            {!isCheckingOut ? (
              <div className="mt-6 space-y-3">
                <button
                  type="button"
                  onClick={() => setIsCheckingOut(true)}
                  className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-100 transition"
                >
                  Proceed to Checkout <ArrowRight size={18} />
                </button>
                <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
                  <ShieldCheck size={14} className="text-emerald-500" />
                  <span>256-Bit SSL Encrypted Checkout</span>
                </div>
              </div>
            ) : (
              <form onSubmit={handleStandardOrder} className="mt-6 space-y-4">
                <h3 className="font-bold text-slate-900 text-sm mb-2 flex items-center gap-2">
                  <CreditCard size={16} className="text-indigo-600" />
                  Shipping Information
                </h3>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="e.g. Jane Doe"
                    value={shippingForm.name}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address (for Receipt)
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="jane@example.com"
                    value={shippingForm.email}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Street Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    required
                    placeholder="123 Luxury Ave, Apt 4B"
                    value={shippingForm.address}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      required
                      placeholder="New York"
                      value={shippingForm.city}
                      onChange={handleInputChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      required
                      placeholder="10001"
                      value={shippingForm.postalCode}
                      onChange={handleInputChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                {/* Primary: Stripe Card Payment Button */}
                <div className="pt-3 space-y-2.5">
                  <button
                    type="button"
                    onClick={handleStripeCheckout}
                    disabled={stripeLoading}
                    className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl shadow-lg transition disabled:opacity-60 text-sm"
                  >
                    {stripeLoading ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Connecting Stripe Gateway...
                      </>
                    ) : (
                      <>
                        <Lock size={15} className="text-emerald-400" />
                        Pay with Card (Stripe)
                      </>
                    )}
                  </button>

                  {/* Fallback Standard / COD Checkout */}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full flex items-center justify-center gap-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold py-2.5 rounded-xl transition disabled:opacity-60 text-xs"
                  >
                    {submitting ? "Placing Order..." : "Place Standard Order / COD"}
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsCheckingOut(false)}
                    className="w-full text-center text-xs font-semibold text-slate-500 hover:text-slate-800 py-1"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}