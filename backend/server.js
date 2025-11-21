const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Helpers -------------------------------------------------------
function loadJSON(name) {
  const filePath = path.join(__dirname, "data", name + ".json");
  if (!fs.existsSync(filePath)) return [];
  return JSON.parse(fs.readFileSync(filePath));
}

function saveJSON(name, data) {
  const filePath = path.join(__dirname, "data", name + ".json");
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// TASKS ---------------------------------------------------------
app.get("/tasks", (req, res) => {
  const tasks = loadJSON("tasks");
  res.json(tasks);
});

app.post("/tasks", (req, res) => {
  const tasks = loadJSON("tasks");
  const newTask = { id: Date.now().toString(), ...req.body };
  tasks.push(newTask);
  saveJSON("tasks", tasks);
  res.json(newTask);
});

app.put("/tasks/:id", (req, res) => {
  const tasks = loadJSON("tasks");
  const idx = tasks.findIndex(t => t.id === req.params.id);

  if (idx === -1) {
    return res.status(404).json({ error: "Task not found" });
  }

  tasks[idx] = { ...tasks[idx], ...req.body };
  saveJSON("tasks", tasks);
  res.json(tasks[idx]);
});

app.delete("/tasks/:id", (req, res) => {
  const tasks = loadJSON("tasks");
  const updated = tasks.filter(t => t.id !== req.params.id);
  saveJSON("tasks", updated);
  res.json({ success: true });
});

// CATEGORY -------------------------------------------------------
app.get("/categories", (req, res) => {
  res.json(loadJSON("categories"));
});

app.post("/categories", (req, res) => {
  const cats = loadJSON("categories");
  const newCat = { id: Date.now().toString(), ...req.body };
  cats.push(newCat);
  saveJSON("categories", cats);
  res.json(newCat);
});

app.put("/categories/:id", (req, res) => {
  const cats = loadJSON("categories");
  const idx = cats.findIndex(c => c.id === req.params.id);

  if (idx === -1) {
    return res.status(404).json({ error: "Category not found" });
  }

  cats[idx] = { ...cats[idx], ...req.body };
  saveJSON("categories", cats);
  res.json(cats[idx]);
});

// COMPLETIONS ---------------------------------------------------
app.get("/task-completions", (req, res) => {
  const completions = loadJSON("taskcompletions");

  let filtered = completions;
  if (req.query.date) filtered = filtered.filter(c => c.date === req.query.date);
  if (req.query.task_id) filtered = filtered.filter(c => c.task_id === req.query.task_id);

  res.json(filtered);
});

app.post("/task-completions", (req, res) => {
  const completions = loadJSON("taskcompletions");
  const newComp = { id: Date.now().toString(), ...req.body };
  completions.push(newComp);
  saveJSON("taskcompletions", completions);
  res.json(newComp);
});

app.put("/task-completions/:id", (req, res) => {
  const completions = loadJSON("taskcompletions");
  const idx = completions.findIndex(c => c.id === req.params.id);

  if (idx === -1) {
    return res.status(404).json({ error: "Completion not found" });
  }

  completions[idx] = { ...completions[idx], ...req.body };
  saveJSON("taskcompletions", completions);
  res.json(completions[idx]);
});

// START ---------------------------------------------------------
app.listen(3001, () =>
  console.log("Backend rodando em http://localhost:3001")
);
