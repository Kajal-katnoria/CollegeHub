"use client";

import { io } from "socket.io-client";

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL;

export const socket = io(SOCKET_URL, {
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
  console.error("❌ SOCKET CONNECTION ERROR:", error.message);
});