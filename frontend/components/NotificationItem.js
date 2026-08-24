"use client";

export default function NotificationItem({
    notification,
    onRead,
}) {
    return (
        <div
            onClick={() => {
                if (!notification.isRead) {
                    onRead(notification.id);
                }
            }}
            className={`p-4 rounded-xl border cursor-pointer transition ${
                notification.isRead
                    ? "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700"
                    : "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800"
            }`}
        >
            <div className="flex items-start justify-between gap-4">

                <div className="flex-1">

                    <div className="flex items-center gap-2">

                        <h3 className="font-semibold text-gray-900 dark:text-white">
                            {notification.title}
                        </h3>

                        {!notification.isRead && (
                            <span className="px-2 py-1 text-xs rounded-full bg-blue-600 text-white">
                                New
                            </span>
                        )}

                    </div>

                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                        {notification.message}
                    </p>

                    <p className="mt-2 text-xs text-gray-400">
                        {notification.createdAt
                            ? new Date(
                                notification.createdAt
                            ).toLocaleString()
                            : ""}
                    </p>

                </div>

            </div>
        </div>
    );
}