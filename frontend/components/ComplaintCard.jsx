import Link from "next/link";

export default function ComplaintCard({
  id,
  title,
  description,
  category,
  status,
  createdAt,
}) {

  const getStatusStyle = () => {
    switch (status?.toLowerCase()) {
      case "resolved":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";

      case "pending":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";

      case "rejected":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";

      case "in progress":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";

      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-5">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">

        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {title}
          </h3>

          {category && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {category}
            </p>
          )}
        </div>

        {/* Status */}
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getStatusStyle()}`}
        >
          {status || "Pending"}
        </span>

      </div>

      {/* Description */}
      {description && (
        <p className="mt-4 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
          {description}
        </p>
      )}

      {/* Date */}
      {createdAt && (
        <p className="mt-4 text-xs text-gray-500 dark:text-gray-500">
          Submitted: {createdAt}
        </p>
      )}

      {/* View */}
      {id && (
        <Link
          href={`/complaints/${id}`}
          className="inline-block mt-4 text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          View Complaint →
        </Link>
      )}

    </div>
  );
}