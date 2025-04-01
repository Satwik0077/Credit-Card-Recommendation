require("dotenv").config(); // Load environment variables
const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

const app = express();
const PORT = 5001;

// Middleware
app.use(cors());
app.use(express.json()); // JSON Parser

// Rate Limiting (Prevents Abuse)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per window
    message: "Too many requests, please try again later.",
});
app.use(limiter);

// Database Connection
let db;
async function connectDB() {
    try {
        db = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        });
        console.log("✅ Connected to MySQL Database");
    } catch (err) {
        console.error("❌ Database Connection Error:", err.message);
        process.exit(1); // Exit if connection fails
    }
}
connectDB();

// Route: Fetch Unique Categories
app.get("/categories", async (req, res) => {
    try {
        const [results] = await db.query("SELECT DISTINCT category FROM credit_cards");
        res.json(results.map(row => row.category));
    } catch (err) {
        console.error("Error fetching categories:", err.message);
        res.status(500).json({ error: "Database error. Please try again later." });
    }
});

// Route: Fetch Credit Cards Based on Input Category
app.post("/recommend", async (req, res) => {
    const { category } = req.body;

    // Validate Input
    if (!category || typeof category !== "string" || category.length > 50) {
        return res.status(400).json({ error: "Invalid category input" });
    }

    try {
        const [results] = await db.query("SELECT * FROM credit_cards WHERE category = ?", [category]);

        // Format the response properly
        const formattedResults = results.map(card => ({
            id: card.id,
            name: card.name,
            category: card.category,
            benefits: card.benefits || "N/A", // Avoids empty benefits
            // Ensure annual_fee is a number before calling toFixed
            annual_fee: card.annual_fee !== null && !isNaN(card.annual_fee)
                ? Number(card.annual_fee).toFixed(2)
                : "0.00" // Defaults to "0.00" if invalid or null
        }));

        res.json(formattedResults);
    } catch (err) {
        console.error("Error fetching recommendations:", err.message);
        res.status(500).json({ error: "Database error. Please try again later." });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
