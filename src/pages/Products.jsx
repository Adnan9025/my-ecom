import { useEffect, useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  SlidersHorizontal,
  Star,
  ShoppingCart,
  RotateCcw,
  Sparkles,
} from "lucide-react";

import { fetchProducts } from "../api/api.js";
import { useCart } from "../contexts/CartContext.jsx";
import Toast from "../components/ui/Toast.jsx";
import Spinner from "../components/ui/Spinner.jsx";
import Lightbox from "../components/ui/Lightbox.jsx";

const CATEGORIES = [
  { id: "all", label: "All Products" },
  { id: "laptops", label: "Laptops" },
  { id: "phones", label: "Smartphones" },
  { id: "watches", label: "Smart Watches" },
  { id: "headphones", label: "Headphones" },
  { id: "accessories", label: "Accessories" },
];

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { dispatch } = useCart();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  // Filter States
  const urlSearch = searchParams.get("search") || "";
  const [searchTerm, setSearchTerm] = useState(urlSearch);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("featured");

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 2500);
  };

  // Synchronize URL search param if it changes from Navbar
  useEffect(() => {
    if (urlSearch !== searchTerm) {
      setSearchTerm(urlSearch);
    }
  }, [urlSearch]);

  useEffect(() => {
    setLoading(true);
    fetchProducts()
      .then((res) => {
        setProducts(res.data);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        showToast("Failed to load catalog products", "error");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Compute category item counts dynamically from actual DB products
  const categoryCounts = useMemo(() => {
    const counts = { all: products.length };
    products.forEach((p) => {
      const cat = p.category?.toLowerCase() || "accessories";
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  }, [products]);

  // Filter and Sort Pipeline
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Category filter
    if (selectedCategory !== "all") {
      result = result.filter(
        (p) => p.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Search filter
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      result = result.filter((p) => {
        const title = (p.name || p.title || "").toLowerCase();
        const desc = (p.description || "").toLowerCase();
        const cat = (p.category || "").toLowerCase();
        return title.includes(q) || desc.includes(q) || cat.includes(q);
      });
    }

    // Sorting
    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => Number(a.price) - Number(b.price));
        break;
      case "price-desc":
        result.sort((a, b) => Number(b.price) - Number(a.price));
        break;
      case "rating":
        result.sort((a, b) => (b.rating || 4.5) - (a.rating || 4.5));
        break;
      case "name-asc":
        result.sort((a, b) =>
          (a.name || a.title || "").localeCompare(b.name || b.title || "")
        );
        break;
      case "featured":
      default:
        // By newest created
        result.sort(
          (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        );
        break;
    }

    return result;
  }, [products, selectedCategory, searchTerm, sortBy]);

  const handleAddToCart = (product) => {
    const title = product.name || product.title || "Product";
    dispatch({
      type: "ADD_TO_CART",
      payload: product,
    });
    showToast(`${title} added to cart!`, "success");
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setSortBy("featured");
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast((prev) => ({ ...prev, show: false }))}
      />

      <Lightbox
        image={selectedImage}
        isOpen={selectedImage !== null}
        onClose={() => setSelectedImage(null)}
      />

      <div className="max-w-7xl mx-auto px-6">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-8 sm:p-12 text-white mb-12 shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-indigo-500/20 text-indigo-300 font-semibold text-xs uppercase tracking-wider mb-4 border border-indigo-500/30">
              <Sparkles size={14} /> Official Store Catalog
            </span>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight">
              Explore Our Collection
            </h1>
            <p className="mt-3 text-slate-300 text-base sm:text-lg leading-relaxed">
              Find premium electronics, engineered for peak performance and timeless durability.
            </p>
          </div>
          {/* Subtle background glow */}
          <div className="absolute -right-16 -bottom-16 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* Controls Bar: Search & Sorting */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-slate-200/80 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search Box */}
          <div className="relative w-full md:w-96">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search products, specs, categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-sm outline-none transition focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-600 bg-slate-200/60 rounded-md px-2 py-0.5"
              >
                Clear
              </button>
            )}
          </div>

          {/* Results Count & Sort Dropdown */}
          <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
            <span className="text-xs font-semibold text-slate-500">
              Showing{" "}
              <strong className="text-slate-900">{filteredProducts.length}</strong>{" "}
              products
            </span>

            <div className="flex items-center gap-2">
              <SlidersHorizontal size={16} className="text-slate-400 hidden sm:block" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-sm font-medium text-slate-700 outline-none cursor-pointer hover:border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              >
                <option value="featured">Sort by: Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="name-asc">Name: A to Z</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const count = categoryCounts[cat.id] ?? 0;
            const isActive = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`whitespace-nowrap flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition cursor-pointer ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                    : "bg-white text-slate-600 border border-slate-200 hover:border-indigo-300 hover:text-indigo-600"
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="min-h-[40vh] flex flex-col items-center justify-center gap-4">
            <Spinner size="lg" />
            <p className="text-slate-500 font-medium">Loading catalog...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          /* Empty Search / Filter State */
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-lg mx-auto shadow-sm my-8">
            <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search size={28} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              No products found
            </h3>
            <p className="text-slate-500 text-sm mb-6">
              We couldn't find any products matching your current filters. Try searching for something else or reset your criteria.
            </p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold px-6 py-3 rounded-xl shadow transition"
            >
              <RotateCcw size={16} /> Reset All Filters
            </button>
          </div>
        ) : (
          /* Products Grid with Entrance Animations */
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          >
            <AnimatePresence>
              {filteredProducts.map((product) => {
                const id = product._id || product.id;
                const productName = product.name || product.title || "Product";

                return (
                  <motion.div
                    layout
                    key={id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.25 }}
                    className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                  >
                    {/* Image Area */}
                    <div className="relative h-64 bg-slate-50 flex items-center justify-center p-6 overflow-hidden">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={productName}
                          onClick={() => setSelectedImage(product.image)}
                          className="max-h-full max-w-full object-contain cursor-zoom-in transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <span className="text-slate-400 text-sm">No image</span>
                      )}

                      <span className="absolute top-4 left-4 text-[11px] font-bold uppercase tracking-wider bg-white/95 text-indigo-600 px-3 py-1 rounded-full shadow-sm">
                        {product.category || "General"}
                      </span>

                      <button
                        type="button"
                        onClick={() => handleAddToCart(product)}
                        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-slate-700 hover:bg-indigo-600 hover:text-white transition"
                        title="Add to cart"
                      >
                        <ShoppingCart size={17} />
                      </button>
                    </div>

                    {/* Content Area */}
                    <div className="p-6 flex flex-col flex-1 justify-between">
                      <div>
                        <Link to={`/products/${id}`}>
                          <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition truncate">
                            {productName}
                          </h3>
                        </Link>

                        <div className="flex items-center gap-1 mt-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={14}
                              className="fill-yellow-400 text-yellow-400"
                            />
                          ))}
                          <span className="ml-1.5 text-xs text-slate-500 font-semibold">
                            {product.rating || 4.9}
                          </span>
                        </div>

                        <p className="mt-3 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                          {product.description ||
                            "Engineered for performance, premium comfort, and everyday productivity."}
                        </p>
                      </div>

                      {/* Pricing & CTA */}
                      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                        <div>
                          <span className="text-2xl font-black text-slate-900">
                            ${product.price}
                          </span>
                          {product.oldPrice && (
                            <span className="ml-2 text-xs text-slate-400 line-through">
                              ${product.oldPrice}
                            </span>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => handleAddToCart(product)}
                          className="bg-slate-900 hover:bg-indigo-600 text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition shadow"
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}