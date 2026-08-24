const connectedUsers = new Map();

function initializeSocket(io) {
    io.on("connection", (socket) => {
        console.log("Socket connected:", socket.id);

        socket.on("join_user", (userId) => {
            if (!userId) return;

            socket.join(`user_${userId}`);

            connectedUsers.set(Number(userId), socket.id);

            console.log(
                `User ${userId} joined room user_${userId}`
            );

            io.emit(
                "online_users",
                Array.from(connectedUsers.keys())
            );
        });

        socket.on("join_group", (groupId) => {
            if (!groupId) return;

            socket.join(`group_${groupId}`);

            console.log(
                `Socket ${socket.id} joined group_${groupId}`
            );
        });

        socket.on("leave_group", (groupId) => {
            if (!groupId) return;

            socket.leave(`group_${groupId}`);
        });

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
                if (socketId === socket.id) {
                    disconnectedUserId = userId;
                    connectedUsers.delete(userId);
                    break;
                }
            }

            io.emit(
                "online_users",
                Array.from(connectedUsers.keys())
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
    connectedUsers
};