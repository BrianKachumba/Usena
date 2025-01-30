// models/userModel.js
const mysql = require('mysql2');
const db = require('../db');  // Import database connection

// User model - find user by email
exports.findByEmail = (email) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
            if (err) return reject(err);
            resolve(results[0]);
        });
    });
};

// User model - create new user
exports.create = async (userData) => {
  const query ="INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
  const values = [userData.name, userData.email, userData.password];

  try {
    // Execute the query using the database connection and await the result
    const [results] = await db.query(query, values);

    // Log the inserted user ID
    console.log("User created successfully with ID:", results.insertId);

    // Return the new user data along with the inserted ID
    return {
      id: results.insertId,
      name: userData.name,
      email: userData.email,
    };
  } catch (err) {
    console.error("Error while inserting user:", err);
    throw err; // Rethrow the error so the controller can handle it
  }
};
