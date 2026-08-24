const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();


// GET USER NOTIFICATIONS
const getNotifications = async (req, res) => {
  try {
    const userId = Number(req.user.id);

    const notifications = await prisma.notification.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json(notifications);
  } catch (error) {
    console.error("GET NOTIFICATIONS ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch notifications",
    });
  }
};


// MARK NOTIFICATION AS READ
const markAsRead = async (req, res) => {
  try {
    const userId = Number(req.user.id);
    const notificationId = Number(req.params.id);

    const notification = await prisma.notification.findFirst({
      where: {
        id: notificationId,
        userId: userId,
      },
    });

    if (!notification) {
      return res.status(404).json({
        message: "Notification not found",
      });
    }

    const updatedNotification = await prisma.notification.update({
      where: {
        id: notificationId,
      },
      data: {
        isRead: true,
      },
    });

    res.status(200).json(updatedNotification);
  } catch (error) {
    console.error("MARK NOTIFICATION ERROR:", error);

    res.status(500).json({
      message: "Failed to mark notification",
    });
  }
};


// DELETE NOTIFICATION
const deleteNotification = async (req, res) => {
  try {
    const userId = Number(req.user.id);
    const notificationId = Number(req.params.id);

    const notification = await prisma.notification.findFirst({
      where: {
        id: notificationId,
        userId: userId,
      },
    });

    if (!notification) {
      return res.status(404).json({
        message: "Notification not found",
      });
    }

    await prisma.notification.delete({
      where: {
        id: notificationId,
      },
    });

    res.status(200).json({
      message: "Notification deleted",
    });
  } catch (error) {
    console.error("DELETE NOTIFICATION ERROR:", error);

    res.status(500).json({
      message: "Failed to delete notification",
    });
  }
};


module.exports = {
  getNotifications,
  markAsRead,
  deleteNotification,
};