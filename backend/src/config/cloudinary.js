const cloudinary = require("cloudinary").v2;

const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();

console.log("CLOUDINARY CONFIG CHECK:", {
    cloudName,
    apiKey: apiKey,
    apiKeyLength: apiKey?.length,
    secretExists: !!apiSecret,
});

cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
});

module.exports = cloudinary;