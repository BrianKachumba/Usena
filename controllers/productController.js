

  // productController.js
const productModel = require('../models/productModel');

/**
 * Upload a new product.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 */
const uploadProduct = async (req, res) => {
  const { userId, name, description, price, category } = req.body;
  try {
    const product = await productModel.createProduct(userId, name, description, price, category);
    res.status(200).json({ success: true, product });
  } catch (error) {
    console.error('Error uploading product:', error);
    res.status(500).json({ success: false, message: 'Unable to upload product.' });
  }
};

/**
 * Get all products.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 */
const getAllProducts = async (req, res) => {
  try {
    const products = await productModel.getAllProducts();
    res.status(200).json({ success: true, products });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ success: false, message: 'Unable to fetch products.' });
  }
};

/**
 * Get products by category.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 */
const getProductsByCategory = async (req, res) => {
  const { category } = req.params;
  try {
    const products = await productModel.getProductsByCategory(category);
    res.status(200).json({ success: true, products });
  } catch (error) {
    console.error('Error fetching products by category:', error);
    res.status(500).json({ success: false, message: 'Unable to fetch products.' });
  }
};

module.exports = {
  uploadProduct,
  getAllProducts,
  getProductsByCategory,
};
