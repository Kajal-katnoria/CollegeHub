"use client";

import { useState } from "react";

export default function LoginPage() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);

        try {
            const res = await fetch(
                "https://collegehub-backend-kesi.onrender.com/api/auth/login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                    },

                    body: JSON.stringify(formData),
                }
            );

            const data = await res.json();

            console.log("LOGIN RESPONSE:", data);

            if (!res.ok) {
                alert(
                    data.message ||
                    "Login failed"
                );

                return;
            }

            if (data.token) {
                // =====================================
                // SAVE JWT TOKEN
                // =====================================

                localStorage.setItem(
                    "token",
                    data.token
                );

                // =====================================
                // GET USER ID
                // =====================================

                const userId =
                    data.user?.id ??
                    data.userId ??
                    data.id;

                console.log(
                    "USER ID FROM LOGIN:",
                    userId
                );

                if (!userId) {
                    console.error(
                        "Login succeeded but userId was not returned:",
                        data
                    );

                    alert(
                        "Login successful, but server did not return user ID."
                    );

                    return;
                }

                // =====================================
                // SAVE USER ID
                // =====================================

                localStorage.setItem(
                    "userId",
                    String(userId)
                );

                console.log(
                    "Saved userId:",
                    localStorage.getItem(
                        "userId"
                    )
                );

                alert(
                    "Login successful!"
                );

                window.location.href = "/";
            } else {
                alert(
                    data.message ||
                    "Invalid login response"
                );
            }
        } catch (error) {
            console.error(
                "LOGIN ERROR:",
                error
            );

            alert(
                "Login failed. Make sure backend is running."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">

            <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-10">

                <div className="text-center mb-8">

                    <h1 className="text-5xl mb-4">
                        🎓
                    </h1>

                    <h2 className="text-4xl font-bold">
                        Welcome Back
                    </h2>

                    <p className="text-gray-500 mt-3">
                        Sign in to continue to CollegeHub
                    </p>

                </div>

                <form onSubmit={handleSubmit}>

                    <div className="mb-5">

                        <label className="block mb-2 font-semibold">
                            Email
                        </label>

                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full border p-4 rounded-xl"
                            required
                        />

                    </div>

                    <div className="mb-6">

                        <label className="block mb-2 font-semibold">
                            Password
                        </label>

                        <input
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full border p-4 rounded-xl"
                            required
                        />

                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white p-4 rounded-xl hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading
                            ? "Logging in..."
                            : "Login"}
                    </button>

                </form>

                <div className="text-center mt-6">

                    <p className="text-gray-500">
                        Do not have an account?
                    </p>

                    <a
                        href="/register"
                        className="text-blue-600 font-bold"
                    >
                        Register
                    </a>

                </div>

            </div>

        </div>
    );
}