import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Star,
  ShoppingCart,
  ArrowLeft,
  ShieldCheck,
  Truck,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Plus,
  Minus,
} from "lucide-react";

import { fetchProductById, fetchProducts } from "../api/api.js";
import { useCart } from "../contexts/CartContext.jsx";
import Toast from "../components/ui/Toast.jsx";
import Lightbox from "../components/ui/Lightbox.jsx";
import Spinner from "../components/ui/Spinner.jsx";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { dispatch } = useCart();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 3000);
  };

  useEffect(() => {
    setLoading(true);
    setError(null);
    setQuantity(1);

    // Fetch this specific product
    fetchProductById(id)
      .then((res) => {
        const prodData = res.data;
        setProduct(prodData);

        // Fetch related products in the same category
        return fetchProducts().then((allRes) => {
          const related = allRes.data
            .filter(
              (p) =>
                (p._id || p.id) !== (prodData._id || prodData.id) &&
                p.category === prodData.category
            )
            .slice(0, 4);
          setRelatedProducts(related);
        });
      })
      .catch((err) => {
        console.error("Error fetching product details:", err);
        setError("Product not found or unavailable.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const handleQuantityChange = (delta) => {
    setQuantity((prev) => {
      const maxStock = product?.stock ?? 99;
      const next = prev + delta;
      if (next < 1) return 1;
      if (next > maxStock) {
        showToast(`Only ${maxStock} items in stock!`, "warning");
        return maxStock;
      }
      return next;
    });
  };

  const handleAddToCart = () => {
    if (!product) return;

    if (product.stock === 0) {
      showToast("Sorry, this product is currently out of stock.", "error");
      return;
    }

    const title = product.name || product.title || "Product";

    dispatch({
      type: "ADD_TO_CART",
      payload: {
        ...product,
        quantity: quantity,
      },
    });

    showToast(`${quantity}x ${title} added to your cart!`, "success");
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Spinner size="lg" />
        <p className="text-slate-500 font-medium">Loading product details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle size={32} />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          {error || "Product Not Found"}
        </h1>
        <p className="text-slate-500 mb-6">
          The item you are looking for might have been removed or is temporarily unavailable.
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-xl transition"
        >
          <ArrowLeft size={18} /> Back to Catalog
        </Link>
      </div>
    );
  }

  const productName = product.name || product.title || "Product";
  const inStock = (product.stock ?? 1) > 0;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
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

      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8">
        <Link to="/" className="hover:text-indigo-600 transition">
          Home
        </Link>
        <span>/</span>
        <Link to="/products" className="hover:text-indigo-600 transition">
          Products
        </Link>
        <span>/</span>
        <span className="text-slate-900 font-medium truncate max-w-xs">
          {productName}
        </span>
      </nav>

      {/* Product Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
        {/* Left: Product Image */}
        <div className="bg-white rounded-3xl border border-slate-100 p-8 flex items-center justify-center relative shadow-sm">
          <div className="w-full h-96 sm:h-[450px] flex items-center justify-center overflow-hidden">
            {product.image ? (
              <img
                src={product.image}
                alt={productName}
                onClick={() => setSelectedImage(product.image)}
                className="max-h-full max-w-full object-contain cursor-zoom-in transition duration-300 hover:scale-105"
              />
            ) : (
              <div className="text-slate-400 font-medium">No image available</div>
            )}
          </div>
        </div>

        {/* Right: Product Details & Purchase Controls */}
        <div className="flex flex-col">
          {/* Category & Badge */}
          <div className="flex items-center gap-3 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
              {product.category || "Electronics"}
            </span>

            {inStock ? (
              <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                <CheckCircle2 size={13} /> In Stock ({product.stock} units)
              </span>
            ) : (
              <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-3 py-1 rounded-full">
                Out of Stock
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight">
            {productName}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-2 mt-3">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={18} className="fill-yellow-400" />
              ))}
            </div>
            <span className="text-sm font-semibold text-slate-700">
              {product.rating || 4.9}
            </span>
            <span className="text-sm text-slate-400">• (128 customer reviews)</span>
          </div>

          {/* Price */}
          <div className="mt-6 flex items-baseline gap-4">
            <span className="text-4xl font-black text-indigo-600">
              ${product.price}
            </span>
            {product.oldPrice && (
              <span className="text-2xl text-slate-400 line-through">
                ${product.oldPrice}
              </span>
            )}
          </div>

          {/* Description */}
          <p className="mt-6 text-slate-600 leading-relaxed">
            {product.description ||
              "Designed with precision and built with premium materials for unmatched durability and performance. Experience next-level engineering today."}
          </p>

          {/* Purchase Actions */}
          <div className="mt-8 pt-8 border-t border-slate-200">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Quantity Selector */}
              <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-1 w-fit">
                <button
                  type="button"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-slate-600 hover:bg-white transition disabled:opacity-40"
                  aria-label="Decrease quantity"
                >
                  <Minus size={16} />
                </button>

                <span className="w-12 text-center font-bold text-slate-900">
                  {quantity}
                </span>

                <button
                  type="button"
                  onClick={() => handleQuantityChange(1)}
                  disabled={!inStock || quantity >= (product.stock ?? 99)}
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-slate-600 hover:bg-white transition disabled:opacity-40"
                  aria-label="Increase quantity"
                >
                  <Plus size={16} />
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!inStock}
                className="flex-1 flex items-center justify-center gap-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-bold py-3.5 px-8 rounded-xl shadow-lg shadow-indigo-100 transition"
              >
                <ShoppingCart size={20} />
                {inStock ? "Add to Cart" : "Out of Stock"}
              </button>
            </div>
          </div>

          {/* Value Props & Trust Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-10 pt-8 border-t border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Truck size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Free Express Delivery</p>
                <p className="text-[11px] text-slate-400">On orders over $99</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <ShieldCheck size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">2-Year Warranty</p>
                <p className="text-[11px] text-slate-400">Full manufacturer coverage</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <RotateCcw size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">30-Day Free Returns</p>
                <p className="text-[11px] text-slate-400">Hassle-free guarantee</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="mt-24 pt-16 border-t border-slate-200">
          <div className="flex justify-between items-end mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                Recommendations
              </span>
              <h2 className="text-2xl font-black text-slate-900 mt-1">
                You Might Also Like
              </h2>
            </div>
            <Link
              to="/products"
              className="text-sm font-bold text-indigo-600 hover:text-indigo-700 hover:underline"
            >
              See all
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((rel) => {
              const relId = rel._id || rel.id;
              const relTitle = rel.name || rel.title || "Product";

              return (
                <div
                  key={relId}
                  className="bg-white rounded-2xl border border-slate-100 p-4 hover:shadow-lg transition flex flex-col justify-between"
                >
                  <Link to={`/products/${relId}`} className="block">
                    <div className="h-44 bg-slate-50 rounded-xl flex items-center justify-center p-3 mb-3 overflow-hidden">
                      {rel.image ? (
                        <img
                          src={rel.image}
                          alt={relTitle}
                          className="max-h-full max-w-full object-contain hover:scale-105 transition"
                        />
                      ) : (
                        <span className="text-slate-400 text-xs">No image</span>
                      )}
                    </div>
                    <p className="text-[11px] font-bold uppercase text-slate-400">
                      {rel.category}
                    </p>
                    <h3 className="font-bold text-slate-900 text-sm mt-1 truncate">
                      {relTitle}
                    </h3>
                  </Link>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-lg font-black text-indigo-600">
                      ${rel.price}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        dispatch({ type: "ADD_TO_CART", payload: rel });
                        showToast(`${relTitle} added to cart!`, "success");
                      }}
                      className="text-xs bg-slate-900 hover:bg-indigo-600 text-white font-semibold px-3 py-1.5 rounded-lg transition"
                    >
                      Add
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}