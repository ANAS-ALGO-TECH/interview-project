const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const User = require('../models/User');
const ActivityLog = require('../models/ActivityLog');

// Get all tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate('assignedTo', 'name email avatar')
      .populate('createdBy', 'name email avatar')
      .sort({ position: 1, createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get tasks by status
router.get('/status/:status', async (req, res) => {
  try {
    const { status } = req.params;
    const tasks = await Task.find({ status })
      .populate('assignedTo', 'name email avatar')
      .populate('createdBy', 'name email avatar')
      .sort({ position: 1, createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks by status:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single task
router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignedTo', 'name email avatar')
      .populate('createdBy', 'name email avatar');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    console.error('Error fetching task:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new task
router.post('/', async (req, res) => {
  try {
    const { title, description, priority, assignedTo, dueDate, tags } = req.body;
    
    // For demo purposes, we'll use a default user ID
    // In a real app, this would come from authentication
    const createdBy = '507f1f77bcf86cd799439011'; // Default user ID

    const task = new Task({
      title,
      description,
      priority,
      assignedTo: assignedTo || null,
      dueDate: dueDate || null,
      tags: tags || [],
      createdBy
    });

    await task.save();
    
    // Populate the task with user details
    await task.populate('assignedTo', 'name email avatar');
    await task.populate('createdBy', 'name email avatar');

    // Log activity
    await ActivityLog.create({
      task: task._id,
      user: createdBy,
      action: 'created',
      description: `Task "${title}" was created`
    });

    res.status(201).json(task);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update task
router.put('/:id', async (req, res) => {
  try {
    const { title, description, status, priority, assignedTo, dueDate, tags, position } = req.body;
    
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const oldValues = {
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      assignedTo: task.assignedTo,
      dueDate: task.dueDate,
      tags: task.tags,
      position: task.position
    };

    // Update fields
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status;
    if (priority !== undefined) task.priority = priority;
    if (assignedTo !== undefined) task.assignedTo = assignedTo;
    if (dueDate !== undefined) task.dueDate = dueDate;
    if (tags !== undefined) task.tags = tags;
    if (position !== undefined) task.position = position;

    await task.save();
    
    // Populate the task with user details
    await task.populate('assignedTo', 'name email avatar');
    await task.populate('createdBy', 'name email avatar');

    // Log activity
    const changes = [];
    if (oldValues.title !== task.title) changes.push(`title changed from "${oldValues.title}" to "${task.title}"`);
    if (oldValues.status !== task.status) changes.push(`status changed from "${oldValues.status}" to "${task.status}"`);
    if (oldValues.priority !== task.priority) changes.push(`priority changed from "${oldValues.priority}" to "${task.priority}"`);
    if (oldValues.assignedTo?.toString() !== task.assignedTo?.toString()) {
      changes.push(`assignment changed`);
    }

    if (changes.length > 0) {
      await ActivityLog.create({
        task: task._id,
        user: task.createdBy,
        action: 'updated',
        description: `Task "${task.title}" was updated: ${changes.join(', ')}`,
        oldValue: oldValues,
        newValue: {
          title: task.title,
          description: task.description,
          status: task.status,
          priority: task.priority,
          assignedTo: task.assignedTo,
          dueDate: task.dueDate,
          tags: task.tags,
          position: task.position
        }
      });
    }

    res.json(task);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete task
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Log activity before deletion
    await ActivityLog.create({
      task: task._id,
      user: task.createdBy,
      action: 'deleted',
      description: `Task "${task.title}" was deleted`
    });

    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get activity logs for a task
router.get('/:id/activity', async (req, res) => {
  try {
    const activities = await ActivityLog.find({ task: req.params.id })
      .populate('user', 'name email avatar')
      .sort({ createdAt: -1 });

    res.json(activities);
  } catch (error) {
    console.error('Error fetching activity logs:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all activity logs
router.get('/activity/all', async (req, res) => {
  try {
    const activities = await ActivityLog.find()
      .populate('user', 'name email avatar')
      .populate('task', 'title')
      .sort({ createdAt: -1 })
      .limit(50); // Limit to last 50 activities

    res.json(activities);
  } catch (error) {
    console.error('Error fetching all activity logs:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
