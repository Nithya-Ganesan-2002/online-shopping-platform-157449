const { validationResult } = require('express-validator');
const {
  getCartWithItems,
  addOrUpdateItem,
  updateItemQuantity,
  removeItem,
} = require('../repositories/cart');

class CartController {
  // PUBLIC_INTERFACE
  async get(req, res) {
    /** Get current user's active cart with items. */
    const { id: userId } = req.user;
    const cart = await getCartWithItems(userId);
    return res.json(cart);
  }

  // PUBLIC_INTERFACE
  async addItem(req, res) {
    /** Add or update an item in the user's cart. Body: { productId, quantity } */
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { id: userId } = req.user;
    const { productId, quantity } = req.body;
    const item = await addOrUpdateItem(userId, productId, quantity);
    return res.status(201).json(item);
  }

  // PUBLIC_INTERFACE
  async updateItem(req, res) {
    /** Update quantity of a specific cart item. Body: { quantity } */
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { id: userId } = req.user;
    const itemId = parseInt(req.params.itemId, 10);
    const { quantity } = req.body;
    const updated = await updateItemQuantity(userId, itemId, quantity);
    if (!updated) return res.status(404).json({ error: 'Item not found' });
    return res.json(updated);
  }

  // PUBLIC_INTERFACE
  async removeItem(req, res) {
    /** Remove an item from the user's cart. */
    const { id: userId } = req.user;
    const itemId = parseInt(req.params.itemId, 10);
    await removeItem(userId, itemId);
    return res.status(204).send();
  }
}

module.exports = new CartController();
