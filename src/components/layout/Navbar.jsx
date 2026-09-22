import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaShoppingCart,
  FaUser,
  FaSearch,
  FaBars,
  FaTimes,
  FaSignOutAlt,
  FaShieldAlt,
} from "react-icons/fa";
import { useCart } from "../../contexts/CartContext.jsx";

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { state } = useCart();

  const location = useLocation();
  const navigate = useNavigate();

  // Close mobile drawer on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Read logged-in user
  const userString = localStorage.getItem("user");
  let user = null;
  try {
    user = userString ? JSON.parse(userString) : null;
  } catch {
    user = null;
  }

  const cartCount =
    state?.items?.reduce(
      (total, item) => total + (item.quantity || 1),
      0
    ) || 0;

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsMobileMenuOpen(false);
    navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsMobileMenuOpen(false);
    navigate("/login");
  };

  const handleSectionNavigation = (section) => {
    setIsMobileMenuOpen(false);
    if (location.pathname === "/") {
      const element = document.getElementById(section);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } else {
      navigate(`/#${section}`);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-1 text-2xl sm:text-3xl font-black tracking-tight"
            >
              <span className="text-indigo-600">Lux</span>
              <span className="text-slate-900">ora</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-7">
              <Link
                to="/"
                className="font-medium text-gray-700 hover:text-indigo-600 transition text-sm"
              >
                Home
              </Link>
              <Link
                to="/products"
                className="font-medium text-gray-700 hover:text-indigo-600 transition text-sm"
              >
                Products
              </Link>
              <button
                type="button"
                onClick={() => handleSectionNavigation("features")}
                className="font-medium text-gray-700 hover:text-indigo-600 transition text-sm cursor-pointer"
              >
                Features
              </button>
              <button
                type="button"
                onClick={() => handleSectionNavigation("contact")}
                className="font-medium text-gray-700 hover:text-indigo-600 transition text-sm cursor-pointer"
              >
                Contact
              </button>

              {user && (
                <Link
                  to="/orders"
                  className="font-semibold text-indigo-600 hover:text-indigo-700 transition text-sm bg-indigo-50 px-3 py-1.5 rounded-lg"
                >
                  My Orders
                </Link>
              )}

              {user?.role === "admin" && (
                <Link
                  to="/admin"
                  className="flex items-center gap-1.5 font-bold text-xs bg-slate-900 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-600 transition"
                >
                  <FaShieldAlt size={12} /> Admin
                </Link>
              )}
            </nav>

            {/* Desktop Search Bar */}
            <form
              className="hidden md:flex items-center bg-gray-100 rounded-full px-4 py-2 w-64 lg:w-72"
              onSubmit={handleSearch}
            >
              <input
                type="text"
                placeholder="Search products..."
                className="bg-transparent flex-1 outline-none text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" aria-label="Search products">
                <FaSearch className="text-gray-500 hover:text-indigo-600 transition" />
              </button>
            </form>

            {/* Right Icons */}
            <div className="flex items-center gap-3 sm:gap-5">
              {/* Cart Icon */}
              <Link
                to="/cart"
                className="relative text-xl text-gray-700 hover:text-indigo-600 p-2"
                aria-label="Shopping cart"
              >
                <FaShoppingCart />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-sm">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* User Login/Logout */}
              {user ? (
                <div className="flex items-center gap-2">
                  <span className="hidden sm:inline text-xs font-semibold text-slate-600 max-w-[100px] truncate">
                    {user.name || user.email}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 px-2.5 py-1.5 rounded-lg transition flex items-center gap-1"
                  >
                    <FaSignOutAlt />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 hover:text-indigo-600 px-2 py-1.5 rounded-lg"
                >
                  <FaUser />
                  <span className="hidden sm:inline">Sign In</span>
                </Link>
              )}

              {/* Desktop CTA */}
              <Link
                to="/products"
                className="hidden xl:block bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-full font-bold text-sm transition shadow-md"
              >
                Shop Now
              </Link>

              {/* Mobile Menu Button */}
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden text-2xl text-gray-800 p-2 focus:outline-none"
                aria-label="Open navigation menu"
              >
                <FaBars />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Full-Screen Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[999] flex justify-end bg-black/50 backdrop-blur-sm lg:hidden">
          <div className="w-4/5 max-w-sm bg-white h-full shadow-2xl p-6 flex flex-col justify-between overflow-y-auto">
            <div>
              {/* Header inside drawer */}
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <span className="text-2xl font-black text-indigo-600">
                  Lux<span className="text-slate-900">ora</span>
                </span>
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-2xl text-gray-500 hover:text-gray-800 p-1"
                  aria-label="Close menu"
                >
                  <FaTimes />
                </button>
              </div>

              {/* Mobile Search */}
              <form
                className="flex items-center bg-gray-100 rounded-xl px-4 py-2.5 mt-5"
                onSubmit={handleSearch}
              >
                <input
                  type="text"
                  placeholder="Search products..."
                  className="bg-transparent flex-1 outline-none text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit">
                  <FaSearch className="text-gray-500" />
                </button>
              </form>

              {/* Links */}
              <div className="flex flex-col gap-3 mt-6">
                <Link
                  to="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-base font-semibold text-gray-800 hover:text-indigo-600 py-2 border-b border-gray-50"
                >
                  Home
                </Link>
                <Link
                  to="/products"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-base font-semibold text-gray-800 hover:text-indigo-600 py-2 border-b border-gray-50"
                >
                  Products
                </Link>
                <button
                  type="button"
                  onClick={() => handleSectionNavigation("features")}
                  className="text-left text-base font-semibold text-gray-800 hover:text-indigo-600 py-2 border-b border-gray-50"
                >
                  Features
                </button>
                <button
                  type="button"
                  onClick={() => handleSectionNavigation("contact")}
                  className="text-left text-base font-semibold text-gray-800 hover:text-indigo-600 py-2 border-b border-gray-50"
                >
                  Contact
                </button>

                {user && (
                  <Link
                    to="/orders"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-base font-semibold text-indigo-600 py-2 border-b border-gray-50"
                  >
                    My Orders
                  </Link>
                )}

                {user?.role === "admin" && (
                  <Link
                    to="/admin"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-base font-bold text-slate-900 py-2 border-b border-gray-50"
                  >
                    Admin Dashboard
                  </Link>
                )}
              </div>
            </div>

            {/* Bottom Actions inside Drawer */}
            <div className="pt-6 border-t border-gray-100 flex flex-col gap-3">
              <Link
                to="/products"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full text-center bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl shadow-md transition"
              >
                Shop Now
              </Link>

              {user ? (
                <button
                  onClick={handleLogout}
                  className="w-full text-center text-rose-600 font-bold py-2 rounded-xl bg-rose-50 hover:bg-rose-100 transition"
                >
                  Logout ({user.name || user.email})
                </button>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full text-center text-indigo-600 font-bold py-2.5 rounded-xl border border-indigo-200 hover:bg-indigo-50 transition"
                >
                  Sign In / Register
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;