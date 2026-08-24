"use client";

import { useEffect, useState } from "react";

export default function LostFoundPage() {

  const API_URL = "http://localhost:5000/api/lost-found";

  const [items, setItems] = useState([]);

  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    date: "",
    type: "LOST",
    image: "",
  });


  const fetchItems = async () => {
    try {

      const token = localStorage.getItem("token");

      const response = await fetch(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      setItems(data);

    } catch (error) {
      console.error("FETCH LOST FOUND ERROR:", error);
    }
  };


useEffect(() => {
  const loadItems = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/api/lost-found",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      setItems(data);
    } catch (error) {
      console.error("FETCH LOST FOUND ERROR:", error);
    }
  };

  loadItems();
}, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };


  const createItem = async (e) => {

    e.preventDefault();

    try {

      const token = localStorage.getItem("token");

      const response = await fetch(API_URL, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify(formData),
      });


      const data = await response.json();


      if (!response.ok) {
        alert(data.message);
        return;
      }


      setFormData({
        title: "",
        description: "",
        location: "",
        date: "",
        type: "LOST",
        image: "",
      });

      setShowForm(false);

      fetchItems();

    } catch (error) {
      console.error("CREATE ITEM ERROR:", error);
    }
  };


  const deleteItem = async (id) => {

    try {

      const token = localStorage.getItem("token");

      await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchItems();

    } catch (error) {
      console.error(error);
    }
  };


  return (
    <main className="min-h-screen pt-20 px-4 md:px-8 bg-gray-50 dark:bg-gray-950">

      <div className="max-w-6xl mx-auto">

        <div className="flex justify-between items-center mb-8">

          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              🔎 Lost & Found
            </h1>

            <p className="text-gray-500 mt-2">
              Find lost items or report something you found.
            </p>
          </div>


          <button
            onClick={() => setShowForm(!showForm)}
            className="px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            + Report Item
          </button>

        </div>


        {showForm && (

          <form
            onSubmit={createItem}
            className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow mb-8"
          >

            <h2 className="text-xl font-semibold mb-5 text-gray-900 dark:text-white">
              Report Lost / Found Item
            </h2>


            <div className="grid md:grid-cols-2 gap-4">

              <input
                name="title"
                placeholder="Item name"
                value={formData.title}
                onChange={handleChange}
                required
                className="p-3 border rounded-lg dark:bg-gray-800 dark:text-white"
              />

              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="p-3 border rounded-lg dark:bg-gray-800 dark:text-white"
              >
                <option value="LOST">Lost</option>
                <option value="FOUND">Found</option>
              </select>


              <input
                name="location"
                placeholder="Location"
                value={formData.location}
                onChange={handleChange}
                required
                className="p-3 border rounded-lg dark:bg-gray-800 dark:text-white"
              />


              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="p-3 border rounded-lg dark:bg-gray-800 dark:text-white"
              />


              <textarea
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleChange}
                required
                className="p-3 border rounded-lg md:col-span-2 dark:bg-gray-800 dark:text-white"
              />


              <input
                name="image"
                placeholder="Image URL (optional)"
                value={formData.image}
                onChange={handleChange}
                className="p-3 border rounded-lg md:col-span-2 dark:bg-gray-800 dark:text-white"
              />

            </div>


            <button
              type="submit"
              className="mt-5 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Submit
            </button>

          </form>

        )}


        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

          {items.map((item) => (

            <div
              key={item.id}
              className="bg-white dark:bg-gray-900 rounded-xl shadow overflow-hidden"
            >

              {item.image && (
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-48 object-cover"
                />
              )}


              <div className="p-5">

                <div className="flex justify-between">

                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {item.title}
                  </h2>

                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      item.type === "LOST"
                        ? "bg-red-100 text-red-600"
                        : "bg-green-100 text-green-600"
                    }`}
                  >
                    {item.type}
                  </span>

                </div>


                <p className="mt-3 text-gray-600 dark:text-gray-300">
                  {item.description}
                </p>


                <p className="mt-3 text-sm text-gray-500">
                  📍 {item.location}
                </p>


                <p className="text-sm text-gray-500">
                  📅 {new Date(item.date).toLocaleDateString()}
                </p>


                <p className="text-sm text-gray-500 mt-2">
                  Posted by {item.user?.name}
                </p>


                <button
                  onClick={() => deleteItem(item.id)}
                  className="mt-4 text-red-500 hover:text-red-700"
                >
                  Delete
                </button>

              </div>

            </div>

          ))}

        </div>

      </div>

    </main>
  );
}