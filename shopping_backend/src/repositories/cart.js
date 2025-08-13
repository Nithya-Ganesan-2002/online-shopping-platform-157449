const { query } = require('../config/db');

// PUBLIC_INTERFACE
async function getOrCreateActiveCart(userId) {
  /** Retrieve or create the active cart for a user. */
  const findSql = `SELECT id, user_id, status, created_at FROM carts WHERE user_id = $1 AND status = 'active' LIMIT 1`;
  const found = await query(findSql, [userId]);
  if (found.rows[0]) return found.rows[0];

  const createSql = `
    INSERT INTO carts (user_id, status)
    VALUES ($1, 'active')
    RETURNING id, user_id, status, created_at
  `;
  const created = await query(createSql, [userId]);
  return created.rows[0];
}

// PUBLIC_INTERFACE
async function getCartWithItems(userId) {
  /** Retrieve cart and items with product details for the active cart of a user. */
  const cart = await getOrCreateActiveCart(userId);
  const itemsSql = `
    SELECT ci.id AS item_id, ci.product_id, ci.quantity,
           p.name, p.price, p.image_url, p.stock
    FROM cart_items ci
    JOIN products p ON p.id = ci.product_id
    WHERE ci.cart_id = $1
    ORDER BY ci.id ASC
  `;
  const { rows: items } = await query(itemsSql, [cart.id]);
  return { cartId: cart.id, items };
}

// PUBLIC_INTERFACE
async function addOrUpdateItem(userId, productId, quantity) {
  /** Add a product to the cart or update the quantity if it already exists. */
  const cart = await getOrCreateActiveCart(userId);

  // Check if item exists
  const findSql = `SELECT id, quantity FROM cart_items WHERE cart_id = $1 AND product_id = $2 LIMIT 1`;
  const found = await query(findSql, [cart.id, productId]);

  if (found.rows[0]) {
    const newQty = found.rows[0].quantity + quantity;
    const updateSql = `UPDATE cart_items SET quantity = $1 WHERE id = $2 RETURNING id, product_id, quantity`;
    const { rows } = await query(updateSql, [newQty, found.rows[0].id]);
    return rows[0];
  }

  const insertSql = `
    INSERT INTO cart_items (cart_id, product_id, quantity)
    VALUES ($1, $2, $3)
    RETURNING id, product_id, quantity
  `;
  const { rows } = await query(insertSql, [cart.id, productId, quantity]);
  return rows[0];
}

// PUBLIC_INTERFACE
async function updateItemQuantity(userId, itemId, quantity) {
  /** Update quantity of a cart item owned by the user's active cart. */
  const cart = await getOrCreateActiveCart(userId);
  const sql = `
    UPDATE cart_items
    SET quantity = $1
    WHERE id = $2 AND cart_id = $3
    RETURNING id, product_id, quantity
  `;
  const { rows } = await query(sql, [quantity, itemId, cart.id]);
  return rows[0] || null;
}

// PUBLIC_INTERFACE
async function removeItem(userId, itemId) {
  /** Remove a cart item from the user's active cart. */
  const cart = await getOrCreateActiveCart(userId);
  const sql = `DELETE FROM cart_items WHERE id = $1 AND cart_id = $2`;
  await query(sql, [itemId, cart.id]);
  return true;
}

// PUBLIC_INTERFACE
async function clearCart(cartId) {
  /** Remove all items for a cart. */
  await query('DELETE FROM cart_items WHERE cart_id = $1', [cartId]);
  return true;
}

module.exports = {
  getOrCreateActiveCart,
  getCartWithItems,
  addOrUpdateItem,
  updateItemQuantity,
  removeItem,
  clearCart,
};
