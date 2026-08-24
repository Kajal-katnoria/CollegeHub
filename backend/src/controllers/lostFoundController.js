const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();


// GET ALL ITEMS
const getItems = async (req, res) => {
  try {
    const items = await prisma.lostFound.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(items);
  } catch (error) {
    console.error("GET LOST FOUND ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch lost and found items",
    });
  }
};


// CREATE ITEM
const createItem = async (req, res) => {
  try {
    const userId = Number(req.user.id);

    const {
      title,
      description,
      location,
      date,
      type,
      image,
    } = req.body;

    if (
      !title ||
      !description ||
      !location ||
      !date ||
      !type
    ) {
      return res.status(400).json({
        message: "All required fields must be provided",
      });
    }

    const item = await prisma.lostFound.create({
      data: {
        title,
        description,
        location,
        date: new Date(date),
        type,
        image: image || null,
        userId,
      },
    });

    res.status(201).json(item);
  } catch (error) {
    console.error("CREATE LOST FOUND ERROR:", error);

    res.status(500).json({
      message: "Failed to create item",
    });
  }
};


// DELETE ITEM
const deleteItem = async (req, res) => {
  try {
    const userId = Number(req.user.id);
    const itemId = Number(req.params.id);

    const item = await prisma.lostFound.findFirst({
      where: {
        id: itemId,
        userId,
      },
    });

    if (!item) {
      return res.status(404).json({
        message: "Item not found or unauthorized",
      });
    }

    await prisma.lostFound.delete({
      where: {
        id: itemId,
      },
    });

    res.json({
      message: "Item deleted successfully",
    });
  } catch (error) {
    console.error("DELETE LOST FOUND ERROR:", error);

    res.status(500).json({
      message: "Failed to delete item",
    });
  }
};


module.exports = {
  getItems,
  createItem,
  deleteItem,
};