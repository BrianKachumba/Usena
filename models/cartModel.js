// cartModel.js
const db = require('../db');
/**
 * Add an item to the cart.
 * @param {number} userId - The ID of the user.
 * @param {number} productId - The ID of the product.
 * @param {number} quantity - The quantity of the product.
 * @returns {Promise<object>} - The cart item details.
 */
const addToCart = async (userId, productId, quantity) => {
  const query = `
    INSERT INTO cart (user_id, product_id, quantity)
    VALUES (?, ?, ?)
  `;
  try {
    const [result] = await db.execute(query, [userId, productId, quantity]);
    return { cartItemId: result.insertId };
  } catch (error) {
    console.error('Error adding to cart:', error);
    throw new Error('Unable to add item to the cart.');
  }
};

/**
 * Get all items in a user's cart.
 * @param {number} userId - The ID of the user.
 * @returns {Promise<Array>} - List of cart items.
 */
const getCartItems = async (userId) => {
  const query = `
    SELECT c.id AS cart_id, p.name AS product_name, c.quantity, p.price
    FROM cart c
    JOIN products p ON c.product_id = p.id
    WHERE c.user_id = ?
  `;
  try {
    const [rows] = await db.execute(query, [userId]);
    return rows;
  } catch (error) {
    console.error('Error fetching cart items:', error);
    throw new Error('Unable to fetch cart items.');
  }
};

/**
 * Remove an item from the cart.
 * @param {number} cartItemId - The ID of the cart item.
 * @returns {Promise<void>}
 */
const removeCartItem = async (cartItemId) => {
  const query = `
    DELETE FROM cart
    WHERE id = ?
  `;
  try {
    await db.execute(query, [cartItemId]);
  } catch (error) {
    console.error('Error removing cart item:', error);
    throw new Error('Unable to remove cart item.');
  }
};

module.exports = {
  addToCart,
  getCartItems,
  removeCartItem,
};
