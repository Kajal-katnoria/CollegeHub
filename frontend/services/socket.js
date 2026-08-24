"use client";

import { io } from "socket.io-client";

export const socket = io("http://localhost:5000", {
    autoConnect: false,
    transports: ["polling"],
});

socket.on("connect", () => {
    console.log("✅ SOCKET CONNECTED:", socket.id);
});

socket.on("disconnect", (reason) => {
    console.log("❌ SOCKET DISCONNECTED:", reason);
});

socket.on("connect_error", (error) => {
    console.error("❌ SOCKET CONNECTION ERROR:", error);
});