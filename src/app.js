

const express = require("express");
const app = express();

const authRoutes = require("./routes/auth.routes");
const tasksRoutes = require("./routes/tasks.routes");

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Bienvenue sur notre API de gestion des tâches !"
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/tasks", tasksRoutes);

module.exports = app;
