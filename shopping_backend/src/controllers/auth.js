const { validationResult } = require('express-validator');
const { createUser, getUserByEmail } = require('../repositories/users');
const { hashPassword, comparePasswords } = require('../utils/password');
const { signJwt } = require('../utils/jwt');

class AuthController {
  // PUBLIC_INTERFACE
  async register(req, res) {
    /**
     * Register a new user.
     * Body: { email, password, name }
     * Returns: { user, token }
     */
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, name } = req.body;

    // Check if user exists
    const existing = await getUserByEmail(email);
    if (existing) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const passwordHash = await hashPassword(password);
    const user = await createUser({ email, passwordHash, name });
    const token = signJwt({ id: user.id, email: user.email, name: user.name });
    return res.status(201).json({ user, token });
  }

  // PUBLIC_INTERFACE
  async login(req, res) {
    /**
     * Login a user.
     * Body: { email, password }
     * Returns: { user, token }
     */
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const ok = await comparePasswords(password, user.password_hash);
    if (!ok) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const { password_hash, ...safeUser } = user;
    const token = signJwt({ id: user.id, email: user.email, name: user.name });
    return res.status(200).json({ user: safeUser, token });
  }
}

module.exports = new AuthController();
