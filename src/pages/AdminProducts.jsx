import { useEffect, useState } from "react";
import AdminLayout from "../components/layout/AdminLayout.jsx";
import Card from "../components/ui/Card.jsx";
import Button from "../components/ui/Button.jsx";
import Modal from "../components/ui/Modal.jsx";
import Input from "../components/ui/Input.jsx";
import Select from "../components/ui/Select.jsx";
import Textarea from "../components/ui/Textarea.jsx";
import Toast from "../components/ui/Toast.jsx";
import { fetchProducts, createProduct, updateProduct, deleteProduct } from "../api/api";

const initialFormState = {
  name: "",
  price: "",
  category: "laptops",
  stock: 10,
  image: "",
  description: "",
};

const categoryOptions = [
  { value: "laptops", label: "Laptops" },
  { value: "phones", label: "Smartphones" },
  { value: "watches", label: "Smart Watches" },
  { value: "headphones", label: "Headphones" },
  { value: "accessories", label: "Accessories" },
];

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal & Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(initialFormState);
  const [submitting, setSubmitting] = useState(false);

  // Toast notifications
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 3000);
  };

  const loadProducts = () => {
    setLoading(true);
    fetchProducts()
      .then((res) => setProducts(res.data))
      .catch((err) => {
        console.error("Error loading products:", err);
        showToast("Failed to fetch products", "error");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const openAddModal = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormData(initialFormState);
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setIsEditing(true);
    setEditingId(product._id || product.id);
    setFormData({
      name: product.name || product.title || "",
      price: product.price || "",
      category: product.category || "laptops",
      stock: product.stock ?? 10,
      image: product.image || "",
      description: product.description || "",
    });
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.price) {
      showToast("Please provide product name and price.", "error");
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
      };

      if (isEditing) {
        const res = await updateProduct(editingId, payload);
        setProducts((prev) =>
          prev.map((p) => ((p._id || p.id) === editingId ? res.data : p))
        );
        showToast("Product updated successfully!", "success");
      } else {
        const res = await createProduct(payload);
        setProducts((prev) => [res.data, ...prev]);
        showToast("Product created successfully!", "success");
      }

      setIsModalOpen(false);
    } catch (err) {
      console.error("Error saving product:", err);
      const msg = err.response?.data?.message || "Operation failed. Are you logged in as admin?";
      showToast(msg, "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => (p._id || p.id) !== id));
      showToast("Product deleted successfully", "success");
    } catch (err) {
      console.error("Failed to delete product:", err);
      const msg = err.response?.data?.message || "Failed to delete product";
      showToast(msg, "error");
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <p className="text-center text-slate-500 text-lg py-16">
          Loading inventory...
        </p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast((prev) => ({ ...prev, show: false }))}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900">
            Products Inventory
          </h1>
          <p className="text-slate-500 mt-1">
            Total products: <span className="font-bold text-indigo-600">{products.length}</span>
          </p>
        </div>

        <Button variant="primary" onClick={openAddModal}>
          + Add Product
        </Button>
      </div>

      {/* Grid */}
      {products.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
          <p className="text-slate-500">No products found in database.</p>
          <Button variant="primary" className="mt-4" onClick={openAddModal}>
            Create your first product
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((p) => {
            const id = p._id || p.id;
            const productName = p.name || p.title || "Untitled Product";

            return (
              <Card key={id}>
                <div className="h-48 bg-slate-100 rounded-xl mb-4 flex items-center justify-center overflow-hidden p-4">
                  {p.image ? (
                    <img
                      src={p.image}
                      alt={productName}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <span className="text-slate-400">No Image</span>
                  )}
                </div>

                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-2.5 py-1 rounded-md">
                  {p.category || "General"}
                </span>

                <h2 className="text-lg font-bold text-slate-900 mt-2 truncate">
                  {productName}
                </h2>

                <p className="text-sm text-slate-500 line-clamp-2 mt-1 mb-3">
                  {p.description || "No description provided."}
                </p>

                <div className="flex justify-between items-center mb-4">
                  <span className="text-2xl font-black text-slate-900">
                    ${p.price}
                  </span>
                  <span className="text-xs text-slate-400">
                    Stock: <span className="font-semibold text-slate-700">{p.stock ?? 0}</span>
                  </span>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => openEditModal(p)}
                  >
                    Edit
                  </Button>

                  <Button
                    variant="danger"
                    className="flex-1"
                    onClick={() => handleDelete(id)}
                  >
                    Delete
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isEditing ? "Edit Product" : "Add New Product"}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Product Name"
            name="name"
            placeholder="e.g. MacBook Pro M3"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Price ($)"
              name="price"
              type="number"
              min="0"
              step="0.01"
              placeholder="e.g. 1299"
              value={formData.price}
              onChange={handleChange}
              required
            />

            <Input
              label="Stock Quantity"
              name="stock"
              type="number"
              min="0"
              placeholder="e.g. 15"
              value={formData.stock}
              onChange={handleChange}
            />
          </div>

          <Select
            label="Category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            options={categoryOptions}
            required
          />

          <Input
            label="Image URL"
            name="image"
            placeholder="https://images.unsplash.com/..."
            value={formData.image}
            onChange={handleChange}
          />

          <Textarea
            label="Description"
            name="description"
            placeholder="Describe the key features, specs, and details..."
            value={formData.description}
            onChange={handleChange}
            rows={4}
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button
              variant="outline"
              type="button"
              onClick={() => setIsModalOpen(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              disabled={submitting}
            >
              {submitting
                ? "Saving..."
                : isEditing
                ? "Update Product"
                : "Create Product"}
            </Button>
          </div>
        </form>
      </Modal>
    </AdminLayout>
  );
}

export default AdminProducts;