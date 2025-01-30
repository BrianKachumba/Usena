const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer"); // For handling file uploads
const path = require("path");
const db = require("./database"); // Import the MySQL connection
const fs = require("fs");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require('dotenv').config();

const app = express();
const PORT = 3000;
const SECRET_KEY = "heey";

// Middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // Serve static files

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log("Uploads directory created.");
}

// User Registration
app.post("/api/auth/register", async (req, res) => {
    const { name, email, password } = req.body;

    console.log("Received signup request:", { name, email, password }); // Debugging line

    if (!name || !email || !password) {
        return res.status(400).json({ error: "All fields are required." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
    db.query(sql, [name, email, hashedPassword], (err, result) => {
        if (err) {
            console.error("Database error:", err.message); // Debugging line
            return res.status(500).json({ error: err.message });
        }
        console.log("User registered successfully:", result); // Debugging line
        res.json({ message: "User registered successfully!" });
    });
});

// User Login
app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required." });
    }

    const sql = "SELECT * FROM users WHERE email = ?";
    db.query(sql, [email], async (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(401).json({ error: "Invalid credentials." });

        const user = results[0];
        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ error: "Invalid credentials." });

        const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: "1h" });
        res.json({ message: "Login successful", token });
    });
});

// File upload configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Files are saved to "uploads" folder
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage });

// Authentication middleware
const authenticateUser = (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
        return res.status(401).json({ error: "Access denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded; // Attach the decoded user data to the request object
        next();
    } catch (err) {
        res.status(400).json({ error: "Invalid token." });
    }
};

// Route to fetch all products
app.get("/products", (req, res) => {
    const sql = "SELECT * FROM products";
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// Protected route to upload a new product
app.post("/products", authenticateUser, upload.single("image"), (req, res) => {
    const { name, description, price, dealer_mobile } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    // Check if all required fields are provided
    if (!name || !description || !price || !image || !dealer_mobile) {
        return res.status(400).json({ error: "All fields are required" });
    }

    // SQL query to insert product
    const sql = `
        INSERT INTO products (name, description, price, image, dealer_mobile, user_id)
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    const params = [name, description, price, image, dealer_mobile, req.user.id]; // Include user_id

    db.query(sql, params, (err, results) => {
        if (err) {
            console.error("SQL error:", err.message);
            return res.status(500).json({ error: "Database insertion failed" });
        }
        res.status(201).json({ id: results.insertId, name, description, price, image, dealer_mobile });
    });
});

// Protected route to delete a product
app.delete("/products/:id", authenticateUser, (req, res) => {
    const productId = req.params.id;
    const userId = req.user.id; // Get the logged-in user's ID

    // Ensure the product belongs to the logged-in user
    const sql = "DELETE FROM products WHERE id = ? AND user_id = ?";
    db.query(sql, [productId, userId], (err, results) => {
        if (err) {
            console.error("SQL error:", err.message);
            return res.status(500).json({ error: "Database deletion failed" });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: "Product not found or you do not have permission to delete it." });
        }
        res.json({ message: "Product deleted successfully." });
    });
});

// GET route to fetch comments
app.get("/comments", (req, res) => {
    const sql = "SELECT * FROM comments";
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// POST route to add a new comment
app.post("/comments", (req, res) => {
    const { name, comment } = req.body;

    // Validation
    if (!name || !comment) {
        return res.status(400).json({ error: "Name and comment are required" });
    }

    const sql = "INSERT INTO comments (name, comment) VALUES (?, ?)";
    const params = [name, comment];

    db.query(sql, params, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        console.log("Inserted comment:", { name, comment }); // Debugging line
        res.status(201).json({ id: results.insertId, name, comment });
    });
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});