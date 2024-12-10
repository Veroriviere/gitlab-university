// tests/api.test.js
const request = require('supertest');
const express = require('express');
const cors = require('cors');
const tasks = require('../src/tasks');

// Create test app
const app = express();
app.use(cors());
app.use(express.json());

// Import routes (we'll need to modify index.js to export the routes)
require('../src/index')(app);

describe('TaskMaster API', () => {
  beforeEach(() => {
    tasks.clearTasks();
  });

  test('GET / should return welcome message', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.text).toContain('Welcome to TaskMaster API');
  });

  test('POST /tasks should create new task', async () => {
    const res = await request(app)
      .post('/tasks')
      .send({ title: 'New Task' });

    expect(res.status).toBe(201);
    expect(res.body.title).toBe('New Task');
    expect(res.body.id).toBeDefined();
  });

  test('GET /tasks should return all tasks', async () => {
    await request(app)
      .post('/tasks')
      .send({ title: 'Task 1' });
    await request(app)
      .post('/tasks')
      .send({ title: 'Task 2' });

    const res = await request(app).get('/tasks');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
  });

  test('PUT /tasks/:id should update task', async () => {
    const task = await request(app)
      .post('/tasks')
      .send({ title: 'Original Task' });

    const res = await request(app)
      .put(`/tasks/${task.body.id}`)
      .send({ title: 'Updated Task', completed: true });

    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Updated Task');
    expect(res.body.completed).toBe(true);
  });

  test('DELETE /tasks/:id should remove task', async () => {
    const task = await request(app)
      .post('/tasks')
      .send({ title: 'Delete Me' });

    const res = await request(app)
      .delete(`/tasks/${task.body.id}`);

    expect(res.status).toBe(204);

    const checkDelete = await request(app)
      .get(`/tasks/${task.body.id}`);
    expect(checkDelete.status).toBe(404);
  });
});
