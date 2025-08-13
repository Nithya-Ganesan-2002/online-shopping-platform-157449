const { query } = require('../config/db');

// PUBLIC_INTERFACE
async function listProducts({ search, limit = 50, offset = 0 } = {}) {
  /** List products with optional search, pagination. */
  let sql = `
    SELECT id, name, description, price, stock, image_url, created_at
    FROM products
  `;
  const params = [];
  if (search) {
    params.push(`%${search}%`);
    sql += ` WHERE name ILIKE $${params.length} OR description ILIKE $${params.length} `;
  }
  params.push(limit, offset);
  sql += ` ORDER BY id DESC LIMIT $${params.length - 1} OFFSET $${params.length}`;
  const { rows } = await query(sql, params);
  return rows;
}

// PUBLIC_INTERFACE
async function getProductById(id) {
  /** Get product by ID. */
  const sql = `
    SELECT id, name, description, price, stock, image_url, created_at
    FROM products WHERE id = $1
  `;
  const { rows } = await query(sql, [id]);
  return rows[0] || null;
}

// PUBLIC_INTERFACE
async function createProduct({ name, description, price, stock = 0, imageUrl }) {
  /** Create a product. */
  const sql = `
    INSERT INTO products (name, description, price, stock, image_url)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, name, description, price, stock, image_url, created_at
  `;
  const params = [name, description, price, stock, imageUrl || null];
  const { rows } = await query(sql, params);
  return rows[0];
}

// PUBLIC_INTERFACE
async function updateProduct(id, { name, description, price, stock, imageUrl }) {
  /** Update product fields. */
  const sql = `
    UPDATE products
    SET name = $1, description = $2, price = $3, stock = $4, image_url = $5
    WHERE id = $6
    RETURNING id, name, description, price, stock, image_url, created_at
  `;
  const params = [name, description, price, stock, imageUrl || null, id];
  const { rows } = await query(sql, params);
  return rows[0] || null;
}

// PUBLIC_INTERFACE
async function deleteProduct(id) {
  /** Delete product by ID. */
  const sql = 'DELETE FROM products WHERE id = $1';
  await query(sql, [id]);
  return true;
}

module.exports = {
  listProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
