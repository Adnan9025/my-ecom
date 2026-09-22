import express from "express";
import {
  createOrder,
  getAllOrders,
  updateOrderStatus,
  getMyOrders,
} from "../controllers/orderController.js";

const router = express.Router();

// Customer: My Orders (must be above /:id)
router.get("/my-orders", getMyOrders);

// Public: Place Order
router.post("/", createOrder);

// Admin: View all orders & update status
router.get("/", getAllOrders);
router.put("/:id/status", updateOrderStatus);

export default router;