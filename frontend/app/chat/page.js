"use client";

import { useEffect, useState } from "react";

import ChatWindow from "../../components/ChatWindow";
import OnlineUsers from "../../components/OnlineUsers";
import { socket } from "../../services/socket";

export default function ChatPage() {
    const [groupId, setGroupId] = useState(1);
    const [groupName, setGroupName] = useState("Coding Club");
    const [onlineUsers, setOnlineUsers] = useState([]);

    useEffect(() => {
        const userId = localStorage.getItem("userId");

        if (!userId) {
            return;
        }

        if (!socket.connected) {
            socket.connect();
        }

        socket.emit("join_user", Number(userId));

        const handleOnlineUsers = (users) => {
            setOnlineUsers(users);
        };

        socket.on("online_users", handleOnlineUsers);

        return () => {
            socket.off("online_users", handleOnlineUsers);
        };
    }, []);

    return (
        <main className="min-h-screen bg-gray-50 dark:bg-gray-950 p-4 md:p-6">
            <div className="max-w-7xl mx-auto">

                {/* HEADER */}

                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        CollegeHub Chat
                    </h1>

                    <p className="mt-2 text-gray-500 dark:text-gray-400">
                        Connect and chat with students and clubs.
                    </p>
                </div>

                {/* MAIN CHAT AREA */}

                <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-5">

                    {/* GROUPS */}

                    <aside className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 h-fit">

                        <h2 className="font-semibold text-gray-900 dark:text-white mb-4">
                            Groups
                        </h2>

                        {/* CODING CLUB */}

                        <button
                            type="button"
                            onClick={() => {
                                setGroupId(1);
                                setGroupName("Coding Club");
                            }}
                            className={`w-full text-left px-3 py-3 rounded-xl ${
                                groupId === 1
                                    ? "bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300"
                                    : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                            }`}
                        >
                            💻 Coding Club
                        </button>

                        {/* ROBOTICS CLUB */}

                        <button
                            type="button"
                            onClick={() => {
                                setGroupId(2);
                                setGroupName("Robotics Club");
                            }}
                            className={`w-full text-left px-3 py-3 rounded-xl mt-2 ${
                                groupId === 2
                                    ? "bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300"
                                    : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                            }`}
                        >
                            🤖 Robotics Club
                        </button>

                        {/* CSE STUDENTS */}

                        <button
                            type="button"
                            onClick={() => {
                                setGroupId(3);
                                setGroupName("CSE Students");
                            }}
                            className={`w-full text-left px-3 py-3 rounded-xl mt-2 ${
                                groupId === 3
                                    ? "bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300"
                                    : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                            }`}
                        >
                            📚 CSE Students
                        </button>

                    </aside>

                    {/* CHAT WINDOW */}

                    <ChatWindow
                        groupId={groupId}
                        groupName={groupName}
                    />

                </div>

                {/* ONLINE USERS */}

                <div className="mt-5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl">

                    <OnlineUsers
                        users={onlineUsers}
                    />

                </div>

            </div>
        </main>
    );
}