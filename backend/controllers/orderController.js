import Order from "../models/Order.js";
import { sendOrderConfirmationEmail } from "../utils/sendEmail.js";

// @route   POST /api/orders
// @desc    Create new order & dispatch automated email receipt
export const createOrder = async (req, res) => {
  console.log("🛒 [ORDER RECEIVED]:", req.body?.customer?.email);
  try {
    const { customer, orderItems, totalPrice, paymentMethod } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: "No order items provided" });
    }

    const order = await Order.create({
      customer,
      orderItems,
      totalPrice,
      paymentMethod: paymentMethod || "Card",
      status: "Pending",
    });

    // 🚀 Send the email receipt automatically!
    sendOrderConfirmationEmail(order).catch((err) =>
      console.error("❌ Async email error:", err)
    );

    res.status(201).json(order);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: error.message || "Failed to create order" });
  }
};

// @route   GET /api/orders/my-orders
// @desc    Get logged in user's orders by email
export const getMyOrders = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ message: "Email query parameter is required" });
    }

    const orders = await Order.find({
      "customer.email": email.toLowerCase().trim(),
    }).sort({
      createdAt: -1,
    });

    res.json(orders);
  } catch (error) {
    console.error("Error fetching customer orders:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

// @route   GET /api/orders
// @desc    Get all orders (Admin)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: error.message || "Failed to fetch orders" });
  }
};

// @route   PUT /api/orders/:id/status
// @desc    Update order status (Admin)
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status || order.status;
    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: error.message || "Failed to update order" });
  }
};