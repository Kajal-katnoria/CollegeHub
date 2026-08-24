export default function StatCard({
  title,
  value,
  icon,
  description,
}) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-800">

      <div className="flex items-start justify-between">

        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {title}
          </p>

          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
            {value}
          </h2>
        </div>

        <div className="text-3xl">
          {icon}
        </div>

      </div>

      {description && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
          {description}
        </p>
      )}

    </div>
  );
}