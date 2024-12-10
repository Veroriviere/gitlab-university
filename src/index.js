// src/index.js
const express = require('express');
const cors = require('cors');
const app = express();
const tasks = require('./tasks');

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Welcome route
app.get('/', (req, res) => {
  res.send('Welcome to TaskMaster API!');
});

// Get all tasks
app.get('/tasks', (req, res) => {
  res.json(tasks.getAllTasks());
});

// Get single task
app.get('/tasks/:id', (req, res) => {
  try {
    const task = tasks.getTaskById(Number(req.params.id));
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Create new task
app.post('/tasks', (req, res) => {
  try {
    const newTask = tasks.addTask(req.body);
    res.status(201).json(newTask);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update task
app.put('/tasks/:id', (req, res) => {
  try {
    const updatedTask = tasks.updateTask(Number(req.params.id), req.body);
    res.json(updatedTask);
  } catch (error) {
    if (error.message === 'Task not found') {
      return res.status(404).json({ error: error.message });
    }
    res.status(400).json({ error: error.message });
  }
});

// Delete task
app.delete('/tasks/:id', (req, res) => {
  try {
    tasks.deleteTask(Number(req.params.id));
    res.status(204).send();
  } catch (error) {
    if (error.message === 'Task not found') {
      return res.status(404).json({ error: error.message });
    }
    res.status(400).json({ error: error.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, '0.0.0.0', () => {
  console.log(`TaskMaster running on port ${port}`);
});
// Export for testing
module.exports = (app) => {
  // Move all route definitions here
};

// Only start server if this is main module
if (require.main === module) {
  const app = express();
  module.exports(app);

  const port = process.env.PORT || 3000;
  app.listen(port, '0.0.0.0', () => {
    console.log(`TaskMaster running on port ${port}`);
  });
}
