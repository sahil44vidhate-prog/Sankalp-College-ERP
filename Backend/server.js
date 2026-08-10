const express = require("express");
const cors = require("cors");
const session = require("express-session");
require("dotenv").config();

const db = require("./config/db");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const studentRoutes = require("./routes/studentRoutes");

app.use("/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/students", studentRoutes);

app.use(
    session({
        secret: "erp_secret_key",
        resave: false,
        saveUninitialized: false,
    })
);

// Test Route
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "College ERP Backend Running Successfully 🚀",
    });
});

// Start Server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});