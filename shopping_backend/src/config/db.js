const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

/**
 * Builds the database configuration from environment variables.
 * Supports DATABASE_URL or discrete DB_* variables.
 */
function buildDbConfig() {
  const {
    DATABASE_URL,
    DB_HOST,
    DB_PORT,
    DB_USER,
    DB_PASSWORD,
    DB_NAME,
    DB_SSL,
    NODE_ENV,
  } = process.env;

  if (DATABASE_URL) {
    return {
      connectionString: DATABASE_URL,
      ssl: (DB_SSL && DB_SSL.toString().toLowerCase() === 'true') || NODE_ENV === 'production'
        ? { rejectUnauthorized: false }
        : false,
    };
  }

  return {
    host: DB_HOST || 'localhost',
    port: DB_PORT ? parseInt(DB_PORT, 10) : 5432,
    user: DB_USER || 'postgres',
    password: DB_PASSWORD || 'postgres',
    database: DB_NAME || 'shopping_db',
    ssl: (DB_SSL && DB_SSL.toString().toLowerCase() === 'true') || NODE_ENV === 'production'
      ? { rejectUnauthorized: false }
      : false,
  };
}

const pool = new Pool(buildDbConfig());

pool.on('connect', () => {
  // Connected to DB
  if (process.env.NODE_ENV !== 'test') {
    console.log('Database connection established');
  }
});

pool.on('error', (err) => {
  console.error('Unexpected database error', err);
});

// PUBLIC_INTERFACE
function query(text, params) {
  /** Execute a parameterized SQL query using the shared pool. */
  return pool.query(text, params);
}

// PUBLIC_INTERFACE
async function withTransaction(work) {
  /**
   * Execute the provided async function within a DB transaction.
   * Commits on success; rolls back on error.
   */
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await work(client);
    await client.query('COMMIT');
    return result;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

// PUBLIC_INTERFACE
async function healthCheck() {
  /** Simple health check query to validate DB connectivity. */
  await pool.query('SELECT 1');
  return true;
}

module.exports = {
  pool,
  query,
  withTransaction,
  healthCheck,
};
