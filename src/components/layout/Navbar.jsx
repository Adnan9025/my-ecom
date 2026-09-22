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

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Read logged-in user safely from localStorage
  const userString = localStorage.getItem("user");
  let user = null;
  try {
    user = userString ? JSON.parse(userString) : null;
  } catch {
    user = null;
  }

  // Compute total quantity of items in cart
  const cartCount = state?.items?.reduce(
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

  useEffect(() => {
    if (!location.hash) return;

    const scrollToSection = () => {
      const element = document.getElementById(location.hash.substring(1));
      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    };

    const timeout = setTimeout(scrollToSection, 100);
    return () => clearTimeout(timeout);
  }, [location]);

  const handleSectionNavigation = (section) => {
    setIsMobileMenuOpen(false);
    if (location.pathname === "/") {
      const element = document.getElementById(section);
      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    } else {
      navigate(`/#${section}`);
    }
  };

  return (
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

          {/* Desktop Navigation Links */}
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
              <FaSearch className="text-gray-500 cursor-pointer hover:text-indigo-600 transition" />
            </button>
          </form>

          {/* Right Action Icons & Controls */}
          <div className="flex items-center gap-4 sm:gap-5">
            {/* Cart Icon */}
            <Link
              to="/cart"
              className="relative text-xl text-gray-700 hover:text-indigo-600 transition"
              aria-label="Shopping cart"
            >
              <FaShoppingCart />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-sm">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Auth Controls */}
            {user ? (
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline text-xs font-semibold text-slate-600 max-w-[120px] truncate">
                  {user.name || user.email}
                </span>
                <button
                  onClick={handleLogout}
                  title="Sign Out"
                  className="flex items-center gap-1 text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg transition"
                >
                  <FaSignOutAlt size={12} />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 hover:text-indigo-600 transition"
                aria-label="Login"
              >
                <FaUser />
                <span className="hidden sm:inline">Sign In</span>
              </Link>
            )}

            {/* Shop Now CTA Desktop */}
            <Link
              to="/products"
              className="hidden xl:block bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-full font-bold text-sm transition shadow-md hover:shadow-lg"
            >
              Shop Now
            </Link>

            {/* Mobile Hamburger Toggle Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden text-2xl text-gray-700 hover:text-indigo-600 p-1 focus:outline-none"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-100 py-4 px-2 space-y-3 bg-white">
            {/* Mobile Search */}
            <form
              className="flex items-center bg-gray-100 rounded-xl px-4 py-2.5 w-full mb-3"
              onSubmit={handleSearch}
            >
              <input
                type="text"
                placeholder="Search products..."
                className="bg-transparent flex-1 outline-none text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" aria-label="Search">
                <FaSearch className="text-gray-500" />
              </button>
            </form>

            <div className="flex flex-col gap-2">
              <Link
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg font-medium text-gray-800 hover:bg-indigo-50 hover:text-indigo-600 transition"
              >
                Home
              </Link>
              <Link
                to="/products"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg font-medium text-gray-800 hover:bg-indigo-50 hover:text-indigo-600 transition"
              >
                Products
              </Link>
              <button
                type="button"
                onClick={() => handleSectionNavigation("features")}
                className="text-left px-3 py-2 rounded-lg font-medium text-gray-800 hover:bg-indigo-50 hover:text-indigo-600 transition"
              >
                Features
              </button>
              <button
                type="button"
                onClick={() => handleSectionNavigation("contact")}
                className="text-left px-3 py-2 rounded-lg font-medium text-gray-800 hover:bg-indigo-50 hover:text-indigo-600 transition"
              >
                Contact
              </button>

              {user && (
                <Link
                  to="/orders"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg font-semibold text-indigo-600 bg-indigo-50"
                >
                  My Orders
                </Link>
              )}

              {user?.role === "admin" && (
                <Link
                  to="/admin"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg font-bold text-white bg-slate-900"
                >
                  Admin Dashboard
                </Link>
              )}

              <Link
                to="/products"
                onClick={() => setIsMobileMenuOpen(false)}
                className="mt-2 text-center bg-indigo-600 text-white font-bold py-2.5 rounded-xl shadow-md"
              >
                Shop Now
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;