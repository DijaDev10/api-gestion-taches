
const pool = require("../config/database");
const bcrypt = require("bcrypt");

// Inscription d'un nouvel utilisateur
async function register(req, res) {
  try {
    const { name, email, password } = req.body;

    // Vérifier les champs obligatoires
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Le nom, l'email et le mot de passe sont obligatoires."
      });
    }

    // Vérifier la longueur minimale du mot de passe
    if (password.length < 8) {
      return res.status(400).json({
        message: "Le mot de passe doit contenir au moins 8 caractères."
      });
    }

    // Vérifier si l'email existe déjà
    const utilisateurExistant = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email.trim().toLowerCase()]
    );

    if (utilisateurExistant.rows.length > 0) {
      return res.status(409).json({
        message: "Cette adresse email est déjà utilisée."
      });
    }

    // Hacher le mot de passe avant de l'enregistrer
    const motDePasseHache = await bcrypt.hash(password, 10);

    // Enregistrer l'utilisateur dans PostgreSQL
    const resultat = await pool.query(
      `INSERT INTO users (name, email, password)
       VALUES ($1, $2, $3)
       RETURNING id, name, email, created_at`,
      [name.trim(), email.trim().toLowerCase(), motDePasseHache]
    );

    return res.status(201).json({
      message: "Inscription réussie.",
      utilisateur: resultat.rows[0]
    });

  } catch (error) {
    console.error("Erreur inscription :", error.message);

    return res.status(500).json({
      message: "Une erreur interne est survenue."
    });
  }
}
// Connexion d'un utilisateur existant
async function login(req, res) {
  try {
    const { email, password } = req.body;

    // Vérifier que les champs sont renseignés
    if (!email || !password) {
      return res.status(400).json({
        message: "L'email et le mot de passe sont obligatoires."
      });
    }

    // Rechercher l'utilisateur dans la base de données
    const resultat = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email.trim().toLowerCase()]
    );

    // Vérifier que l'utilisateur existe
    if (resultat.rows.length === 0) {
      return res.status(401).json({
        message: "Email ou mot de passe incorrect."
      });
    }

    const utilisateur = resultat.rows[0];

    // Comparer le mot de passe fourni avec le mot de passe haché
    const motDePasseValide = await bcrypt.compare(
      password,
      utilisateur.password
    );

    if (!motDePasseValide) {
      return res.status(401).json({
        message: "Email ou mot de passe incorrect."
      });
    }

    // Créer le token JWT
    const token = require("jsonwebtoken").sign(
      {
        id: utilisateur.id,
        email: utilisateur.email
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || "1h"
      }
    );

    // Renvoyer le token sans le mot de passe
    return res.status(200).json({
      message: "Connexion réussie.",
      token: token,
      utilisateur: {
        id: utilisateur.id,
        name: utilisateur.name,
        email: utilisateur.email
      }
    });

  } catch (error) {
    console.error("Erreur connexion :", error.message);

    return res.status(500).json({
      message: "Une erreur interne est survenue."
    });
  }
}

module.exports = { register, login };
