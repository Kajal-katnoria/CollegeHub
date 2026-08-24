const multer = require("multer");

// ======================================================
// STORAGE
// ======================================================

// Store files temporarily in memory.
// Cloudinary will receive the buffer directly.
const storage = multer.memoryStorage();


// ======================================================
// FILE FILTER
// ======================================================

const fileFilter = (req, file, cb) => {
    const allowedTypes = [
        // Images
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",

        // Documents
        "application/pdf",
    ];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(
            new Error(
                "Only JPG, JPEG, PNG, WEBP images and PDF files are allowed"
            ),
            false
        );
    }
};


// ======================================================
// MULTER CONFIGURATION
// ======================================================

const upload = multer({
    storage,

    limits: {
        // Maximum file size = 10 MB
        fileSize: 10 * 1024 * 1024,
    },

    fileFilter,
});


// ======================================================
// EXPORT
// ======================================================

module.exports = upload;