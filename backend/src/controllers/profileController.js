const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const uploadToCloudinary = require("../utils/uploadToCloudinary");

const prisma = new PrismaClient();


// ======================================================
// GET PROFILE
// ======================================================

const getProfile = async (req, res) => {
  try {
    const userId = Number(req.user.id);

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },

      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,

        // Profile information
        profile: {
          select: {
            id: true,
            department: true,
            semester: true,
            phone: true,
            bio: true,
            profilePicture: true,
          },
        },

        // Clubs
        clubs: {
          include: {
            club: true,
          },
        },

        // Statistics
        _count: {
          select: {
            notifications: true,
            lostFound: true,
            marketplaceItems: true,
            complaints: true,
            registrations: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json(user);

  } catch (error) {
    console.error("GET PROFILE ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch profile",
    });
  }
};


// ======================================================
// UPDATE PROFILE
// ======================================================

const updateProfile = async (req, res) => {
  try {
    const userId = Number(req.user.id);

    const {
      name,
      email,
      department,
      semester,
      phone,
      bio,
    } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        message: "Name and email are required",
      });
    }


    // Check email
    const existingUser = await prisma.user.findFirst({
      where: {
        email,

        NOT: {
          id: userId,
        },
      },
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already in use",
      });
    }


    // Update User
    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },

      data: {
        name,
        email,
      },

      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });


    // Check whether Profile exists
    const existingProfile = await prisma.profile.findUnique({
      where: {
        userId,
      },
    });


    let profile;


    if (existingProfile) {

      // Update existing profile

      profile = await prisma.profile.update({
        where: {
          userId,
        },

        data: {
          department,
          semester: semester
            ? Number(semester)
            : null,
          phone,
          bio,
        },
      });

    } else {

      // Create profile if it doesn't exist

      profile = await prisma.profile.create({
        data: {
          userId,
          department,
          semester: semester
            ? Number(semester)
            : null,
          phone,
          bio,
        },
      });

    }


    res.json({
      message: "Profile updated successfully",

      user: updatedUser,

      profile,
    });

  } catch (error) {
    console.error("UPDATE PROFILE ERROR:", error);

    res.status(500).json({
      message: "Failed to update profile",
    });
  }
};


// ======================================================
// PROFILE PICTURE
// ======================================================

const updateProfilePicture = async (req, res) => {
  try {

    const userId = Number(req.user.id);


    // Check file
    if (!req.file) {
      return res.status(400).json({
        message: "Profile picture is required",
      });
    }


    console.log(
      "PROFILE IMAGE:",
      req.file.originalname
    );


    // Upload to Cloudinary

    const result = await uploadToCloudinary(
      req.file,
      "collegehub/profiles"
    );


    console.log(
      "CLOUDINARY URL:",
      result.secure_url
    );


    // Check profile

    const existingProfile = await prisma.profile.findUnique({
      where: {
        userId,
      },
    });


    let profile;


    if (existingProfile) {

      profile = await prisma.profile.update({
        where: {
          userId,
        },

        data: {
          profilePicture: result.secure_url,
        },
      });

    } else {

      profile = await prisma.profile.create({
        data: {
          userId,

          profilePicture: result.secure_url,
        },
      });

    }


    res.json({
      message: "Profile picture updated successfully",

      profilePicture: profile.profilePicture,

      profile,
    });

  } catch (error) {

    console.error(
      "PROFILE IMAGE ERROR:",
      error
    );

    res.status(500).json({
      message: "Failed to upload profile picture",
    });
  }
};


// ======================================================
// CHANGE PASSWORD
// ======================================================

const changePassword = async (req, res) => {
  try {

    const userId = Number(req.user.id);

    const {
      currentPassword,
      newPassword,
    } = req.body;


    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Both passwords are required",
      });
    }


    if (newPassword.length < 6) {
      return res.status(400).json({
        message:
          "Password must contain at least 6 characters",
      });
    }


    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });


    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }


    const validPassword = await bcrypt.compare(
      currentPassword,
      user.password
    );


    if (!validPassword) {
      return res.status(400).json({
        message: "Current password is incorrect",
      });
    }


    const hashedPassword = await bcrypt.hash(
      newPassword,
      10
    );


    await prisma.user.update({
      where: {
        id: userId,
      },

      data: {
        password: hashedPassword,
      },
    });


    res.json({
      message: "Password changed successfully",
    });

  } catch (error) {

    console.error(
      "CHANGE PASSWORD ERROR:",
      error
    );

    res.status(500).json({
      message: "Failed to change password",
    });
  }
};


// ======================================================
// EXPORTS
// ======================================================

module.exports = {
  getProfile,
  updateProfile,
  updateProfilePicture,
  changePassword,
};