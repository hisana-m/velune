
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import toast from "react-hot-toast";

import {
  fetchAdminProducts,
  addAdminProduct,
  updateAdminProduct,
  deleteAdminProduct,
} from "../../../redux/adminProductSlice";

import { formatPrice } from "../../../data/products";

const emptyForm = {
  name: "",
  price: "",
  category: "",
  categorySlug: "",
  image: "",
  description: "",
  stock: "",
  isBestSeller: false,
};

const PAGE_SIZE = 8;

export default function AdminProducts() {
  const dispatch = useDispatch();

  const { products, loading, error } = useSelector(
    (state) => state.adminProducts
  );

  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(fetchAdminProducts());
  }, [dispatch]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) =>
      product.name?.toLowerCase().includes(search.toLowerCase())
    );
  }, [products, search]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / PAGE_SIZE)
  );

  const currentProducts = filteredProducts.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const openAddForm = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setShowForm(true);
  };

  const openEditForm = (product) => {
    setEditingId(product.id);

    setFormData({
      name: product.name || "",
      price: product.price ?? "",
      category: product.category || "",
      categorySlug: product.categorySlug || "",
      image: product.image || "",
      description: product.description || "",
      stock: product.stock ?? "",
      isBestSeller: Boolean(product.isBestSeller),
    });

    setShowForm(true);
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.category.trim() ||
      formData.price === "" ||
      formData.stock === ""
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    const productData = {
      ...formData,
      price: Number(formData.price),
      stock: Number(formData.stock),
      currency: "AED",
    };

    try {
      if (editingId !== null) {
        await dispatch(
          updateAdminProduct({
            id: editingId,
            ...productData,
          })
        ).unwrap();

        toast.success("Product updated successfully");
      } else {
        await dispatch(addAdminProduct(productData)).unwrap();

        toast.success("Product added successfully");
        setPage(1);
      }

      setShowForm(false);
      setEditingId(null);
      setFormData(emptyForm);
    } catch (error) {
      toast.error(error || "Something went wrong");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      await dispatch(deleteAdminProduct(id)).unwrap();
      toast.success("Product deleted successfully");
    } catch (error) {
      toast.error(error || "Unable to delete product");
    }
  };

  return (
    <div>
      <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif text-[#491225]">
            Product Management
          </h1>

          <p className="mt-2 text-sm text-[#8B7276]">
            Add, edit and manage your jewellery products.
          </p>
        </div>

        <button
          onClick={openAddForm}
          className="flex items-center gap-2 rounded-lg bg-[#491225] px-5 py-3 text-sm text-white hover:bg-[#350B19]"
        >
          <Plus size={17} />
          Add Product
        </button>
      </div>

      <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={(event) => {
          setSearch(event.target.value);
          setPage(1);
        }}
        className="mb-5 w-full max-w-sm rounded-lg border border-[#D8C3C7] bg-[#FEF7F2] px-4 py-3 text-sm text-[#491225] outline-none focus:border-[#491225]"
      />

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-8 rounded-xl border border-[#E9DED4] bg-[#FEF7F2] p-6"
        >
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[#491225]">
              {editingId !== null ? "Edit Product" : "Add New Product"}
            </h2>

            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="text-[#491225]"
              aria-label="Close form"
            >
              <X size={20} />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {[
              ["name", "Product Name", "text"],
              ["price", "Price (AED)", "number"],
              ["category", "Category", "text"],
              ["categorySlug", "Category Slug", "text"],
              ["image", "Image Path", "text"],
              ["stock", "Stock Quantity", "number"],
            ].map(([name, label, type]) => (
              <label key={name} className="text-sm text-[#491225]">
                {label}

                <input
                  name={name}
                  type={type}
                  min={type === "number" ? "0" : undefined}
                  step={name === "price" ? "0.01" : undefined}
                  value={formData[name]}
                  onChange={handleChange}
                  required={["name", "price", "category", "stock"].includes(name)}
                  className="mt-2 w-full rounded-lg border border-[#D8C3C7] bg-white px-4 py-3 outline-none focus:border-[#491225]"
                />
              </label>
            ))}
          </div>

          <label className="mt-4 block text-sm text-[#491225]">
            Description

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="mt-2 w-full rounded-lg border border-[#D8C3C7] bg-white px-4 py-3 outline-none focus:border-[#491225]"
            />
          </label>

          <label className="mt-4 flex items-center gap-2 text-sm text-[#491225]">
            <input
              type="checkbox"
              name="isBestSeller"
              checked={formData.isBestSeller}
              onChange={handleChange}
            />
            Mark as Best Seller
          </label>

          <button
            type="submit"
            className="mt-5 rounded-lg bg-[#491225] px-6 py-3 text-sm text-white hover:bg-[#350B19]"
          >
            {editingId !== null ? "Update Product" : "Save Product"}
          </button>
        </form>
      )}

      <div className="overflow-hidden rounded-xl border border-[#E9DED4] bg-[#FEF7F2]">
        {loading ? (
          <p className="p-8 text-center text-[#8B7276]">
            Loading products...
          </p>
        ) : error ? (
          <p className="p-8 text-center text-red-600">{error}</p>
        ) : currentProducts.length === 0 ? (
          <p className="p-8 text-center text-[#8B7276]">
            No products found.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead className="bg-[#491225] text-white">
                <tr>
                  <th className="px-5 py-4">Product</th>
                  <th className="px-5 py-4">Category</th>
                  <th className="px-5 py-4">Price</th>
                  <th className="px-5 py-4">Stock</th>
                  <th className="px-5 py-4">Actions</th>
                </tr>
              </thead>

              <tbody>
                {currentProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="border-t border-[#E9DED4] text-[#491225]"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {product.image && (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-12 w-12 rounded-lg bg-[#F5E8D5] object-cover"
                          />
                        )}

                        <span className="font-medium">
                          {product.name}
                        </span>
                      </div>
                    </td>

                    <td className="px-5 py-4">{product.category}</td>

                    <td className="px-5 py-4">
                      {formatPrice(Number(product.price || 0))}
                    </td>

                    <td className="px-5 py-4">{product.stock ?? 0}</td>

                    <td className="px-5 py-4">
                      <div className="flex gap-3">
                        <button
                          onClick={() => openEditForm(product)}
                          className="text-blue-700 hover:text-blue-900"
                          aria-label="Edit product"
                        >
                          <Pencil size={18} />
                        </button>

                        <button
                          onClick={() => handleDelete(product.id)}
                          className="text-red-600 hover:text-red-800"
                          aria-label="Delete product"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm text-[#491225]">
        <p>
          Page {page} of {totalPages}
        </p>

        <div className="flex gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage((current) => current - 1)}
            className="rounded-lg border border-[#491225] px-4 py-2 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Previous
          </button>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((current) => current + 1)}
            className="rounded-lg border border-[#491225] px-4 py-2 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
