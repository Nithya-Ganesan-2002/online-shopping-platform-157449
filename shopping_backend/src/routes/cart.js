const express = require('express');
const { body } = require('express-validator');
const cartController = require('../controllers/cart');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Shopping cart operations
 */

/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: Get current user's cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart details
 */
router.get('/', authMiddleware, cartController.get.bind(cartController));

/**
 * @swagger
 * /api/cart/items:
 *   post:
 *     summary: Add or update a cart item
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [productId, quantity]
 *             properties:
 *               productId: { type: integer }
 *               quantity: { type: integer }
 *     responses:
 *       201:
 *         description: Item added or updated
 *       400:
 *         description: Validation error
 */
router.post(
  '/items',
  authMiddleware,
  [
    body('productId').isInt({ min: 1 }).withMessage('productId is required'),
    body('quantity').isInt({ min: 1 }).withMessage('quantity must be >= 1'),
  ],
  cartController.addItem.bind(cartController)
);

/**
 * @swagger
 * /api/cart/items/{itemId}:
 *   put:
 *     summary: Update quantity of a cart item
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [quantity]
 *             properties:
 *               quantity: { type: integer }
 *     responses:
 *       200:
 *         description: Item updated
 *       400:
 *         description: Validation error
 *       404:
 *         description: Not found
 */
router.put(
  '/items/:itemId',
  authMiddleware,
  [body('quantity').isInt({ min: 1 }).withMessage('quantity must be >= 1')],
  cartController.updateItem.bind(cartController)
);

/**
 * @swagger
 * /api/cart/items/{itemId}:
 *   delete:
 *     summary: Remove a cart item
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       204:
 *         description: Item removed
 */
router.delete('/items/:itemId', authMiddleware, cartController.removeItem.bind(cartController));

module.exports = router;
