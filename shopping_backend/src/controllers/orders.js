const { checkout, listOrdersByUser, getOrderById } = require('../repositories/orders');

class OrdersController {
  // PUBLIC_INTERFACE
  async createFromCart(req, res) {
    /** Create an order from the current user's active cart (checkout). */
    try {
      const { id: userId } = req.user;
      const order = await checkout(userId);
      return res.status(201).json(order);
    } catch (err) {
      return res.status(400).json({ error: err.message || 'Checkout failed' });
    }
  }

  // PUBLIC_INTERFACE
  async list(req, res) {
    /** List orders for the current user. */
    const { id: userId } = req.user;
    const orders = await listOrdersByUser(userId);
    return res.json({ items: orders });
  }

  // PUBLIC_INTERFACE
  async get(req, res) {
    /** Get order details for the current user. */
    const { id: userId } = req.user;
    const orderId = parseInt(req.params.id, 10);
    const order = await getOrderById(userId, orderId);
    if (!order) return res.status(404).json({ error: 'Not found' });
    return res.json(order);
  }
}

module.exports = new OrdersController();
