const { validationResult } = require('express-validator');
const {
  listProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../repositories/products');

class ProductsController {
  // PUBLIC_INTERFACE
  async list(req, res) {
    /** List products. Query: search, limit, offset */
    const { search } = req.query;
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 50;
    const offset = req.query.offset ? parseInt(req.query.offset, 10) : 0;
    const products = await listProducts({ search, limit, offset });
    return res.json({ items: products, limit, offset });
  }

  // PUBLIC_INTERFACE
  async get(req, res) {
    /** Get product by ID. */
    const id = parseInt(req.params.id, 10);
    const product = await getProductById(id);
    if (!product) return res.status(404).json({ error: 'Not found' });
    return res.json(product);
  }

  // PUBLIC_INTERFACE
  async create(req, res) {
    /** Create a product. */
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name, description, price, stock, imageUrl } = req.body;
    const created = await createProduct({ name, description, price, stock, imageUrl });
    return res.status(201).json(created);
  }

  // PUBLIC_INTERFACE
  async update(req, res) {
    /** Update a product. */
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const id = parseInt(req.params.id, 10);
    const { name, description, price, stock, imageUrl } = req.body;
    const updated = await updateProduct(id, { name, description, price, stock, imageUrl });
    if (!updated) return res.status(404).json({ error: 'Not found' });
    return res.json(updated);
  }

  // PUBLIC_INTERFACE
  async remove(req, res) {
    /** Delete a product. */
    const id = parseInt(req.params.id, 10);
    await deleteProduct(id);
    return res.status(204).send();
  }
}

module.exports = new ProductsController();
