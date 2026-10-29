
const jwt = require("jsonwebtoken");

function verifierToken(req, res, next) {
  // Récupérer le token dans l'en-tête Authorization
  const authorization = req.headers.authorization;

  // Vérifier que le token est présent et utilise Bearer
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Accès refusé. Token manquant."
    });
  }

  // Extraire le token
  const token = authorization.split(" ")[1];

  try {
    // Vérifier la validité du token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Rendre les informations de l'utilisateur disponibles
    req.utilisateur = decoded;

    // Passer au traitement suivant
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Token invalide ou expiré."
    });
  }
}

module.exports = verifierToken;
