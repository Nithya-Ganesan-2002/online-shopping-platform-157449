const bcrypt = require('bcryptjs');

const SALT_ROUNDS = 10;

// PUBLIC_INTERFACE
async function hashPassword(password) {
  /** Hash a plaintext password using bcrypt. */
  return bcrypt.hash(password, SALT_ROUNDS);
}

// PUBLIC_INTERFACE
async function comparePasswords(password, hash) {
  /** Compare a plaintext password with a bcrypt hash. */
  return bcrypt.compare(password, hash);
}

module.exports = {
  hashPassword,
  comparePasswords,
};
