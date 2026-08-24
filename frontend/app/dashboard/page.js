"use client";

import Link from "next/link";

import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";

import StatCard from "@/components/StatCard";
import EventCard from "@/components/EventCard";
import ComplaintCard from "@/components/ComplaintCard";
import MarketplaceCard from "@/components/MarketplaceCard";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">

      {/* ================= NAVBAR ================= */}
      <Navbar />

      {/* ================= SIDEBAR ================= */}
      <Sidebar />

      {/* ================= MAIN CONTENT ================= */}
      <main className="pt-16 md:ml-64">

        <div className="p-4 md:p-8">

          {/* ================= WELCOME ================= */}
          <div className="mb-8">

            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Good Evening 👋
            </h1>

            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Welcome back to CollegeHub. Here is what is happening
              around your campus.
            </p>

          </div>


          {/* ================= STATISTICS ================= */}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

            <StatCard
              title="Events"
              value="12"
              icon="📅"
              description="Upcoming events"
            />

            <StatCard
              title="Complaints"
              value="4"
              icon="📝"
              description="2 pending"
            />

            <StatCard
              title="Marketplace"
              value="18"
              icon="🛒"
              description="Active listings"
            />

            <StatCard
              title="Lost & Found"
              value="7"
              icon="🔎"
              description="Recent posts"
            />

          </div>


          {/* ================= EVENTS + COMPLAINTS ================= */}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">


            {/* ================= UPCOMING EVENTS ================= */}

            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">

              <div className="flex justify-between items-center mb-5">

                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Upcoming Events
                </h2>

                <Link
                  href="/events"
                  className="text-blue-600 hover:text-blue-700 text-sm"
                >
                  View All →
                </Link>

              </div>


              <div className="space-y-4">

                <EventCard
                  title="Tech Fest 2026"
                  description="Annual technical festival"
                  date="August 25, 2026"
                  location="Main Auditorium"
                />

                <EventCard
                  title="Coding Contest"
                  description="Competitive programming contest"
                  date="August 28, 2026"
                  location="CSE Block"
                />

                <EventCard
                  title="Cultural Night"
                  description="Annual cultural celebration"
                  date="September 2, 2026"
                  location="Open Air Theatre"
                />

              </div>

            </div>


            {/* ================= RECENT COMPLAINTS ================= */}

            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">

              <div className="flex justify-between items-center mb-5">

                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Recent Complaints
                </h2>

                <Link
                  href="/complaints"
                  className="text-blue-600 hover:text-blue-700 text-sm"
                >
                  View All →
                </Link>

              </div>


              <div className="space-y-4">

                <ComplaintCard
                  title="Hostel Water Issue"
                  description="No water supply in Room 204"
                  category="Hostel"
                  status="Pending"
                />

                <ComplaintCard
                  title="WiFi Connectivity"
                  description="Internet connection problem"
                  category="Internet"
                  status="Resolved"
                />

                <ComplaintCard
                  title="Library Timing"
                  description="Request to extend library hours"
                  category="Library"
                  status="Pending"
                />

              </div>

            </div>

          </div>


          {/* ================= MARKETPLACE ================= */}

          <div className="mt-8">

            <div className="flex justify-between items-center mb-5">

              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Recent Marketplace Listings
              </h2>

              <Link
                href="/marketplace"
                className="text-blue-600 hover:text-blue-700 text-sm"
              >
                View All →
              </Link>

            </div>


            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

              <MarketplaceCard
                id={1}
                title="Engineering Books"
                description="First year engineering books in good condition."
                price={800}
                category="Books"
                seller="Student"
              />

              <MarketplaceCard
                id={2}
                title="Scientific Calculator"
                description="Casio scientific calculator."
                price={500}
                category="Electronics"
                seller="Student"
              />

              <MarketplaceCard
                id={3}
                title="Study Table"
                description="Wooden study table in good condition."
                price={1200}
                category="Furniture"
                seller="Student"
              />

            </div>

          </div>

        </div>


        {/* ================= FOOTER ================= */}

        <Footer />

      </main>

    </div>
  );
}