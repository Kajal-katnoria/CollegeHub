import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 dark:bg-gray-900 dark:border-gray-700">

      <div className="max-w-7xl mx-auto px-6 py-8">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* About */}
          <div>
            <h2 className="text-xl font-bold text-blue-600">
              🎓 CollegeHub
            </h2>

            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Your digital campus companion for events, complaints,
              marketplace and student community.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-3">
              Quick Links
            </h3>

            <div className="flex flex-col gap-2 text-sm text-gray-600 dark:text-gray-400">

              <Link href="/dashboard" className="hover:text-blue-600">
                Dashboard
              </Link>

              <Link href="/events" className="hover:text-blue-600">
                Events
              </Link>

              <Link href="/marketplace" className="hover:text-blue-600">
                Marketplace
              </Link>

              <Link href="/lost-found" className="hover:text-blue-600">
                Lost & Found
              </Link>

            </div>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-3">
              Support
            </h3>

            <div className="flex flex-col gap-2 text-sm text-gray-600 dark:text-gray-400">

              <Link href="/profile" className="hover:text-blue-600">
                Profile
              </Link>

              <Link href="/complaints" className="hover:text-blue-600">
                Complaints
              </Link>

              <Link href="/notifications" className="hover:text-blue-600">
                Notifications
              </Link>

            </div>
          </div>

        </div>

        {/* Bottom */}
        <div className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-6 text-center">

          <p className="text-sm text-gray-500">
            © 2026 CollegeHub. Built for students.
          </p>

        </div>

      </div>

    </footer>
  );
}