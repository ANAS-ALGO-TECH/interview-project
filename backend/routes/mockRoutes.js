const express = require('express');
const router = express.Router();
const { 
  mockUsers, 
  mockTasks, 
  mockActivityLogs, 
  generateId, 
  populateTask, 
  populateActivityLog 
} = require('../data/mockData');

// Mock Users Routes
router.get('/users', (req, res) => {
  res.json(mockUsers);
});

router.get('/users/:id', (req, res) => {
  const user = mockUsers.find(u => u._id === req.params.id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.json(user);
});

// Mock Tasks Routes
router.get('/tasks', (req, res) => {
  const populatedTasks = mockTasks.map(populateTask);
  res.json(populatedTasks);
});

router.get('/tasks/status/:status', (req, res) => {
  const tasks = mockTasks.filter(task => task.status === req.params.status);
  const populatedTasks = tasks.map(populateTask);
  res.json(populatedTasks);
});

router.get('/tasks/:id', (req, res) => {
  const task = mockTasks.find(t => t._id === req.params.id);
  if (!task) {
    return res.status(404).json({ message: 'Task not found' });
  }
  res.json(populateTask(task));
});

router.post('/tasks', (req, res) => {
  const { title, description, priority, assignedTo, dueDate, tags } = req.body;
  
  const newTask = {
    _id: generateId(),
    title,
    description: description || '',
    status: 'todo',
    priority: priority || 'medium',
    assignedTo: assignedTo || null,
    createdBy: '507f1f77bcf86cd799439011', // Default user
    dueDate: dueDate || null,
    tags: tags || [],
    position: mockTasks.length,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  mockTasks.push(newTask);
  res.status(201).json(populateTask(newTask));
});

router.put('/tasks/:id', (req, res) => {
  const taskIndex = mockTasks.findIndex(t => t._id === req.params.id);
  if (taskIndex === -1) {
    return res.status(404).json({ message: 'Task not found' });
  }

  const task = mockTasks[taskIndex];
  const updates = req.body;

  // Update task properties
  Object.keys(updates).forEach(key => {
    if (updates[key] !== undefined) {
      task[key] = updates[key];
    }
  });

  task.updatedAt = new Date();
  mockTasks[taskIndex] = task;

  res.json(populateTask(task));
});

router.delete('/tasks/:id', (req, res) => {
  const taskIndex = mockTasks.findIndex(t => t._id === req.params.id);
  if (taskIndex === -1) {
    return res.status(404).json({ message: 'Task not found' });
  }

  mockTasks.splice(taskIndex, 1);
  res.json({ message: 'Task deleted successfully' });
});

router.get('/tasks/:id/activity', (req, res) => {
  const activities = mockActivityLogs.filter(log => log.task === req.params.id);
  const populatedActivities = activities.map(populateActivityLog);
  res.json(populatedActivities);
});

router.get('/tasks/activity/all', (req, res) => {
  const populatedActivities = mockActivityLogs.map(populateActivityLog);
  res.json(populatedActivities);
});

module.exports = router;
