const Task = require('../models/Task');
const User = require('../models/User');
const ActivityLog = require('../models/ActivityLog');
const { mockTasks, mockActivityLogs, generateId, populateTask } = require('../data/mockData');

const socketHandlers = (io) => {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Join a room for task updates
    socket.on('join-task-room', (taskId) => {
      socket.join(`task-${taskId}`);
      console.log(`User ${socket.id} joined task room: ${taskId}`);
    });

    // Leave a room
    socket.on('leave-task-room', (taskId) => {
      socket.leave(`task-${taskId}`);
      console.log(`User ${socket.id} left task room: ${taskId}`);
    });

    // Handle task updates
    socket.on('task-updated', async (data) => {
      try {
        const { taskId, updates, userId } = data;
        
        // Update the task in database
        const task = await Task.findByIdAndUpdate(
          taskId,
          updates,
          { new: true }
        ).populate('assignedTo', 'name email avatar')
         .populate('createdBy', 'name email avatar');

        if (!task) {
          // socket.emit('error', { message: 'Task not found' });
          return;
        }

        // Log the activity
        await ActivityLog.create({
          task: taskId,
          user: userId,
          action: 'updated',
          description: `Task "${task.title}" was updated`,
          newValue: updates
        });

        // Broadcast the update to all clients in the task room
        io.to(`task-${taskId}`).emit('task-updated', task);
        
        // Also broadcast to the main dashboard room
        io.emit('task-board-updated', task);
      } catch (error) {
        console.error('Error updating task via socket:', error);
        socket.emit('error', { message: 'Failed to update task' });
      }
    });

    // Handle task creation
    socket.on('task-created', async (data) => {
      try {
        const { taskData, userId } = data;
        
        const task = new Task({
          ...taskData,
          createdBy: userId
        });

        await task.save();
        await task.populate('assignedTo', 'name email avatar');
        await task.populate('createdBy', 'name email avatar');

        // Log the activity
        await ActivityLog.create({
          task: task._id,
          user: userId,
          action: 'created',
          description: `Task "${task.title}" was created`
        });

        // Broadcast the new task to all clients
        io.emit('task-created', task);
      } catch (error) {
        console.error('Error creating task via socket:', error);
        // socket.emit('error', { message: 'Failed to create task' });
      }
    });

    // Handle task deletion
    socket.on('task-deleted', async (data) => {
      try {
        const { taskId, userId } = data;
        
        const task = await Task.findById(taskId);
        if (!task) {
          // socket.emit('error', { message: 'Task not found' });
          return;
        }

        // Log the activity before deletion
        await ActivityLog.create({
          task: taskId,
          user: userId,
          action: 'deleted',
          description: `Task "${task.title}" was deleted`
        });

        await Task.findByIdAndDelete(taskId);

        // Broadcast the deletion to all clients
        io.emit('task-deleted', { taskId });
      } catch (error) {
        console.error('Error deleting task via socket:', error);
        socket.emit('error', { message: 'Failed to delete task' });
      }
    });

    // Handle task status changes (drag and drop)
    socket.on('task-status-changed', async (data) => {
      try {
        const { taskId, newStatus, newPosition, userId } = data;
        
        const task = await Task.findByIdAndUpdate(
          taskId,
          { status: newStatus, position: newPosition },
          { new: true }
        ).populate('assignedTo', 'name email avatar')
         .populate('createdBy', 'name email avatar');

        if (!task) {
          // socket.emit('error', { message: 'Task not found' });
          return;
        }

        // Log the activity
        await ActivityLog.create({
          task: taskId,
          user: userId,
          action: 'status_changed',
          description: `Task "${task.title}" status changed to "${newStatus}"`,
          oldValue: { status: task.status },
          newValue: { status: newStatus, position: newPosition }
        });

        // Broadcast the status change to all clients
        io.emit('task-status-changed', task);
      } catch (error) {
        console.error('Error changing task status via socket:', error);
        socket.emit('error', { message: 'Failed to change task status' });
      }
    });

    // Handle user assignment changes
    socket.on('task-assigned', async (data) => {
      try {
        const { taskId, assignedTo, userId } = data;
        
        const task = await Task.findByIdAndUpdate(
          taskId,
          { assignedTo },
          { new: true }
        ).populate('assignedTo', 'name email avatar')
         .populate('createdBy', 'name email avatar');

        if (!task) {
          // socket.emit('error', { message: 'Task not found' });
          return;
        }

        const assignedUser = assignedTo ? await User.findById(assignedTo) : null;
        const action = assignedTo ? 'assigned' : 'unassigned';
        const description = assignedTo 
          ? `Task "${task.title}" was assigned to ${assignedUser?.name || 'Unknown User'}`
          : `Task "${task.title}" was unassigned`;

        // Log the activity
        await ActivityLog.create({
          task: taskId,
          user: userId,
          action,
          description,
          newValue: { assignedTo }
        });

        // Broadcast the assignment change to all clients
        io.emit('task-assigned', task);
      } catch (error) {
        console.error('Error assigning task via socket:', error);
        socket.emit('error', { message: 'Failed to assign task' });
      }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
};

module.exports = socketHandlers;
