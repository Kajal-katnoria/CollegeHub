const prisma = require("../config/db");

const getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.user.id
      },
      include: {
        profile: true
      }
    });

    res.json(user);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const {
      name,
      department,
      semester,
      phone,
      bio
    } = req.body;

    await prisma.user.update({
      where: {
        id: req.user.id
      },
      data: {
        name
      }
    });

    const existingProfile =
      await prisma.profile.findUnique({
        where: {
          userId: req.user.id
        }
      });

    let profile;

    if (existingProfile) {
      profile = await prisma.profile.update({
        where: {
          userId: req.user.id
        },
        data: {
          department,
          semester,
          phone,
          bio
        }
      });
    } else {
      profile = await prisma.profile.create({
        data: {
          department,
          semester,
          phone,
          bio,
          userId: req.user.id
        }
      });
    }

    res.json({
      success: true,
      profile
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

module.exports = {
  getProfile,
  updateProfile
};