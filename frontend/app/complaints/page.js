"use client";

import { useState, useEffect } from "react";
import {
  getComplaints,
  createComplaint
} from "../../services/complaintService";

export default function ComplaintsPage() {
  const [complaints, setComplaints] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    const loadComplaints = async () => {
      try {
        const data = await getComplaints();

        if (Array.isArray(data)) {
          setComplaints(data);
        }
      } catch (error) {
        console.error(error);
      }
    };

    loadComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const data = await getComplaints();

      if (Array.isArray(data)) {
        setComplaints(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please log in first.");
      return;
    }

    try {
      await createComplaint(
        {
          title,
          description
        },
        token
      );

      setTitle("");
      setDescription("");

      fetchComplaints();

      alert("Complaint submitted successfully.");
    } catch (error) {
      console.error(error);
      alert("Failed to submit complaint.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold text-center mb-3">
          📝 Complaint Portal
        </h1>

        <p className="text-center text-gray-600 mb-10">
          Report hostel, classroom, campus, or maintenance issues.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <h2 className="text-3xl font-bold mb-6">
              Submit a Complaint
            </h2>

            <form onSubmit={handleSubmit}>
              <input
                className="w-full border p-4 rounded-lg mb-4"
                placeholder="Complaint title"
                value={title}
                onChange={(e) =>
                  setTitle(e.target.value)
                }
              />

              <textarea
                className="w-full border p-4 rounded-lg mb-4 h-40"
                placeholder="Describe your issue"
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
              />

              <button
                className="w-full bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700"
                type="submit"
              >
                Submit Complaint
              </button>
            </form>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <h2 className="text-3xl font-bold mb-6">
              Recent Complaints
            </h2>

            {complaints.length === 0 ? (
              <p className="text-gray-500">
                No complaints found.
              </p>
            ) : (
              complaints.map((complaint) => (
                <div
                  key={complaint.id}
                  className="border rounded-xl p-5 mb-4"
                >
                  <h3 className="text-xl font-bold">
                    {complaint.title}
                  </h3>

                  <p className="text-gray-600 mt-2">
                    {complaint.description}
                  </p>

                  <span className="inline-block mt-4 px-4 py-2 bg-yellow-100 rounded-full">
                    {complaint.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}