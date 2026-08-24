"use client";

export default function OnlineUsers({
    users = [],
}) {
    return (
        <div className="p-4">

            <h2 className="font-semibold text-gray-900 dark:text-white mb-4">
                Online Users
            </h2>

            {users.length === 0 ? (
                <p className="text-sm text-gray-500">
                    No users online
                </p>
            ) : (
                <div className="space-y-3">

                    {users.map((userId) => (

                        <div
                            key={userId}
                            className="flex items-center gap-3"
                        >

                            <span className="w-3 h-3 bg-green-500 rounded-full" />

                            <span className="text-sm text-gray-700 dark:text-gray-300">
                                User {userId}
                            </span>

                        </div>

                    ))}

                </div>
            )}

        </div>
    );
}