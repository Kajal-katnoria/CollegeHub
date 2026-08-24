const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();


// GET ALL CLUBS
const getClubs = async (req, res) => {

  try {

    const userId = Number(req.user.id);

    const clubs = await prisma.club.findMany({
      include: {
        members: {
          where: {
            userId,
          },
        },
        _count: {
          select: {
            members: true,
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });


    const result = clubs.map((club) => ({
      ...club,

      isMember: club.members.length > 0,

      members: undefined,
    }));


    res.json(result);

  } catch (error) {

    console.error("GET CLUBS ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch clubs",
    });
  }
};


// CREATE CLUB
const createClub = async (req, res) => {

  try {

    const {
      name,
      description,
      category,
      image,
    } = req.body;


    if (!name || !description || !category) {

      return res.status(400).json({
        message: "Name, description and category are required",
      });
    }


    const club = await prisma.club.create({
      data: {
        name,
        description,
        category,
        image: image || null,
      },
    });


    res.status(201).json(club);

  } catch (error) {

    console.error("CREATE CLUB ERROR:", error);

    res.status(500).json({
      message: "Failed to create club",
    });
  }
};


// JOIN CLUB
const joinClub = async (req, res) => {

  try {

    const userId = Number(req.user.id);
    const clubId = Number(req.params.id);


    const club = await prisma.club.findUnique({
      where: {
        id: clubId,
      },
    });


    if (!club) {

      return res.status(404).json({
        message: "Club not found",
      });
    }


    const existingMember = await prisma.clubMember.findUnique({
      where: {
        userId_clubId: {
          userId,
          clubId,
        },
      },
    });


    if (existingMember) {

      return res.status(400).json({
        message: "Already a member",
      });
    }


    const member = await prisma.clubMember.create({
      data: {
        userId,
        clubId,
      },
    });


    res.status(201).json(member);

  } catch (error) {

    console.error("JOIN CLUB ERROR:", error);

    res.status(500).json({
      message: "Failed to join club",
    });
  }
};


// LEAVE CLUB
const leaveClub = async (req, res) => {

  try {

    const userId = Number(req.user.id);
    const clubId = Number(req.params.id);


    await prisma.clubMember.delete({
      where: {
        userId_clubId: {
          userId,
          clubId,
        },
      },
    });


    res.json({
      message: "Left club successfully",
    });

  } catch (error) {

    console.error("LEAVE CLUB ERROR:", error);

    res.status(500).json({
      message: "Failed to leave club",
    });
  }
};


module.exports = {
  getClubs,
  createClub,
  joinClub,
  leaveClub,
};