
const express = require("express");
const router = express.Router();

const verifierToken = require("../middlewares/auth.middleware");

const {
  getTasks,
  createTask,
  updateTask,
  deleteTask
} = require("../controllers/tasks.controller");

// Toutes les routes ci-dessous nécessitent un token valide
router.use(verifierToken);

router.get("/", getTasks);
router.post("/", createTask);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

module.exports = router;
