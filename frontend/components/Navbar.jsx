"use client";

import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import NotificationBell from "./NotificationBell";
export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-white border-b border-gray-200 dark:bg-gray-900 dark:border-gray-700">
      
      <div className="h-full px-4 md:px-6 flex items-center justify-between">

        {/* Logo */}
        <Link
          href="/dashboard"
          className="text-xl md:text-2xl font-bold text-blue-600"
        >
          🎓 CollegeHub
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">

          <Link
            href="/dashboard"
            className="text-gray-700 hover:text-blue-600 dark:text-gray-200"
          >
            Dashboard
          </Link>

          <Link
            href="/event"
            className="text-gray-700 hover:text-blue-600 dark:text-gray-200"
          >
            Events
          </Link>
          <Link
  href="/clubs"
  className="text-gray-700 hover:text-blue-600 dark:text-gray-200"
>
  Clubs
</Link>

          <Link
            href="/marketplace"
            className="text-gray-700 hover:text-blue-600 dark:text-gray-200"
          >
            Marketplace
          </Link>

          <Link
            href="/lost-found"
            className="text-gray-700 hover:text-blue-600 dark:text-gray-200"
          >
            Lost & Found
          </Link>

          <Link
            href="/complaints"
            className="text-gray-700 hover:text-blue-600 dark:text-gray-200"
          >
            Complaints
          </Link>

        </div>

        {/* Right Side */}
        <div className="flex items-center gap-3">
        <NotificationBell />
          {/* Theme */}
          <ThemeToggle />

          {/* Notifications */}
          <Link
            href="/notification"
            className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-xl"
          >
            🔔
          </Link>
          <Link href="/chat">
    💬 Messages
</Link>

          {/* Profile */}
          <Link
            href="/profile"
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200"
          >
            <span className="text-xl">👤</span>
            <span className="hidden sm:block">Profile</span>
          </Link>

        </div>

      </div>

    </nav>
  );
}