const express = require('express');
const { body } = require('express-validator');
const productsController = require('../controllers/products');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product catalogue management
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: List products
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of products
 */
router.get('/', productsController.list.bind(productsController));

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Product found
 *       404:
 *         description: Not found
 */
router.get('/:id', productsController.get.bind(productsController));

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, description, price, stock]
 *             properties:
 *               name: { type: string }
 *               description: { type: string }
 *               price: { type: number }
 *               stock: { type: integer }
 *               imageUrl: { type: string }
 *     responses:
 *       201:
 *         description: Product created
 *       400:
 *         description: Validation error
 */
router.post(
  '/',
  authMiddleware,
  [
    body('name').isLength({ min: 1 }).withMessage('Name is required'),
    body('description').isLength({ min: 1 }).withMessage('Description is required'),
    body('price').isFloat({ gt: 0 }).withMessage('Price must be > 0'),
    body('stock').isInt({ min: 0 }).withMessage('Stock must be >= 0'),
  ],
  productsController.create.bind(productsController)
);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update a product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, description, price, stock]
 *             properties:
 *               name: { type: string }
 *               description: { type: string }
 *               price: { type: number }
 *               stock: { type: integer }
 *               imageUrl: { type: string }
 *     responses:
 *       200:
 *         description: Updated product
 *       400:
 *         description: Validation error
 *       404:
 *         description: Not found
 */
router.put(
  '/:id',
  authMiddleware,
  [
    body('name').isLength({ min: 1 }).withMessage('Name is required'),
    body('description').isLength({ min: 1 }).withMessage('Description is required'),
    body('price').isFloat({ gt: 0 }).withMessage('Price must be > 0'),
    body('stock').isInt({ min: 0 }).withMessage('Stock must be >= 0'),
  ],
  productsController.update.bind(productsController)
);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete a product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       204:
 *         description: Deleted
 */
router.delete('/:id', authMiddleware, productsController.remove.bind(productsController));

module.exports = router;
