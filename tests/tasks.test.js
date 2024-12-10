// tests/tasks.test.js
const tasks = require('../src/tasks');

// Clear tasks before each test
beforeEach(() => {
  tasks.clearTasks();
});

describe('Task Management', () => {
  // Existing test
  test('should add a new task', () => {
    const task = { title: 'Test Task' };
    const newTask = tasks.addTask(task);
    
    expect(newTask.id).toBeDefined();
    expect(newTask.title).toBe(task.title);
    expect(newTask.completed).toBe(false);
    expect(newTask.createdAt).toBeDefined();
  });

  test('should fail when adding task without title', () => {
    expect(() => {
      tasks.addTask({});
    }).toThrow('Task title is required');
  });

  test('should get task by id', () => {
    const task = tasks.addTask({ title: 'Find Me' });
    const found = tasks.getTaskById(task.id);
    expect(found).toEqual(task);
  });

  test('should update task', () => {
    const task = tasks.addTask({ title: 'Original Title' });
    const updated = tasks.updateTask(task.id, { 
      title: 'Updated Title',
      completed: true 
    });

    expect(updated.title).toBe('Updated Title');
    expect(updated.completed).toBe(true);
    expect(updated.id).toBe(task.id);
    expect(updated.updatedAt).toBeDefined();
  });

  test('should not update task id or createdAt', () => {
    const task = tasks.addTask({ title: 'Original Task' });
    const originalId = task.id;
    const originalCreatedAt = task.createdAt;

    const updated = tasks.updateTask(task.id, {
      id: 999,
      createdAt: 'should not change',
      title: 'Updated Title'
    });

    expect(updated.id).toBe(originalId);
    expect(updated.createdAt).toBe(originalCreatedAt);
    expect(updated.title).toBe('Updated Title');
  });

  test('should delete task', () => {
    const task = tasks.addTask({ title: 'Delete Me' });
    tasks.deleteTask(task.id);
    expect(tasks.getAllTasks()).toHaveLength(0);
  });

  test('should throw error when updating non-existent task', () => {
    expect(() => {
      tasks.updateTask(999, { title: 'Not Found' });
    }).toThrow('Task not found');
  });

  test('should throw error when deleting non-existent task', () => {
    expect(() => {
      tasks.deleteTask(999);
    }).toThrow('Task not found');
  });
});
