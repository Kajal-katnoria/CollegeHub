/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import {
    useEffect,
    useRef,
    useState,
} from "react";

import { socket } from "../services/socket";

import {
    getGroupMessages,
} from "../services/messageService";

import MessageBubble from "./MessageBubble";

export default function ChatWindow({
    groupId,
    groupName = "Chat Group",
}) {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [socketConnected, setSocketConnected] = useState(
        socket.connected
    );

    const messagesEndRef = useRef(null);

    // ==========================================
    // LOAD MESSAGES + SOCKET SETUP
    // ==========================================

    useEffect(() => {
        if (!groupId) {
            return;
        }

        const token = localStorage.getItem("token");

        const userId = Number(
            localStorage.getItem("userId")
        );

        console.log("================================");
        console.log("CHAT WINDOW STARTED");
        console.log("groupId:", groupId);
        console.log("userId:", userId);
        console.log("token exists:", !!token);
        console.log("socket connected:", socket.connected);
        console.log("socket id:", socket.id);
        console.log("================================");

        if (!token || !userId) {
            console.log(
                "Missing token or userId"
            );

            setLoading(false);
            return;
        }

        // ==========================================
        // LOAD OLD MESSAGES
        // ==========================================

        const loadMessages = async () => {
            try {
                console.log(
                    "Loading messages for group:",
                    groupId
                );

                const data =
                    await getGroupMessages(
                        groupId,
                        token
                    );

                console.log(
                    "MESSAGES FROM SERVER:",
                    data
                );

                setMessages(
                    Array.isArray(data)
                        ? data
                        : data?.messages || []
                );
            } catch (error) {
                console.error(
                    "LOAD MESSAGES ERROR:",
                    error
                );
            } finally {
                setLoading(false);
            }
        };

        loadMessages();

        // ==========================================
        // JOIN USER + GROUP
        // ==========================================

        const joinRooms = () => {
            console.log(
                "================================"
            );

            console.log(
                "SOCKET CONNECTED"
            );

            console.log(
                "Socket ID:",
                socket.id
            );

            console.log(
                "Joining user room:",
                userId
            );

            socket.emit(
                "join_user",
                userId
            );

            console.log(
                "Joining group:",
                Number(groupId)
            );

            socket.emit(
                "join_group",
                Number(groupId)
            );

            console.log(
                "GROUP JOIN REQUEST SENT"
            );

            console.log(
                "================================"
            );

            setSocketConnected(true);
        };

        // ==========================================
        // SOCKET CONNECTION
        // ==========================================

        const handleConnect = () => {
            console.log(
                "SOCKET CONNECT EVENT"
            );

            console.log(
                "Socket ID:",
                socket.id
            );

            joinRooms();
        };

        const handleDisconnect = () => {
            console.log(
                "SOCKET DISCONNECTED"
            );

            setSocketConnected(false);
        };

        const handleConnectError = (error) => {
            console.error(
                "SOCKET CONNECTION ERROR:",
                error
            );

            setSocketConnected(false);
        };

        socket.on(
            "connect",
            handleConnect
        );

        socket.on(
            "disconnect",
            handleDisconnect
        );

        socket.on(
            "connect_error",
            handleConnectError
        );

        // If already connected
        if (socket.connected) {
            console.log(
                "Socket already connected"
            );

            joinRooms();
        } else {
            console.log(
                "Socket not connected. Connecting..."
            );

            socket.connect();
        }

        // ==========================================
        // RECEIVE NEW MESSAGE
        // ==========================================

        const handleNewMessage = (
            newMessage
        ) => {
            console.log(
                "NEW MESSAGE RECEIVED:",
                newMessage
            );

            // Make sure message belongs to
            // current group
            if (
                Number(newMessage.groupId) !==
                Number(groupId)
            ) {
                return;
            }

            setMessages(
                (previous) => [
                    ...previous,
                    newMessage,
                ]
            );
        };

        socket.on(
            "new_message",
            handleNewMessage
        );
        const handleMessageError = (error) => {
    console.error(
        "MESSAGE ERROR FROM SERVER:",
        error
    );
};

socket.on(
    "message_error",
    handleMessageError
);

        // ==========================================
        // ONLINE USERS
        // ==========================================

        const handleOnlineUsers = (
            users
        ) => {
            console.log(
                "ONLINE USERS:",
                users
            );

            setOnlineUsers(
                Array.isArray(users)
                    ? users
                    : []
            );
        };

        socket.on(
            "online_users",
            handleOnlineUsers
        );

        // ==========================================
        // CLEANUP
        // ==========================================

        return () => {
            console.log(
                "Cleaning up ChatWindow"
            );

            socket.off(
                "connect",
                handleConnect
            );

            socket.off(
                "disconnect",
                handleDisconnect
            );

            socket.off(
                "connect_error",
                handleConnectError
            );

            socket.off(
                "new_message",
                handleNewMessage
            );

            socket.off(
                "online_users",
                handleOnlineUsers
            );

            if (socket.connected) {
                socket.emit(
                    "leave_group",
                    Number(groupId)
                );
            }
        };
    }, [groupId]);

    // ==========================================
    // AUTO SCROLL
    // ==========================================

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
        });
    }, [messages]);

    // ==========================================
    // SEND MESSAGE
    // ==========================================

    const handleSendMessage = (e) => {
        e.preventDefault();

        const userId = Number(
            localStorage.getItem("userId")
        );

        const trimmedMessage =
            message.trim();

        console.log(
            "================================"
        );

        console.log(
            "SEND BUTTON CLICKED"
        );

        console.log(
            "Message:",
            trimmedMessage
        );

        console.log(
            "Group ID:",
            groupId
        );

        console.log(
            "User ID:",
            userId
        );

        console.log(
            "Socket connected:",
            socket.connected
        );

        console.log(
            "Socket ID:",
            socket.id
        );

        console.log(
            "================================"
        );

        // ==========================================
        // VALIDATION
        // ==========================================

        if (!trimmedMessage) {
            console.log(
                "Message is empty"
            );

            return;
        }

        if (!groupId) {
            console.log(
                "Missing groupId"
            );

            return;
        }

        if (!userId) {
            console.log(
                "Missing userId"
            );

            return;
        }

        // ==========================================
        // SOCKET CHECK
        // ==========================================

        if (!socket.connected) {
            console.log(
                "Socket is NOT connected"
            );

            console.log(
                "Trying to reconnect..."
            );

            socket.connect();

            return;
        }

        // ==========================================
        // MESSAGE DATA
        // ==========================================

        const messageData = {
            groupId: Number(groupId),
            senderId: userId,
            content: trimmedMessage,
        };

        console.log(
            "SENDING MESSAGE:",
            messageData
        );

        // ==========================================
        // SEND TO SERVER
        // ==========================================

        socket.emit(
            "send_message",
            messageData
        );

        console.log(
            "send_message EVENT EMITTED"
        );

        // Clear input
        setMessage("");
    };

    // ==========================================
    // RENDER
    // ==========================================

    return (
        <div className="flex flex-col h-[600px] border rounded-2xl overflow-hidden bg-white dark:bg-gray-900 dark:border-gray-700">

            {/* ======================================
                HEADER
            ====================================== */}

            <div className="px-5 py-4 border-b dark:border-gray-700">

                <div className="flex items-center justify-between">

                    <div>
                        <h1 className="font-semibold text-lg text-gray-900 dark:text-white">
                            {groupName}
                        </h1>

                        <p className="text-xs text-gray-500 mt-1">
                            {onlineUsers.length} online
                        </p>
                    </div>

                    {/* SOCKET STATUS */}

                    <div className="flex items-center gap-2">

                        <span
                            className={`w-2.5 h-2.5 rounded-full ${
                                socketConnected
                                    ? "bg-green-500"
                                    : "bg-red-500"
                            }`}
                        />

                        <span className="text-xs text-gray-500">
                            {socketConnected
                                ? "Connected"
                                : "Disconnected"}
                        </span>

                    </div>

                </div>

            </div>

            {/* ======================================
                MESSAGES
            ====================================== */}

            <div className="flex-1 overflow-y-auto p-5">

                {loading ? (

                    <p className="text-center text-gray-500">
                        Loading messages...
                    </p>

                ) : messages.length === 0 ? (

                    <p className="text-center text-gray-500">
                        No messages yet. Start the
                        conversation!
                    </p>

                ) : (

                    messages.map((item) => (

                        <MessageBubble
                            key={item.id}
                            message={item}
                            isOwn={
                                Number(
                                    item.senderId
                                ) ===
                                Number(
                                    localStorage.getItem(
                                        "userId"
                                    )
                                )
                            }
                        />

                    ))

                )}

                <div
                    ref={messagesEndRef}
                />

            </div>

            {/* ======================================
                INPUT
            ====================================== */}

            <form
                onSubmit={handleSendMessage}
                className="p-4 border-t dark:border-gray-700 flex gap-3"
            >

                <input
                    type="text"
                    value={message}
                    onChange={(e) =>
                        setMessage(
                            e.target.value
                        )
                    }
                    placeholder={
                        socketConnected
                            ? "Type a message..."
                            : "Connecting..."
                    }
                    disabled={!socketConnected}
                    className="flex-1 px-4 py-3 rounded-xl border bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                />

                <button
                    type="submit"
                    disabled={
                        !socketConnected ||
                        !message.trim()
                    }
                    className="px-5 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Send
                </button>

            </form>

        </div>
    );
}