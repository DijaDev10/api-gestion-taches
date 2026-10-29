
const { Pool } = require("pg");
require("dotenv").config();

// Crée un pool de connexions vers PostgreSQL.
const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Affiche une erreur si une connexion échoue.
pool.on("error", (err) => {
  console.error("Erreur inattendue PostgreSQL :", err.message);
});

module.exports = pool;
