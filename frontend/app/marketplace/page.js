"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

import {
  getItems,
  createItem,
} from "../../services/marketplaceService";

export default function Marketplace() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  // Form fields
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
  });

  // Selected image file
  const [image, setImage] = useState(null);

  // Loading states
  const [loading, setLoading] = useState(false);
  const [loadingItems, setLoadingItems] = useState(true);

  // Image preview
  const [imagePreview, setImagePreview] = useState(null);

  // =========================
  // LOAD MARKETPLACE ITEMS
  // =========================

  const loadItems = async () => {
    try {
      setLoadingItems(true);

      const data = await getItems();

      console.log("MARKETPLACE ITEMS:", data);

      if (Array.isArray(data)) {
        setItems(data);
      }
    } catch (error) {
      console.error("Failed to fetch items:", error);
    } finally {
      setLoadingItems(false);
    }
  };

  useEffect(() => {
  const fetchItems = async () => {
    try {
      setLoadingItems(true);

      const data = await getItems();

      console.log("MARKETPLACE ITEMS:", data);

      if (Array.isArray(data)) {
        setItems(data);
      }
    } catch (error) {
      console.error("Failed to fetch items:", error);
    } finally {
      setLoadingItems(false);
    }
  };

  fetchItems();
}, []);

  // =========================
  // HANDLE TEXT INPUT
  // =========================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // HANDLE IMAGE
  // =========================

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    // Only images
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    // 5 MB limit
    if (file.size > 5 * 1024 * 1024) {
      alert("Image must be smaller than 5MB.");
      return;
    }

    setImage(file);

    // Create preview
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  };

  // =========================
  // SUBMIT PRODUCT
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please log in first.");
        return;
      }

      if (!image) {
        alert("Please select a product image.");
        return;
      }

      setLoading(true);

      // IMPORTANT:
      // We are sending FormData instead of JSON
      const data = new FormData();

      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("price", formData.price);
      data.append("category", formData.category);

      // Add image file
      data.append("image", image);

      console.log("Uploading marketplace item...");

      const response = await createItem(data, token);

      console.log("PRODUCT CREATED:", response);

      // Reload marketplace
      await loadItems();

      // Reset form
      setFormData({
        title: "",
        description: "",
        price: "",
        category: "",
      });

      setImage(null);
      setImagePreview(null);

      // Reset file input
      const fileInput = document.getElementById("marketplace-image");

      if (fileInput) {
        fileInput.value = "";
      }

      alert("Product added successfully.");
    } catch (error) {
      console.error("CREATE PRODUCT ERROR:", error);

      alert(
        error.message || "Failed to add product."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // FILTER PRODUCTS
  // =========================

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.title
      ?.toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      category === "All" ||
      item.category === category;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">

        {/* =========================
            HEADER
        ========================= */}

        <h1 className="text-5xl font-bold text-center mb-3">
          🛒 Campus Marketplace
        </h1>

        <p className="text-center text-gray-600 mb-10">
          Buy and sell items inside your college.
        </p>

        {/* =========================
            ADD PRODUCT FORM
        ========================= */}

        <div className="bg-white rounded-3xl shadow-xl p-8 mb-10">

          <h2 className="text-3xl font-bold mb-6">
            Add New Product
          </h2>

          <form
            onSubmit={handleSubmit}
            className="grid md:grid-cols-2 gap-4"
          >

            {/* TITLE */}

            <input
              type="text"
              name="title"
              placeholder="Product title"
              value={formData.title}
              onChange={handleChange}
              className="border p-4 rounded-xl"
              required
            />

            {/* PRICE */}

            <input
              type="number"
              name="price"
              placeholder="Price"
              min="0"
              value={formData.price}
              onChange={handleChange}
              className="border p-4 rounded-xl"
              required
            />

            {/* CATEGORY */}

            <input
              type="text"
              name="category"
              placeholder="Category e.g. Books"
              value={formData.category}
              onChange={handleChange}
              className="border p-4 rounded-xl"
              required
            />

            {/* IMAGE UPLOAD */}

            <div className="border p-4 rounded-xl">

              <label
                htmlFor="marketplace-image"
                className="block font-semibold mb-2"
              >
                Product Image
              </label>

              <input
                id="marketplace-image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full"
                required
              />

              <p className="text-sm text-gray-500 mt-2">
                Maximum size: 5MB
              </p>

            </div>

            {/* IMAGE PREVIEW */}

            {imagePreview && (
              <div className="md:col-span-2">

                <p className="font-semibold mb-2">
                  Image Preview
                </p>

                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-48 h-32 object-cover rounded-xl border"
                />

              </div>
            )}

            {/* DESCRIPTION */}

            <textarea
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
              className="border p-4 rounded-xl md:col-span-2"
              rows="4"
              required
            />

            {/* SUBMIT */}

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white p-4 rounded-xl md:col-span-2 hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading
                ? "Uploading..."
                : "Add Product"}
            </button>

          </form>
        </div>

        {/* =========================
            SEARCH + FILTER
        ========================= */}

        <div className="bg-white rounded-3xl shadow-xl p-6 mb-10">

          <input
            type="text"
            placeholder="🔍 Search products..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-full border p-4 rounded-xl mb-6"
          />

          <div className="flex flex-wrap gap-3">

            <button
              onClick={() => setCategory("All")}
              className={`px-5 py-2 rounded-full ${
                category === "All"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200"
              }`}
            >
              All
            </button>

            <button
              onClick={() => setCategory("Food")}
              className={`px-5 py-2 rounded-full ${
                category === "Food"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200"
              }`}
            >
              Food
            </button>

            <button
              onClick={() => setCategory("Books")}
              className={`px-5 py-2 rounded-full ${
                category === "Books"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200"
              }`}
            >
              Books
            </button>

            <button
              onClick={() =>
                setCategory("Electronics")
              }
              className={`px-5 py-2 rounded-full ${
                category === "Electronics"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200"
              }`}
            >
              Electronics
            </button>

          </div>
        </div>

        {/* =========================
            PRODUCTS
        ========================= */}

        {loadingItems ? (

          <div className="text-center py-10">
            <p className="text-gray-500">
              Loading marketplace...
            </p>
          </div>

        ) : (

          <div className="grid md:grid-cols-3 gap-6">

            {filteredItems.map((item) => (

              <div
                key={item.id}
                className="bg-white rounded-3xl overflow-hidden shadow-lg hover:scale-105 transition"
              >

                {/* PRODUCT IMAGE */}

                <img
                  src={
                    item.image ||
                    "https://placehold.co/600x400"
                  }
                  alt={item.title}
                  className="w-full h-56 object-cover"
                />

                <div className="p-6">

                  {/* CATEGORY */}

                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                    {item.category}
                  </span>

                  {/* TITLE */}

                  <h2 className="text-2xl font-bold mt-4">
                    {item.title}
                  </h2>

                  {/* DESCRIPTION */}

                  <p className="text-gray-600 mt-3 line-clamp-3">
                    {item.description}
                  </p>

                  {/* PRICE + VIEW */}

                  <div className="flex justify-between items-center mt-6">

                    <h3 className="text-3xl font-bold">
                      ₹{item.price}
                    </h3>

                    <Link
                      href={`/marketplace/${item.id}`}
                      className="bg-blue-600 text-white px-5 py-3 rounded-xl hover:bg-blue-700"
                    >
                      View
                    </Link>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

        {/* NO PRODUCTS */}

        {!loadingItems &&
          filteredItems.length === 0 && (
            <div className="text-center mt-10 text-gray-500">
              No products found.
            </div>
          )}

      </div>
    </div>
  );
}