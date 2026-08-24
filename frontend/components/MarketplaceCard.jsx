import Link from "next/link";

export default function MarketplaceCard({
  id,
  title,
  description,
  price,
  category,
  seller,
  image,
}) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden hover:shadow-md transition">

      {/* Image */}
      <div className="h-48 bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden">

        {image ? (
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-5xl">
            🛒
          </div>
        )}

      </div>

      {/* Content */}
      <div className="p-5">

        {/* Category */}
        {category && (
          <span className="text-xs font-medium text-blue-600">
            {category}
          </span>
        )}

        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-1">
          {title}
        </h3>

        {/* Description */}
        {description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
            {description}
          </p>
        )}

        {/* Price */}
        <div className="mt-4">
          <span className="text-xl font-bold text-gray-900 dark:text-white">
            ₹{price}
          </span>
        </div>

        {/* Seller */}
        {seller && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Seller: {seller}
          </p>
        )}

        {/* View */}
        {id && (
          <Link
            href={`/marketplace/${id}`}
            className="block text-center mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition"
          >
            View Item
          </Link>
        )}

      </div>

    </div>
  );
}