"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { socket } from "../services/socket";

export default function NotificationBell() {

    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {

        const userId = localStorage.getItem("userId");

        if (!userId) {
            return;
        }

        if (!socket.connected) {
            socket.connect();
        }

        socket.emit(
            "join_user",
            Number(userId)
        );

        const handleNotification = () => {
            setUnreadCount(
                (previous) => previous + 1
            );
        };

        socket.on(
            "new_notification",
            handleNotification
        );

        return () => {
            socket.off(
                "new_notification",
                handleNotification
            );
        };

    }, []);

    return (
        <Link
            href="/notification"
            className="relative flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
        >

            <span className="text-xl">
                🔔
            </span>

            {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 flex items-center justify-center rounded-full bg-red-500 text-white text-xs font-bold">
                    {unreadCount > 99
                        ? "99+"
                        : unreadCount}
                </span>
            )}

        </Link>
    );
}