const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

// Routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const eventRoutes = require("./routes/eventRoutes");
const complaintRoutes = require("./routes/complaintRoutes");
const marketplaceRoutes = require("./routes/marketplaceRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const lostFoundRoutes = require("./routes/lostFoundRoutes");
const clubRoutes = require("./routes/clubRoutes");
const profileRoutes = require("./routes/profileRoutes");
const messageRoutes = require("./routes/chatRoutes");
const studyMaterialRoutes = require("./routes/studyMaterialRoutes");

const app = express();

// ===============================
// Middleware
// ===============================

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(cookieParser());


// ===============================
// Test Route
// ===============================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "CollegeHub Backend is Running 🚀",
  });
});


// ===============================
// API Routes
// ===============================

// Authentication
app.use("/api/auth", authRoutes);

// User
app.use("/api/user", userRoutes);

// Events
app.use("/api/event", eventRoutes);

// Complaints
app.use("/api/complaints", complaintRoutes);

// Marketplace
app.use("/api/items", marketplaceRoutes);

// Lost & Found
app.use("/api/lost-found", lostFoundRoutes);

// Notifications
app.use("/api/notifications", notificationRoutes);

// Clubs
app.use("/api/clubs", clubRoutes);

// Profile
app.use("/api/profile", profileRoutes);

// Chat
app.use("/api/chat", messageRoutes);

// Study Materials
app.use("/api/study-materials", studyMaterialRoutes);


// ===============================
// 404 Handler
// ===============================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
});


// ===============================
// Error Handler
// ===============================

app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});


module.exports = app;