"use client";

import { useState, useEffect } from "react";
import {
  getEvents,
  createEvent,
  registerEvent
} from "../../services/eventService";

export default function EventsPage() {
  const [events, setEvents] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    date: ""
  });

  // =========================
  // LOAD EVENTS
  // =========================
  const loadEvents = async () => {
    try {
      const data = await getEvents();

      console.log("GET EVENTS RESPONSE:", data);

      if (Array.isArray(data)) {
        setEvents(data);
      } else {
        setEvents([]);
      }
    } catch (error) {
      console.error("GET EVENTS ERROR:", error);
    }
  };

  // =========================
  // LOAD EVENTS ON PAGE LOAD
  // =========================
 useEffect(() => {
  const fetchEvents = async () => {
    try {
      const data = await getEvents();

      console.log("GET EVENTS RESPONSE:", data);

      if (Array.isArray(data)) {
        setEvents(data);
      } else {
        setEvents([]);
      }
    } catch (error) {
      console.error("GET EVENTS ERROR:", error);
    }
  };

  fetchEvents();
}, []);
  // =========================
  // HANDLE INPUT
  // =========================
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // =========================
  // CREATE EVENT
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please log in first.");
        return;
      }

      await createEvent(formData, token);

      // Refresh events
      await loadEvents();

      // Clear form
      setFormData({
        title: "",
        description: "",
        location: "",
        date: ""
      });

      alert("Event created successfully.");
    } catch (error) {
      console.error("CREATE EVENT ERROR:", error);
      alert("Failed to create event.");
    }
  };

  // =========================
  // REGISTER EVENT
  // =========================
  const handleRegister = async (id) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please log in first.");
        return;
      }

      await registerEvent(id, token);

      alert("Registered successfully.");
    } catch (error) {
      console.error("REGISTER EVENT ERROR:", error);
      alert("Registration failed.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold mb-4">
            🎉 Campus Events
          </h1>

          <p className="text-xl text-gray-600">
            Create, discover, and register for exciting campus events.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">

          {/* CREATE EVENT */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-3xl font-bold mb-6">
              Create an Event
            </h2>

            <form onSubmit={handleSubmit}>

              <input
                className="w-full border p-4 rounded-lg mb-4"
                type="text"
                name="title"
                placeholder="Event title"
                value={formData.title}
                onChange={handleChange}
                required
              />

              <textarea
                className="w-full border p-4 rounded-lg mb-4 h-32"
                name="description"
                placeholder="Event description"
                value={formData.description}
                onChange={handleChange}
                required
              />

              <input
                className="w-full border p-4 rounded-lg mb-4"
                type="text"
                name="location"
                placeholder="Location"
                value={formData.location}
                onChange={handleChange}
                required
              />

              <input
                className="w-full border p-4 rounded-lg mb-6"
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />

              <button
                className="w-full bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700"
                type="submit"
              >
                Create Event
              </button>

            </form>
          </div>

          {/* EVENTS LIST */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-3xl font-bold mb-6">
              Upcoming Events
            </h2>

            {events.length === 0 ? (
              <p className="text-gray-500">
                No events available.
              </p>
            ) : (
              events.map((event) => (
                <div
                  key={event.id}
                  className="border rounded-xl p-6 mb-5"
                >

                  <h3 className="text-2xl font-bold">
                    {event.title}
                  </h3>

                  <p className="text-gray-600 mt-3">
                    {event.description}
                  </p>

                  <div className="mt-4 space-y-2">

                    <p>
                      📍 <strong>Location:</strong>{" "}
                      {event.location}
                    </p>

                    <p>
                      📅 <strong>Date:</strong>{" "}
                      {new Date(event.date).toLocaleDateString()}
                    </p>

                  </div>

                  <button
                    className="mt-5 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
                    onClick={() => handleRegister(event.id)}
                  >
                    Register
                  </button>

                </div>
              ))
            )}

          </div>

        </div>
      </div>
    </div>
  );
}