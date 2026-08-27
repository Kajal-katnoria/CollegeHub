"use client";

import { useEffect, useState } from "react";

export default function ClubsPage() {
  const API_URL ="https://collegehub-backend-kesi.onrender.com/api/clubs";

  const [clubs, setClubs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    image: "",
  });

  // =========================
  // FETCH CLUBS
  // =========================

  useEffect(() => {
    const loadClubs = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          console.error("Token not found");
          setClubs([]);
          return;
        }

        const response = await fetch(API_URL, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        console.log("CLUB API RESPONSE:", data);

        if (!response.ok) {
          console.error("CLUB API ERROR:", data);
          setClubs([]);
          return;
        }

        // Make sure clubs is always an array
        if (Array.isArray(data)) {
          setClubs(data);
        } else {
          console.error("Expected array but received:", data);
          setClubs([]);
        }
      } catch (error) {
        console.error("GET CLUBS ERROR:", error);
        setClubs([]);
      } finally {
        setLoading(false);
      }
    };

    loadClubs();
  }, []);

  // =========================
  // HANDLE INPUT
  // =========================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // FETCH CLUBS AGAIN
  // =========================

  const fetchClubs = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      console.log("UPDATED CLUBS:", data);

      if (!response.ok) {
        console.error("FETCH CLUBS ERROR:", data);
        return;
      }

      if (Array.isArray(data)) {
        setClubs(data);
      } else {
        setClubs([]);
      }
    } catch (error) {
      console.error("FETCH CLUBS ERROR:", error);
    }
  };

  // =========================
  // CREATE CLUB
  // =========================

  const createClub = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first.");
        return;
      }

      const response = await fetch(API_URL, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify(formData),
      });

      const data = await response.json();

      console.log("CREATE CLUB RESPONSE:", data);

      if (!response.ok) {
        alert(data.message || "Failed to create club");
        return;
      }

      alert("Club created successfully!");

      setFormData({
        name: "",
        description: "",
        category: "",
        image: "",
      });

      setShowForm(false);

      await fetchClubs();
    } catch (error) {
      console.error("CREATE CLUB ERROR:", error);
      alert("Unable to connect to server.");
    }
  };

  // =========================
  // JOIN CLUB
  // =========================

  const joinClub = async (id) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first.");
        return;
      }

      const response = await fetch(`${API_URL}/${id}/join`, {
        method: "POST",

        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      console.log("JOIN CLUB RESPONSE:", data);

      if (!response.ok) {
        alert(data.message || "Failed to join club");
        return;
      }

      alert("You joined the club!");

      await fetchClubs();
    } catch (error) {
      console.error("JOIN CLUB ERROR:", error);
      alert("Unable to connect to server.");
    }
  };

  // =========================
  // LEAVE CLUB
  // =========================

  const leaveClub = async (id) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first.");
        return;
      }

      const response = await fetch(`${API_URL}/${id}/leave`, {
        method: "DELETE",

        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      console.log("LEAVE CLUB RESPONSE:", data);

      if (!response.ok) {
        alert(data.message || "Failed to leave club");
        return;
      }

      alert("You left the club.");

      await fetchClubs();
    } catch (error) {
      console.error("LEAVE CLUB ERROR:", error);
      alert("Unable to connect to server.");
    }
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <main className="min-h-screen pt-20 px-4 md:px-8 bg-gray-50 dark:bg-gray-950">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              Loading clubs...
            </p>
          </div>
        </div>
      </main>
    );
  }

  // =========================
  // PAGE
  // =========================

  return (
    <main className="min-h-screen pt-20 px-4 md:px-8 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-6xl mx-auto">

        {/* =========================
            HEADER
        ========================= */}

        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">

          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              🏫 College Clubs
            </h1>

            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Discover clubs and join communities on campus.
            </p>
          </div>

          <button
            onClick={() => setShowForm(!showForm)}
            className="px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            {showForm ? "✕ Close" : "+ Create Club"}
          </button>

        </div>

        {/* =========================
            CREATE CLUB FORM
        ========================= */}

        {showForm && (
          <form
            onSubmit={createClub}
            className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow mb-8 border border-gray-200 dark:border-gray-800"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-5">
              Create a Club
            </h2>

            <div className="grid md:grid-cols-2 gap-4">

              {/* Club Name */}

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Club Name
                </label>

                <input
                  name="name"
                  placeholder="e.g. Coding Club"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Category */}

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Category
                </label>

                <input
                  name="category"
                  placeholder="e.g. Technology"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Description */}

              <div className="md:col-span-2">
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Description
                </label>

                <textarea
                  name="description"
                  placeholder="Describe your club..."
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Image */}

              <div className="md:col-span-2">
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Image URL
                </label>

                <input
                  name="image"
                  placeholder="https://example.com/club-image.jpg"
                  value={formData.image}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

            </div>

            <button
              type="submit"
              className="mt-5 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Create Club
            </button>
          </form>
        )}

        {/* =========================
            EMPTY STATE
        ========================= */}

        {clubs.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-10 text-center border border-gray-200 dark:border-gray-800">

            <div className="text-5xl mb-4">
              🏫
            </div>

            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              No clubs available
            </h2>

            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Be the first to create a club!
            </p>

          </div>
        ) : (

          /* =========================
             CLUB CARDS
          ========================= */

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

            {clubs.map((club) => (

              <div
                key={club.id}
                className="bg-white dark:bg-gray-900 rounded-xl shadow overflow-hidden border border-gray-200 dark:border-gray-800 hover:shadow-lg transition"
              >

                {/* Image */}

                {club.image ? (
                  <img
                    src={club.image}
                    alt={club.name}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    <span className="text-5xl">
                      🏫
                    </span>
                  </div>
                )}

                {/* Content */}

                <div className="p-5">

                  {/* Category */}

                  <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                    {club.category}
                  </span>

                  {/* Name */}

                  <h2 className="text-xl font-bold mt-3 text-gray-900 dark:text-white">
                    {club.name}
                  </h2>

                  {/* Description */}

                  <p className="mt-2 text-gray-600 dark:text-gray-300 line-clamp-3">
                    {club.description}
                  </p>

                  {/* Members */}

                  <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                    👥{" "}
                    {club.memberCount ??
                      club._count?.members ??
                      0}{" "}
                    members
                  </p>

                  {/* Join / Leave */}

                  {club.isMember ? (

                    <button
                      onClick={() => leaveClub(club.id)}
                      className="mt-4 w-full py-2.5 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 transition"
                    >
                      Leave Club
                    </button>

                  ) : (

                    <button
                      onClick={() => joinClub(club.id)}
                      className="mt-4 w-full py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                    >
                      Join Club
                    </button>

                  )}

                </div>

              </div>

            ))}

          </div>
        )}

      </div>
    </main>
  );
}