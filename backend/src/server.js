require("dotenv").config({ override: true });

const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const { PrismaClient } = require("@prisma/client");

const { connectRedis } = require("./config/redis");

console.log("SERVER.JS STARTED");

const app = express();
const server = http.createServer(app);

// ===============================
// CORS
// ===============================

const allowedOrigins = [
    "http://localhost:3000",
];

// ===============================
// SOCKET.IO
// ===============================

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

const prisma = new PrismaClient();

// ===============================
// MIDDLEWARE
// ===============================

app.use(
    cors({
        origin: "*",
    })
);

app.use(express.json());

app.use(
    express.urlencoded({
        extended: true,
    })
);

// ===============================
// ROUTES
// ===============================

const authRoutes = require("./routes/authRoutes");
const chatRoutes = require("./routes/chatRoutes");
const clubRoutes = require("./routes/clubRoutes");
const complaintRoutes = require("./routes/complaintRoutes");
const eventRoutes = require("./routes/eventRoutes");
const lostFoundRoutes = require("./routes/lostFoundRoutes");
const marketplaceRoutes = require("./routes/marketplaceRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const profileRoutes = require("./routes/profileRoutes");
const userRoutes = require("./routes/userRoutes");
const studyMaterialRoutes = require("./routes/studyMaterialRoutes");

// ===============================
// API ROUTES
// ===============================

// Authentication
app.use("/api/auth", authRoutes);

// Chat
app.use("/api/chat", chatRoutes);

// Clubs
app.use("/api/clubs", clubRoutes);

// Complaints
app.use("/api/complaints", complaintRoutes);

// Events
app.use("/api/event", eventRoutes);

// Lost & Found
app.use("/api/lost-found", lostFoundRoutes);

// Marketplace
app.use("/api/items", marketplaceRoutes);

app.get("/api/items/test", (req, res) => {
    res.json({
        success: true,
        message: "Marketplace route is working",
    });
});

// Notifications
app.use("/api/notifications", notificationRoutes);

// Profile
app.use("/api/profile", profileRoutes);

// Users
app.use("/api/users", userRoutes);

// Study Materials
app.use("/api/study-materials", studyMaterialRoutes);

// ===============================
// TEST ROUTE
// ===============================

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "CollegeHub backend is running 🚀",
    });
});

// ===============================
// SOCKET.IO
// ===============================

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // ===========================
    // JOIN CHAT GROUP
    // ===========================

    socket.on("join_group", (groupId) => {
        const room = `group_${groupId}`;

        socket.join(room);

        console.log(
            `Socket ${socket.id} joined group ${groupId}`
        );
    });

    // ===========================
    // SEND MESSAGE
    // ===========================

    socket.on("send_message", async (data) => {
        try {
            console.log("==============================");
            console.log("MESSAGE RECEIVED FROM CLIENT");
            console.log("Data:", data);
            console.log("==============================");

            const groupId = Number(data.groupId);
            const senderId = Number(data.senderId);
            const content = data.content?.trim();

            // ===========================
            // VALIDATE DATA
            // ===========================

            if (!groupId || !senderId || !content) {
                socket.emit("message_error", {
                    message: "Invalid message data",
                });

                return;
            }

            // ===========================
            // CHECK GROUP
            // ===========================

            const group =
                await prisma.chatGroup.findUnique({
                    where: {
                        id: groupId,
                    },
                });

            if (!group) {
                socket.emit("message_error", {
                    message: "Chat group not found",
                });

                return;
            }

            // ===========================
            // CHECK SENDER
            // ===========================

            const user =
                await prisma.user.findUnique({
                    where: {
                        id: senderId,
                    },
                });

            if (!user) {
                socket.emit("message_error", {
                    message: "User not found",
                });

                return;
            }

            // ===========================
            // SAVE MESSAGE
            // ===========================

            const message =
                await prisma.message.create({
                    data: {
                        content,
                        groupId,
                        senderId,
                    },

                    include: {
                        sender: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                });

            console.log("MESSAGE SAVED:", message);

            // ===========================
            // BROADCAST MESSAGE
            // ===========================

            io.to(`group_${groupId}`).emit(
                "new_message",
                message
            );

        } catch (error) {
            console.error(
                "SEND MESSAGE ERROR:",
                error
            );

            socket.emit("message_error", {
                message: "Failed to send message",
            });
        }
    });

    // ===========================
    // DISCONNECT
    // ===========================

    socket.on("disconnect", () => {
        console.log(
            "User disconnected:",
            socket.id
        );
    });
});

// ===============================
// 404 HANDLER
// ===============================

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.method} ${req.originalUrl} not found`,
    });
});

// ===============================
// ERROR HANDLER
// ===============================

app.use((err, req, res, next) => {
    console.error("SERVER ERROR:", err);

    res.status(err.status || 500).json({
        success: false,
        message:
            err.message ||
            "Internal Server Error",
    });
});

// ===============================
// START SERVER
// ===============================

const PORT = process.env.PORT || 5000;

server.listen(PORT, async () => {
    console.log(
        `Server running on port ${PORT}`
    );

    try {
        await connectRedis();

        console.log("Redis connected");
    } catch (error) {
        console.error(
            "Redis connection failed:",
            error
        );
    }
});