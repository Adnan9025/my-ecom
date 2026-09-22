import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }) {
  const token = localStorage.getItem("token");
  const userString = localStorage.getItem("user");

  let user = null;
  try {
    user = userString ? JSON.parse(userString) : null;
  } catch {
    user = null;
  }

  // If not logged in, or not an admin, redirect to login
  if (!token || !user || user.role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  return children;
}