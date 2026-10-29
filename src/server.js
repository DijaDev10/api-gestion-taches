
require("dotenv").config();

const app = require("./app");
const pool = require("./config/database");

const PORT = process.env.PORT || 3000;

// Vérifie la connexion à PostgreSQL avant de démarrer le serveur.
async function demarrerServeur() {
  try {
    await pool.query("SELECT 1");

    console.log("Connexion à PostgreSQL réussie !");

    app.listen(PORT, () => {
      console.log(`Serveur démarré sur http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Impossible de démarrer l'API :", error.message);
    process.exitCode = 1;
  }
}

demarrerServeur();
