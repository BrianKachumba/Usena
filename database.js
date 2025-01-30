const mysql = require("mysql2");

// Create a connection to the Aiven MySQL database
const db = mysql.createConnection({
    host: "mysql-ecommerce-usena.g.aivencloud.com",
    user: "avnadmin",
    password: "AVNS_jNuE8N-tr2kgU0Vd0yt",
    database: "defaultdb",
    port: 20698,
    ssl: {
        // SSL configuration for secure connection
        rejectUnauthorized: false
    }
});

// Connect to the database
db.connect((err) => {
    if (err) {
        console.error("Database connection error:", err.message);
        return;
    }
    console.log("Connected to MySQL.");

    // Create users table
    const createUsersTable = `CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL
    )`;
    db.query(createUsersTable, (err) => {
        if (err) {
            console.error("Error creating users table:", err.message);
        } else {
            console.log("Users table created or already exists.");
        }
    });

    // Create comments table
    const createCommentsTableQuery = `
        CREATE TABLE IF NOT EXISTS comments (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            comment TEXT NOT NULL
        )
    `;
    db.query(createCommentsTableQuery, (err) => {
        if (err) {
            console.error("Error creating comments table:", err.message);
        } else {
            console.log("Comments table created or already exists.");
        }
    });

    // Create products table
    const createProductsTableQuery = `
        CREATE TABLE IF NOT EXISTS products (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            description TEXT NOT NULL,
            price DECIMAL(10, 2) NOT NULL,
            image VARCHAR(255) NOT NULL,
            dealer_mobile VARCHAR(15) NOT NULL,
            user_id INT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    `;
    db.query(createProductsTableQuery, (err) => {
        if (err) {
            console.error("Error creating products table:", err.message);
        } else {
            console.log("Products table created or already exists.");
        }
    });
});

// Export the database connection
module.exports = db;
