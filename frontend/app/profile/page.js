"use client";

import { useEffect, useState } from "react";

export default function ProfilePage() {
  const API_URL = "http://localhost:5000/api/profile";

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
  });

  // Profile picture states
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // =========================
  // FETCH PROFILE
  // =========================

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          alert("Please login first");
          return;
        }

        const response = await fetch(API_URL, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        console.log("PROFILE DATA:", data);

        if (!response.ok) {
          alert(data.message || "Failed to load profile");
          return;
        }

        setProfile(data);

        setFormData({
          name: data.name || "",
          email: data.email || "",
        });

        // Set existing profile picture
        if (data.profilePicture) {
          setPreviewImage(
            data.profilePicture.startsWith("http")
              ? data.profilePicture
              : `http://localhost:5000${data.profilePicture}`
          );
        }
      } catch (error) {
        console.error("PROFILE ERROR:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  // =========================
  // SELECT PROFILE IMAGE
  // =========================

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // Check image type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    // Check size - 5 MB
    if (file.size > 5 * 1024 * 1024) {
      alert("Image must be smaller than 5 MB");
      return;
    }

    setSelectedImage(file);

    // Preview selected image
    const previewUrl = URL.createObjectURL(file);
    setPreviewImage(previewUrl);
  };

  // =========================
  // UPLOAD PROFILE IMAGE
  // =========================

  const uploadProfilePicture = async () => {
    if (!selectedImage) {
      alert("Please select an image first");
      return;
    }

    try {
      setUploadingImage(true);

      const token = localStorage.getItem("token");

      const imageFormData = new FormData();

      imageFormData.append("profilePicture", selectedImage);

      const response = await fetch(`${API_URL}/picture`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: imageFormData,
      });

      const data = await response.json();

      console.log("PROFILE PICTURE RESPONSE:", data);

      if (!response.ok) {
        alert(data.message || "Failed to upload profile picture");
        return;
      }

      /*
        Backend may return:
        { profilePicture: "/uploads/..." }

        or:
        { user: { profilePicture: "/uploads/..." } }
      */

      const newProfilePicture =
        data.profilePicture || data.user?.profilePicture;

      if (newProfilePicture) {
        const fullImageUrl = newProfilePicture.startsWith("http")
          ? newProfilePicture
          : `http://localhost:5000${newProfilePicture}`;

        setPreviewImage(fullImageUrl);

        setProfile((previousProfile) => ({
          ...previousProfile,
          profilePicture: newProfilePicture,
        }));
      }

      setSelectedImage(null);

      alert("Profile picture updated successfully");
    } catch (error) {
      console.error("UPLOAD PROFILE PICTURE ERROR:", error);
      alert("Failed to upload profile picture");
    } finally {
      setUploadingImage(false);
    }
  };

  // =========================
  // UPDATE PROFILE
  // =========================

  const updateProfile = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(API_URL, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to update profile");
        return;
      }

      setProfile({
        ...profile,
        ...data,
      });

      setFormData({
        name: data.name || formData.name,
        email: data.email || formData.email,
      });

      setEditing(false);

      alert("Profile updated successfully");
    } catch (error) {
      console.error("UPDATE PROFILE ERROR:", error);
    }
  };

  // =========================
  // CHANGE PASSWORD
  // =========================

  const changePassword = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(passwordData),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to change password");
        return;
      }

      alert("Password changed successfully");

      setPasswordData({
        currentPassword: "",
        newPassword: "",
      });
    } catch (error) {
      console.error("CHANGE PASSWORD ERROR:", error);
    }
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <main className="min-h-screen pt-20 px-6 flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-300">
          Loading profile...
        </p>
      </main>
    );
  }

  // =========================
  // PROFILE NOT FOUND
  // =========================

  if (!profile) {
    return (
      <main className="min-h-screen pt-20 px-6 flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-300">
          Profile not found.
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-20 px-4 md:px-8 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-5xl mx-auto">

        {/* =========================
            PAGE TITLE
        ========================= */}

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          👤 My Profile
        </h1>

        <div className="grid md:grid-cols-3 gap-6">

          {/* =========================
              PROFILE CARD
          ========================= */}

          <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-6">

            {/* PROFILE IMAGE */}

            <div className="flex flex-col items-center">

              {previewImage ? (
                <img
                  src={previewImage}
                  alt="Profile"
                  className="w-28 h-28 rounded-full object-cover border-4 border-blue-500 shadow"
                />
              ) : (
                <div className="w-28 h-28 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-5xl">
                  👤
                </div>
              )}

              {/* UPLOAD BUTTON */}

              <label
                htmlFor="profile-picture"
                className="mt-4 cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                📷 Choose Picture
              </label>

              <input
                id="profile-picture"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />

              {/* SELECTED IMAGE */}

              {selectedImage && (
                <div className="mt-4 text-center w-full">

                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {selectedImage.name}
                  </p>

                  <button
                    onClick={uploadProfilePicture}
                    disabled={uploadingImage}
                    className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition"
                  >
                    {uploadingImage
                      ? "Uploading..."
                      : "Save Picture"}
                  </button>

                </div>
              )}

            </div>

            {/* NAME */}

            <h2 className="text-xl font-bold text-center mt-4 text-gray-900 dark:text-white">
              {profile.name}
            </h2>

            {/* EMAIL */}

            <p className="text-center text-gray-500 dark:text-gray-400">
              {profile.email}
            </p>

            {/* STATS */}

            <div className="mt-6 space-y-3">

              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                🔔 {profile._count?.notifications || 0} notifications
              </div>

              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                🔎 {profile._count?.lostFound || 0} posts
              </div>

              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                🏫 {profile.clubs?.length || 0} clubs
              </div>

            </div>

          </div>

          {/* =========================
              RIGHT SIDE
          ========================= */}

          <div className="md:col-span-2 space-y-6">

            {/* =========================
                PERSONAL INFORMATION
            ========================= */}

            <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-6">

              <div className="flex justify-between mb-5">

                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Personal Information
                </h2>

                <button
                  onClick={() => setEditing(!editing)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  {editing ? "Cancel" : "Edit"}
                </button>

              </div>

              {editing ? (

                <form
                  onSubmit={updateProfile}
                  className="space-y-4"
                >

                  {/* NAME */}

                  <div>
                    <label className="block text-sm text-gray-500 mb-1">
                      Name
                    </label>

                    <input
                      name="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          name: e.target.value,
                        })
                      }
                      className="w-full p-3 border rounded-lg dark:bg-gray-800 dark:text-white"
                      required
                    />
                  </div>

                  {/* EMAIL */}

                  <div>
                    <label className="block text-sm text-gray-500 mb-1">
                      Email
                    </label>

                    <input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          email: e.target.value,
                        })
                      }
                      className="w-full p-3 border rounded-lg dark:bg-gray-800 dark:text-white"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Save Changes
                  </button>

                </form>

              ) : (

                <div className="space-y-4">

                  {/* NAME */}

                  <div>
                    <p className="text-sm text-gray-500">
                      Name
                    </p>

                    <p className="text-lg text-gray-900 dark:text-white">
                      {profile.name}
                    </p>
                  </div>

                  {/* EMAIL */}

                  <div>
                    <p className="text-sm text-gray-500">
                      Email
                    </p>

                    <p className="text-lg text-gray-900 dark:text-white">
                      {profile.email}
                    </p>
                  </div>

                  {/* MEMBER SINCE */}

                  <div>
                    <p className="text-sm text-gray-500">
                      Member since
                    </p>

                    <p className="text-gray-900 dark:text-white">
                      {profile.createdAt
                        ? new Date(
                            profile.createdAt
                          ).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>

                </div>

              )}

            </div>

            {/* =========================
                PASSWORD
            ========================= */}

            <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-6">

              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-5">
                Change Password
              </h2>

              <form
                onSubmit={changePassword}
                className="space-y-4"
              >

                <input
                  type="password"
                  placeholder="Current password"
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      currentPassword: e.target.value,
                    })
                  }
                  className="w-full p-3 border rounded-lg dark:bg-gray-800 dark:text-white"
                  required
                />

                <input
                  type="password"
                  placeholder="New password"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      newPassword: e.target.value,
                    })
                  }
                  className="w-full p-3 border rounded-lg dark:bg-gray-800 dark:text-white"
                  required
                />

                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Change Password
                </button>

              </form>

            </div>

            {/* =========================
                CLUBS
            ========================= */}

            <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-6">

              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-5">
                My Clubs
              </h2>

              {!profile.clubs ||
              profile.clubs.length === 0 ? (

                <p className="text-gray-500">
                  You have not joined any clubs yet.
                </p>

              ) : (

                <div className="grid sm:grid-cols-2 gap-4">

                  {profile.clubs.map((member) => (

                    <div
                      key={member.id}
                      className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >

                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {member.club.name}
                      </h3>

                      <p className="text-sm text-gray-500">
                        {member.club.category}
                      </p>

                    </div>

                  ))}

                </div>

              )}

            </div>

          </div>

        </div>

      </div>
    </main>
  );
}