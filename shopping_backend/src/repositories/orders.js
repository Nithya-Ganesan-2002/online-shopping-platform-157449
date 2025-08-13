const { withTransaction } = require('../config/db');
const { getOrCreateActiveCart, clearCart } = require('./cart');

// PUBLIC_INTERFACE
async function checkout(userId) {
  /**
   * Create an order from the user's active cart.
   * Calculates totals, creates order and order items, marks cart as checked_out,
   * and optionally reduces product stock.
   */
  return withTransaction(async (client) => {
    const cart = await getOrCreateActiveCart(userId);

    // Load items with price
    const itemsSql = `
      SELECT ci.product_id, ci.quantity, p.price, p.stock
      FROM cart_items ci
      JOIN products p ON p.id = ci.product_id
      WHERE ci.cart_id = $1
    `;
    const { rows: items } = await client.query(itemsSql, [cart.id]);

    if (items.length === 0) {
      throw new Error('Cart is empty');
    }

    // Calculate total and check stock availability
    let total = 0;
    for (const it of items) {
      if (it.quantity > it.stock) {
        throw new Error('Insufficient stock for one or more items');
      }
      total += Number(it.price) * it.quantity;
    }

    // Create order
    const orderSql = `
      INSERT INTO orders (user_id, total_amount, status)
      VALUES ($1, $2, 'created')
      RETURNING id, user_id, total_amount, status, created_at
    `;
    const { rows: orderRows } = await client.query(orderSql, [userId, total]);
    const order = orderRows[0];

    // Insert order items
    for (const it of items) {
      const oiSql = `
        INSERT INTO order_items (order_id, product_id, quantity, price)
        VALUES ($1, $2, $3, $4)
      `;
      await client.query(oiSql, [order.id, it.product_id, it.quantity, it.price]);

      // Reduce stock
      const stockSql = `UPDATE products SET stock = stock - $1 WHERE id = $2`;
      await client.query(stockSql, [it.quantity, it.product_id]);
    }

    // Mark cart as checked_out and clear items
    await client.query(`UPDATE carts SET status = 'checked_out' WHERE id = $1`, [cart.id]);
    await client.query(`DELETE FROM cart_items WHERE cart_id = $1`, [cart.id]);

    return order;
  });
}

// PUBLIC_INTERFACE
async function listOrdersByUser(userId) {
  /** List orders belonging to the user. */
  const sql = `
    SELECT id, user_id, total_amount, status, created_at
    FROM orders
    WHERE user_id = $1
    ORDER BY id DESC
  `;
  const { rows } = await require('../config/db').query(sql, [userId]);
  return rows;
}

// PUBLIC_INTERFACE
async function getOrderById(userId, orderId) {
  /** Get an order by ID making sure it belongs to the user. */
  const sql = `
    SELECT id, user_id, total_amount, status, created_at
    FROM orders
    WHERE id = $1 AND user_id = $2
    LIMIT 1
  `;
  const { rows } = await require('../config/db').query(sql, [orderId, userId]);
  return rows[0] || null;
}

module.exports = {
  checkout,
  listOrdersByUser,
  getOrderById,
};
