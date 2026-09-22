import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Star, ShoppingCart } from "lucide-react";

import Badge from "../ui/Badge.jsx";
import Toast from "../ui/Toast.jsx";
import Lightbox from "../ui/Lightbox.jsx";
import Spinner from "../ui/Spinner.jsx";

import { fetchProducts } from "../../api/api.js";
import { useCart } from "../../contexts/CartContext.jsx";

export default function FeaturedProducts() {
  const { dispatch } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedImage, setSelectedImage] = useState(null);

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  useEffect(() => {
    fetchProducts()
      .then((res) => {
        // Take first 8 products for the featured section
        setProducts(res.data.slice(0, 8));
      })
      .catch((err) => {
        console.error("Failed to load featured products:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleAddToCart = (product) => {
    const productName = product.name || product.title || "Product";

    dispatch({
      type: "ADD_TO_CART",
      payload: product,
    });

    setToast({
      show: true,
      message: `${productName} added to cart`,
      type: "success",
    });

    setTimeout(() => {
      setToast((prev) => ({
        ...prev,
        show: false,
      }));
    }, 2500);
  };

  return (
    <section className="py-24 bg-slate-50">
      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() =>
          setToast((prev) => ({
            ...prev,
            show: false,
          }))
        }
      />

      <Lightbox
        image={selectedImage}
        isOpen={selectedImage !== null}
        onClose={() => setSelectedImage(null)}
      />

      <div className="max-w-7xl mx-auto px-6">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-5 py-2 rounded-full bg-indigo-100 text-indigo-700 font-semibold">
            Featured Collection
          </span>

          <h2 className="mt-6 text-5xl font-black text-slate-900">
            Trending Products
          </h2>

          <p className="mt-5 text-lg text-slate-500 max-w-2xl mx-auto">
            Discover our hand-picked premium collection carefully selected
            for quality, innovation, and exceptional performance.
          </p>
        </motion.div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-4">
            <Spinner size="lg" />
            <p className="text-slate-500 font-medium">
              Loading featured collection...
            </p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-100">
            <p className="text-slate-500">No products featured yet.</p>
          </div>
        ) : (
          /* Products Grid */
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product, index) => {
              const productName = product.name || product.title || "Product";
              const id = product._id || product.id;

              return (
                <motion.div
                  key={id ?? index}
                  initial={{ opacity: 0, y: 60 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -10 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.08,
                  }}
                  className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition duration-300 group flex flex-col justify-between"
                >
                  <div className="relative bg-slate-100 overflow-hidden flex items-center justify-center p-6 h-72">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={productName}
                        className="w-full h-full object-contain transition-all duration-500 group-hover:scale-110 cursor-pointer"
                        onClick={() => setSelectedImage(product.image)}
                      />
                    ) : (
                      <span className="text-slate-400">No image</span>
                    )}

                    {product.sale ? (
                      <Badge type="sale">SALE</Badge>
                    ) : (
                      <Badge type="new">NEW</Badge>
                    )}

                    <button
                      onClick={() => handleAddToCart(product)}
                      className="absolute top-5 right-5 w-11 h-11 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-indigo-600 hover:text-white transition"
                      aria-label="Add to cart"
                    >
                      <ShoppingCart size={18} />
                    </button>
                  </div>

                  <div className="p-6 flex flex-col flex-1 justify-between">
                    <div>
                      <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                        {product.category || "Electronics"}
                      </p>

                      <Link to={`/products/${id}`}>
                        <h3 className="text-xl font-bold mt-2 text-slate-900 line-clamp-2 hover:text-indigo-600 transition">
                          {productName}
                        </h3>
                      </Link>

                      <div className="flex items-center gap-1 mt-3">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            className="fill-yellow-400 text-yellow-400"
                          />
                        ))}
                        <span className="ml-2 text-sm text-slate-500">
                          ({product.rating || 4.9})
                        </span>
                      </div>
                    </div>

                    <div className="mt-6">
                      <div className="flex items-center justify-between">
                        <span className="text-3xl font-black text-indigo-600">
                          ${product.price}
                        </span>

                        {product.oldPrice && (
                          <span className="text-slate-400 line-through">
                            ${product.oldPrice}
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => handleAddToCart(product)}
                        className="mt-6 w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-indigo-600 text-white py-3.5 rounded-xl font-semibold transition"
                      >
                        <ShoppingCart size={18} />
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* View All Button */}
        <div className="text-center mt-20">
          <Link
            to="/products"
            className="inline-flex items-center px-10 py-4 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-xl transition"
          >
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
}