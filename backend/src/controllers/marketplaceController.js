const prisma = require("../config/db");
const { redisClient } = require("../config/redis");
const uploadToCloudinary = require("../utils/uploadToCloudinary");


// =====================================================
// CREATE MARKETPLACE ITEM
// =====================================================

const createItem = async (req, res) => {
  try {
    console.log("=================================");
    console.log("CREATE MARKETPLACE ITEM");
    console.log("BODY:", req.body);
    console.log("USER:", req.user);
    console.log("FILE:", req.file);
    console.log("=================================");

    const {
      title,
      description,
      price,
      category
    } = req.body;

    // Validate fields
    if (!title || !description || !price || !category) {
      return res.status(400).json({
        message:
          "Title, description, price and category are required"
      });
    }

    // Validate price
    const numericPrice = Number(price);

    if (isNaN(numericPrice) || numericPrice < 0) {
      return res.status(400).json({
        message: "Price must be a valid number"
      });
    }

    // ==========================================
    // UPLOAD IMAGE TO CLOUDINARY
    // ==========================================

    let imageUrl = null;

    if (req.file) {
      console.log("Uploading image to Cloudinary...");

      const result = await uploadToCloudinary(
        req.file,
        "collegehub/marketplace"
      );

      imageUrl = result.secure_url;

      console.log(
        "CLOUDINARY IMAGE URL:",
        imageUrl
      );
    }

    // ==========================================
    // SAVE ITEM TO DATABASE
    // ==========================================

    const item =
      await prisma.marketplaceItem.create({
        data: {
          title,
          description,
          price: numericPrice,
          category,
          image: imageUrl,
          sellerId: req.user.id
        },

        include: {
          seller: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      });

    console.log("ITEM CREATED:", item);

    // ==========================================
    // CLEAR MARKETPLACE CACHE
    // ==========================================

    await redisClient.del("marketplace:items");

    console.log("MARKETPLACE CACHE CLEARED");

    res.status(201).json({
      success: true,
      message:
        "Marketplace item created successfully",
      item
    });

  } catch (error) {
    console.error(
      "CREATE ITEM ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to create marketplace item",
      error: error.message
    });
  }
};


// =====================================================
// GET ALL ITEMS
// =====================================================

const getItems = async (req, res) => {
  try {

    // ==========================================
    // CHECK REDIS CACHE FIRST
    // ==========================================

    const cachedItems =
      await redisClient.get("marketplace:items");

    if (cachedItems) {

      console.log(
        "MARKETPLACE ITEMS FROM REDIS"
      );

      return res.json(
        JSON.parse(cachedItems)
      );
    }

    // ==========================================
    // REDIS CACHE MISS
    // ==========================================

    console.log(
      "MARKETPLACE ITEMS FROM DATABASE"
    );

    const items =
      await prisma.marketplaceItem.findMany({
        include: {
          seller: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        },

        orderBy: {
          createdAt: "desc"
        }
      });

    // ==========================================
    // SAVE ITEMS TO REDIS FOR 5 MINUTES
    // ==========================================

    await redisClient.setEx(
      "marketplace:items",
      300,
      JSON.stringify(items)
    );

    console.log(
      "MARKETPLACE ITEMS SAVED TO REDIS"
    );

    res.json(items);

  } catch (error) {
    console.error(
      "GET ITEMS ERROR:",
      error
    );

    res.status(500).json({
      message:
        "Failed to fetch marketplace items",
      error: error.message
    });
  }
};


// =====================================================
// GET SINGLE ITEM
// =====================================================

const getItem = async (req, res) => {
  try {

    const itemId = Number(req.params.id);

    if (isNaN(itemId)) {
      return res.status(400).json({
        message: "Invalid item ID"
      });
    }

    const item =
      await prisma.marketplaceItem.findUnique({
        where: {
          id: itemId
        },

        include: {
          seller: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      });

    if (!item) {
      return res.status(404).json({
        message: "Item not found"
      });
    }

    res.json(item);

  } catch (error) {
    console.error(
      "GET ITEM ERROR:",
      error
    );

    res.status(500).json({
      message: "Failed to fetch item",
      error: error.message
    });
  }
};


// =====================================================
// UPDATE ITEM
// =====================================================

const updateItem = async (req, res) => {
  try {

    const itemId = Number(req.params.id);

    if (isNaN(itemId)) {
      return res.status(400).json({
        message: "Invalid item ID"
      });
    }

    const {
      title,
      description,
      price,
      category,
      status
    } = req.body;

    const item =
      await prisma.marketplaceItem.update({
        where: {
          id: itemId
        },

        data: {
          ...(title !== undefined && {
            title
          }),

          ...(description !== undefined && {
            description
          }),

          ...(price !== undefined && {
            price: Number(price)
          }),

          ...(category !== undefined && {
            category
          }),

          ...(status !== undefined && {
            status
          })
        }
      });

    // ==========================================
    // CLEAR MARKETPLACE CACHE
    // ==========================================

    await redisClient.del("marketplace:items");

    console.log(
      "MARKETPLACE CACHE CLEARED AFTER UPDATE"
    );

    res.json({
      success: true,
      message: "Item updated successfully",
      item
    });

  } catch (error) {
    console.error(
      "UPDATE ITEM ERROR:",
      error
    );

    res.status(500).json({
      message: "Failed to update item",
      error: error.message
    });
  }
};


// =====================================================
// DELETE ITEM
// =====================================================

const deleteItem = async (req, res) => {
  try {

    const itemId = Number(req.params.id);

    if (isNaN(itemId)) {
      return res.status(400).json({
        message: "Invalid item ID"
      });
    }

    await prisma.marketplaceItem.delete({
      where: {
        id: itemId
      }
    });

    // ==========================================
    // CLEAR MARKETPLACE CACHE
    // ==========================================

    await redisClient.del("marketplace:items");

    console.log(
      "MARKETPLACE CACHE CLEARED AFTER DELETE"
    );

    res.json({
      success: true,
      message: "Item deleted successfully"
    });

  } catch (error) {
    console.error(
      "DELETE ITEM ERROR:",
      error
    );

    res.status(500).json({
      message: "Failed to delete item",
      error: error.message
    });
  }
};


module.exports = {
  createItem,
  getItems,
  getItem,
  updateItem,
  deleteItem
};