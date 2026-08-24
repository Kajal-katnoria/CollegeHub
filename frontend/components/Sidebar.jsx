"use client";

import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-16 hidden md:flex flex-col w-72 h-[calc(100vh-64px)] bg-white border-r border-gray-200 dark:bg-gray-900 dark:border-gray-700 overflow-y-auto">

      {/* Main */}
      <div className="p-6">

        <h3 className="text-sm font-bold text-gray-400 uppercase mb-4">
          Main
        </h3>

        <div className="space-y-2">

          <Link
            href="/dashboard"
            className="flex items-center gap-4 px-4 py-4 rounded-xl bg-blue-600 text-white"
          >
            <span className="text-xl">🏠</span>
            <span>Dashboard</span>
          </Link>

          <Link
            href="/event"
            className="flex items-center gap-4 px-4 py-4 rounded-xl text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            <span className="text-xl">🗓️</span>
            <span>Events</span>
          </Link>

          <Link
            href="/marketplace"
            className="flex items-center gap-4 px-4 py-4 rounded-xl text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            <span className="text-xl">🛒</span>
            <span>Marketplace</span>
          </Link>

          <Link
            href="/lostfound"
            className="flex items-center gap-4 px-4 py-4 rounded-xl text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            <span className="text-xl">🔎</span>
            <span>Lost &amp; Found</span>
          </Link>

          <Link
            href="/complaints"
            className="flex items-center gap-4 px-4 py-4 rounded-xl text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            <span className="text-xl">📝</span>
            <span>Complaints</span>
          </Link>

        </div>

      </div>

      {/* Community */}
      <div className="px-6">

        <h3 className="text-sm font-bold text-gray-400 uppercase mb-4">
          Community
        </h3>

        <div className="space-y-2">

          <Link
            href="/clubs"
            className="flex items-center gap-4 px-4 py-4 rounded-xl text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            <span className="text-xl">👥</span>
            <span>Clubs</span>
          </Link>

          <Link
            href="/chat"
            className="flex items-center gap-4 px-4 py-4 rounded-xl text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            <span className="text-xl">💬</span>
            <span>Messages</span>
          </Link>

          <Link
            href="/notification"
            className="flex items-center gap-4 px-4 py-4 rounded-xl text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            <span className="text-xl">🔔</span>
            <span>Notifications</span>
          </Link>

        </div>

      </div>

      {/* Account */}
      <div className="px-6 mt-8">

        <h3 className="text-sm font-bold text-gray-400 uppercase mb-4">
          Account
        </h3>

        <div className="space-y-2">

          <Link
            href="/profile"
            className="flex items-center gap-4 px-4 py-4 rounded-xl text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            <span className="text-xl">👤</span>
            <span>Profile</span>
          </Link>

          <Link
            href="/login"
            className="flex items-center gap-4 px-4 py-4 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-gray-800"
          >
            <span className="text-xl">🚪</span>
            <span>Logout</span>
          </Link>

        </div>

      </div>

    </aside>
  );
}