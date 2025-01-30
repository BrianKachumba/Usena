// Protected route for uploading products
app.post("/products", authenticateUser, upload.single("image"), (req, res) => {
  const { name, description, price, dealer_mobile } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : null;

  if (!name || !description || !price || !image || !dealer_mobile) {
      return res.status(400).json({ error: "All fields are required" });
  }

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

// Protected route for deleting products
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