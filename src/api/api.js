import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
});

/* ======================
   REQUEST INTERCEPTOR (JWT)
====================== */
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
export const fetchMyOrders = (email) =>
  API.get(`/orders/my-orders?email=${encodeURIComponent(email)}`);

/* ======================
   AUTH
====================== */
export const loginUser = (data) => API.post("/auth/login", data);
export const registerUser = (data) => API.post("/auth/register", data);

/* ======================
   PRODUCTS
====================== */
// Public
export const fetchProducts = () => API.get("/products");
export const fetchProductById = (id) => API.get(`/products/${id}`);

// Admin (Protected)
export const createProduct = (data) => API.post("/products", data);
export const updateProduct = (id, data) => API.put(`/products/${id}`, data);
export const deleteProduct = (id) => API.delete(`/products/${id}`);
// Orders API
export const createOrder = (orderData) => API.post("/orders", orderData);
export const fetchOrders = () => API.get("/orders");
export const updateOrderStatus = (id, status) =>
  API.put(`/orders/${id}/status`, { status });

export default API;