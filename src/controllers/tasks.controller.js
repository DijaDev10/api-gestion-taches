
const pool = require("../config/database");

// 1. Afficher les tâches de l'utilisateur connecté
async function getTasks(req, res) {
  try {
    const resultat = await pool.query(
      `SELECT * FROM tasks
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [req.utilisateur.id]
    );

    res.status(200).json(resultat.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      message: "Erreur lors de la récupération des tâches."
    });
  }
}

// 2. Créer une nouvelle tâche
async function createTask(req, res) {
  try {
    const { title, description } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        message: "Le titre de la tâche est obligatoire."
      });
    }

    const resultat = await pool.query(
      `INSERT INTO tasks (title, description, user_id)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [
        title.trim(),
        description || null,
        req.utilisateur.id
      ]
    );

    res.status(201).json({
      message: "Tâche créée avec succès.",
      tache: resultat.rows[0]
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      message: "Erreur lors de la création de la tâche."
    });
  }
}

// 3. Modifier une tâche
async function updateTask(req, res) {
  try {
    const { id } = req.params;
    const { title, description, completed } = req.body;

    const resultat = await pool.query(
      `UPDATE tasks
       SET title = COALESCE($1, title),
           description = COALESCE($2, description),
           completed = COALESCE($3, completed)
       WHERE id = $4 AND user_id = $5
       RETURNING *`,
      [
        title === undefined ? null : title.trim(),
        description === undefined ? null : description,
        completed === undefined ? null : completed,
        id,
        req.utilisateur.id
      ]
    );

    if (resultat.rows.length === 0) {
      return res.status(404).json({
        message: "Tâche introuvable."
      });
    }

    res.status(200).json({
      message: "Tâche modifiée avec succès.",
      tache: resultat.rows[0]
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      message: "Erreur lors de la modification de la tâche."
    });
  }
}

// 4. Supprimer une tâche
async function deleteTask(req, res) {
  try {
    const { id } = req.params;

    const resultat = await pool.query(
      `DELETE FROM tasks
       WHERE id = $1 AND user_id = $2
       RETURNING id`,
      [id, req.utilisateur.id]
    );

    if (resultat.rows.length === 0) {
      return res.status(404).json({
        message: "Tâche introuvable."
      });
    }

    res.status(200).json({
      message: "Tâche supprimée avec succès."
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      message: "Erreur lors de la suppression de la tâche."
    });
  }
}

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask
};
