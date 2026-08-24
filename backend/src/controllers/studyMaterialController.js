const prisma = require("../config/db");
const uploadToCloudinary = require("../utils/uploadToCloudinary");

const createStudyMaterial = async (req, res) => {
    try {
        const {
            title,
            description,
            subject
        } = req.body;

        if (!req.file) {
            return res.status(400).json({
                message: "File is required"
            });
        }

        const result = await uploadToCloudinary(
            req.file,
            "collegehub/study-material"
        );

        const material = await prisma.studyMaterial.create({
            data: {
                title,
                description,
                subject,
                fileUrl: result.secure_url,
                fileType: req.file.mimetype,
                uploadedBy: req.user.id
            }
        });

        res.status(201).json({
            message: "Study material uploaded",
            material
        });

    } catch (error) {
        console.error("STUDY MATERIAL ERROR:", error);

        res.status(500).json({
            message: "Failed to upload study material"
        });
    }
};

module.exports = {
    createStudyMaterial
};