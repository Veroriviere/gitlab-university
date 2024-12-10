// src/tasks.js
let tasks = [];

module.exports = {
  getAllTasks() {
    return tasks;
  },
  
  getTaskById(id) {
    return tasks.find(task => task.id === id);
  },
  
  addTask(task) {
    // Validate required fields
    if (!task.title) {
      throw new Error('Task title is required');
    }
    
    // Generate ID if not provided
    const newTask = {
      id: task.id || Date.now(),
      title: task.title,
      completed: false,
      createdAt: new Date().toISOString()
    };
    
    tasks.push(newTask);
    return newTask;
  },
  
  updateTask(id, updates) {
    const taskIndex = tasks.findIndex(task => task.id === id);
    if (taskIndex === -1) {
      throw new Error('Task not found');
    }
    
    // Prevent updating id and createdAt
    const { id: _, createdAt: __, ...validUpdates } = updates;
    
    tasks[taskIndex] = {
      ...tasks[taskIndex],
      ...validUpdates,
      updatedAt: new Date().toISOString()
    };
    
    return tasks[taskIndex];
  },
  
  deleteTask(id) {
    const taskIndex = tasks.findIndex(task => task.id === id);
    if (taskIndex === -1) {
      throw new Error('Task not found');
    }
    
    tasks.splice(taskIndex, 1);
    return true;
  },

  // For testing purposes
  clearTasks() {
    tasks = [];
  }
};
