// models/productModel.js
const db = require('../db');

// Get all products
exports.getAll = () => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM products', (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};

// Add a new product
exports.create = (productData) => {
    return new Promise((resolve, reject) => {
        db.query('INSERT INTO products (name, description, price, image_url) VALUES (?, ?, ?, ?)', 
                  [productData.name, productData.description, productData.price, productData.image_url], 
                  (err, results) => {
            if (err) return reject(err);
            resolve({ id: results.insertId, ...productData });
        });
    });
};
