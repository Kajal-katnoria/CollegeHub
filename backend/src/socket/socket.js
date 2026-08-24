const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const connectedUsers = new Map();

function initializeSocket(io) {
    console.log("Initializing Socket.IO...");

    io.on("connection", (socket) => {
        console.log("Socket connected:", socket.id);

        // =========================
        // USER ROOM
        // =========================

        socket.on("join_user", (userId) => {
            if (!userId) {
                return;
            }

            socket.join(`user_${userId}`);

            connectedUsers.set(
                Number(userId),
                socket.id
            );

            console.log(
                `User ${userId} joined room user_${userId}`
            );

            io.emit(
                "online_users",
                Array.from(connectedUsers.keys())
            );
        });

        // =========================
        // CHAT GROUP
        // =========================

        socket.on("join_group", (groupId) => {
            if (!groupId) {
                return;
            }

            socket.join(`group_${groupId}`);

            console.log(
                `Socket ${socket.id} joined group_${groupId}`
            );
        });

        // =========================
        // LEAVE CHAT GROUP
        // =========================

        socket.on("leave_group", (groupId) => {
            if (!groupId) {
                return;
            }

            socket.leave(`group_${groupId}`);

            console.log(
                `Socket ${socket.id} left group_${groupId}`
            );
        });

        // =========================
        // SEND MESSAGE
        // =========================

        socket.on("send_message", async (data) => {
            try {
                const {
                    senderId,
                    groupId,
                    content,
                } = data;

                console.log(
                    "MESSAGE RECEIVED:",
                    data
                );

                // Validation
                if (
                    !senderId ||
                    !groupId ||
                    !content ||
                    !content.trim()
                ) {
                    console.log(
                        "Invalid message data"
                    );

                    return;
                }

                // Save message in database
                const newMessage =
                    await prisma.message.create({
                        data: {
                            senderId:
                                Number(senderId),

                            groupId:
                                Number(groupId),

                            content:
                                content.trim(),
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

                console.log(
                    "MESSAGE SAVED:",
                    newMessage
                );

                // Send message to everyone
                // inside this group
                io.to(`group_${groupId}`).emit(
                    "new_message",
                    newMessage
                );

            } catch (error) {
                console.error(
                    "SEND MESSAGE ERROR:",
                    error
                );
            }
        });

        // =========================
        // DISCONNECT
        // =========================

        socket.on("disconnect", () => {
            console.log(
                "Socket disconnected:",
                socket.id
            );

            let disconnectedUserId = null;

            for (
                const [userId, socketId]
                of connectedUsers.entries()
            ) {
                if (
                    socketId === socket.id
                ) {
                    disconnectedUserId =
                        userId;

                    connectedUsers.delete(
                        userId
                    );

                    break;
                }
            }

            io.emit(
                "online_users",
                Array.from(
                    connectedUsers.keys()
                )
            );

            if (disconnectedUserId) {
                console.log(
                    `User ${disconnectedUserId} went offline`
                );
            }
        });
    });
}

module.exports = {
    initializeSocket,
    connectedUsers,
};