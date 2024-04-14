import pg from "pg";

const { Pool } = pg;

const pool = new Pool({
  connectionString:
    "postgres://default:uIDcBLzHn9r2@ep-bitter-scene-a2f1zxf1.eu-central-1.aws.neon.tech:5432/verceldb?sslmode=require",
});

const createTables = async () => {
  const usersTableQuery = `
        CREATE TABLE IF NOT EXISTS users (
            id BIGINT PRIMARY KEY,
            username VARCHAR(255) NULL,
            first_name VARCHAR(255) NULL,
            joined_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
    `;
  try {
    await pool.query(usersTableQuery);
    console.log("Table creation successful.");
  } catch (err) {
    console.error("Error creating tables:", err);
    throw err;
  }
};

module.exports = {
  query: (text, params) => pool.query(text, params),
  createTables,
};
