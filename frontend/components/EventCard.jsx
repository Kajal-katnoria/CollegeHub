import Link from "next/link";

export default function EventCard({
  id,
  title,
  description,
  date,
  location,
}) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-5 hover:shadow-md transition">

      {/* Event Title */}
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
        {title}
      </h3>

      {/* Description */}
      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
        {description}
      </p>

      {/* Date */}
      <div className="flex items-center gap-2 mt-4 text-sm text-gray-600 dark:text-gray-400">
        📅
        <span>{date}</span>
      </div>

      {/* Location */}
      <div className="flex items-center gap-2 mt-2 text-sm text-gray-600 dark:text-gray-400">
        📍
        <span>{location}</span>
      </div>

      {/* View Event */}
      {id && (
        <Link
          href={`/events/${id}`}
          className="inline-block mt-5 text-blue-600 hover:text-blue-700 font-medium text-sm"
        >
          View Event →
        </Link>
      )}

    </div>
  );
}