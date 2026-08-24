const prisma = require("../config/db");

const createComplaint = async (req, res) => {
  try {
    const { title, description } = req.body;

    const complaint = await prisma.complaint.create({
      data: {
        title,
        description,
        userId: req.user.id
      }
    });

    res.status(201).json(complaint);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const getComplaints = async (req, res) => {
  try {
    const complaints = await prisma.complaint.findMany();

    res.json(complaints);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const updateComplaint = async (req, res) => {
  try {
    const { status } = req.body;

    const complaint = await prisma.complaint.update({
      where: {
        id: Number(req.params.id)
      },
      data: {
        status
      }
    });

    res.json(complaint);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

module.exports = {
  createComplaint,
  getComplaints,
  updateComplaint
};