const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';
const DEFAULT_EXPIRES_IN = '7d';

// PUBLIC_INTERFACE
function signJwt(payload, options = {}) {
  /** Sign a JWT token with the provided payload. */
  const expiresIn = options.expiresIn || DEFAULT_EXPIRES_IN;
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

// PUBLIC_INTERFACE
function verifyJwt(token) {
  /** Verify a JWT token and return the decoded payload. */
  return jwt.verify(token, JWT_SECRET);
}

module.exports = {
  signJwt,
  verifyJwt,
};
