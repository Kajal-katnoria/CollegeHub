"use client";

export default function MessageBubble({
    message,
    isOwn,
}) {
    return (
        <div
            className={`flex mb-3 ${
                isOwn
                    ? "justify-end"
                    : "justify-start"
            }`}
        >

            <div
                className={`max-w-[75%] px-4 py-2 rounded-2xl ${
                    isOwn
                        ? "bg-blue-600 text-white rounded-br-sm"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-bl-sm"
                }`}
            >

                {!isOwn && (
                    <p className="text-xs font-semibold mb-1 opacity-70">
                        {message.sender?.name ||
                            `User ${message.senderId}`}
                    </p>
                )}

                <p className="text-sm break-words">
                    {message.content}
                </p>

                {message.createdAt && (
                    <p className="text-[10px] opacity-60 mt-1">
                        {new Date(
                            message.createdAt
                        ).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
                    </p>
                )}

            </div>

        </div>
    );
}