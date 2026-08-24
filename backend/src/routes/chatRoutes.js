const express = require("express");
const { PrismaClient } = require("@prisma/client");

const authMiddleware = require("../middleware/auth");

const router = express.Router();

const prisma = new PrismaClient();


// ==========================================
// GET GROUP MESSAGES
// GET /api/chat/:groupId
// ==========================================
router.get("/:groupId", authMiddleware, async (req, res) => {
    try {
        const groupId = Number(req.params.groupId);

        // Validate groupId
        if (isNaN(groupId)) {
            return res.status(400).json({
                message: "Invalid group ID"
            });
        }

        const messages = await prisma.message.findMany({
            where: {
                groupId: groupId
            },
            orderBy: {
                createdAt: "asc"
            }
        });

        return res.status(200).json(messages);

    } catch (error) {
        console.error("GET GROUP MESSAGES ERROR:", error);

        return res.status(500).json({
            message: "Failed to fetch messages"
        });
    }
});


module.exports = router;