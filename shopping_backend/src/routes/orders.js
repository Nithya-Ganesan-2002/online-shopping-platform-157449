const express = require('express');
const ordersController = require('../controllers/orders');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order processing and history
 */

/**
 * @swagger
 * /api/orders/checkout:
 *   post:
 *     summary: Checkout and create an order from the current cart
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Order created
 *       400:
 *         description: Checkout failed
 */
router.post('/checkout', authMiddleware, ordersController.createFromCart.bind(ordersController));

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: List the current user's orders
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of orders
 */
router.get('/', authMiddleware, ordersController.list.bind(ordersController));

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Get order details
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema: { type: integer }
 *         required: true
 *     responses:
 *       200:
 *         description: Order details
 *       404:
 *         description: Not found
 */
router.get('/:id', authMiddleware, ordersController.get.bind(ordersController));

module.exports = router;
