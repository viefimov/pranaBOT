const pg = require("pg");

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

const createTables = async () => {
  const usersTableQuery = `
        CREATE TABLE IF NOT EXISTS users (
            id BIGINT PRIMARY KEY,
            username VARCHAR(255) NULL,
            first_name VARCHAR(255) NULL
        )
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
