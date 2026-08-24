/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";

import {
    getNotifications,
    markNotificationAsRead,
} from "../../services/notificationService";

import { socket } from "../../services/socket";

import NotificationItem from "../../components/NotificationItem";

export default function NotificationPage() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");

        // User is not logged in
        if (!token || !userId) {
            setError("Please login to view notifications.");
            setLoading(false);
            return;
        }

        // =====================================
        // LOAD EXISTING NOTIFICATIONS
        // =====================================

        const loadNotifications = async () => {
            try {
                const data = await getNotifications(token);

                if (Array.isArray(data)) {
                    setNotifications(data);
                } else if (data && Array.isArray(data.notifications)) {
                    setNotifications(data.notifications);
                } else {
                    setNotifications([]);
                }
            } catch (err) {
                console.error(
                    "GET NOTIFICATIONS ERROR:",
                    err
                );

                setError(
                    "Unable to load notifications."
                );
            } finally {
                setLoading(false);
            }
        };

        loadNotifications();

        // =====================================
        // CONNECT SOCKET.IO
        // =====================================

        if (!socket.connected) {
            socket.connect();
        }

        // Join this user's private room
        socket.emit(
            "join_user",
            Number(userId)
        );

        // =====================================
        // REAL-TIME NOTIFICATION
        // =====================================

        const handleNewNotification = (notification) => {
            console.log(
                "NEW NOTIFICATION:",
                notification
            );

            setNotifications((previous) => [
                notification,
                ...previous,
            ]);
        };

        socket.on(
            "new_notification",
            handleNewNotification
        );

        // =====================================
        // CLEANUP
        // =====================================

        return () => {
            socket.off(
                "new_notification",
                handleNewNotification
            );
        };
    }, []);

    // =====================================
    // MARK NOTIFICATION AS READ
    // =====================================

    const handleRead = async (notificationId) => {
        const token = localStorage.getItem("token");

        if (!token) {
            return;
        }

        try {
            await markNotificationAsRead(
                notificationId,
                token
            );

            setNotifications((previous) =>
                previous.map((notification) =>
                    notification.id === notificationId
                        ? {
                            ...notification,
                            isRead: true,
                        }
                        : notification
                )
            );
        } catch (err) {
            console.error(
                "MARK NOTIFICATION ERROR:",
                err
            );
        }
    };

    // =====================================
    // PAGE UI
    // =====================================

    return (
        <main className="min-h-screen bg-gray-50 dark:bg-gray-950 px-4 py-8">
            <div className="max-w-4xl mx-auto">

                {/* PAGE HEADER */}

                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Notifications
                    </h1>

                    <p className="mt-2 text-gray-500 dark:text-gray-400">
                        Stay updated with everything happening in CollegeHub.
                    </p>
                </div>

                {/* LOADING */}

                {loading && (
                    <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                        Loading notifications...
                    </div>
                )}

                {/* ERROR */}

                {!loading && error && (
                    <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400">
                        {error}
                    </div>
                )}

                {/* NO NOTIFICATIONS */}

                {!loading &&
                    !error &&
                    notifications.length === 0 && (
                        <div className="p-10 text-center bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">

                            <div className="text-4xl mb-3">
                                🔔
                            </div>

                            <h2 className="font-semibold text-gray-900 dark:text-white">
                                No notifications
                            </h2>

                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                                You are all caught up!
                            </p>

                        </div>
                    )}

                {/* NOTIFICATION LIST */}

                {!loading &&
                    !error &&
                    notifications.length > 0 && (
                        <div className="space-y-3">

                            {notifications.map(
                                (notification) => (
                                    <NotificationItem
                                        key={notification.id}
                                        notification={notification}
                                        onRead={handleRead}
                                    />
                                )
                            )}

                        </div>
                    )}

            </div>
        </main>
    );
}