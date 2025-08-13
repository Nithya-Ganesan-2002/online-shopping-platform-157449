const { query } = require('../config/db');

// PUBLIC_INTERFACE
async function createUser({ email, passwordHash, name }) {
  /** Create a new user record. */
  const sql = `
    INSERT INTO users (email, password_hash, name)
    VALUES ($1, $2, $3)
    RETURNING id, email, name, created_at
  `;
  const params = [email, passwordHash, name];
  const { rows } = await query(sql, params);
  return rows[0];
}

// PUBLIC_INTERFACE
async function getUserByEmail(email) {
  /** Retrieve a user by email. */
  const sql = `
    SELECT id, email, password_hash, name, created_at
    FROM users
    WHERE email = $1
    LIMIT 1
  `;
  const { rows } = await query(sql, [email]);
  return rows[0] || null;
}

// PUBLIC_INTERFACE
async function getUserById(id) {
  /** Retrieve a user by ID. */
  const sql = `
    SELECT id, email, name, created_at
    FROM users
    WHERE id = $1
    LIMIT 1
  `;
  const { rows } = await query(sql, [id]);
  return rows[0] || null;
}

module.exports = {
  createUser,
  getUserByEmail,
  getUserById,
};
