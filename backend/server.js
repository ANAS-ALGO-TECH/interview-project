const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const connectDB = require('./config/database');

// Load environment variables
require('dotenv').config();

// Import routes
const taskRoutes = require('./routes/tasks');
const userRoutes = require('./routes/users');
const mockRoutes = require('./routes/mockRoutes');

// Import socket handlers
const socketHandlers = require('./socket/socketHandlers');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Connect to MongoDB
let dbConnected = false;
connectDB().then(connected => {
  dbConnected = connected;
  if (!connected) {
    console.log('🔄 Using mock data for demo - all features will work!');
  }
}).catch(err => {
  console.log('⚠️ MongoDB connection failed, using mock data for demo');
  console.log('🔄 All features will work with mock data!');
});

// Create sample data if database is empty
const createSampleData = async () => {
  try {
    const mongoose = require('mongoose');
    
    // Only try to create sample data if MongoDB is connected
    if (mongoose.connection.readyState === 1) {
      const Task = require('./models/Task');
      const User = require('./models/User');
      
      const taskCount = await Task.countDocuments();
      const userCount = await User.countDocuments();
      
      if (taskCount === 0 && userCount === 0) {
        console.log('🌱 Creating sample data...');
        
        // Create sample users
        const users = await User.insertMany([
          {
            name: 'John Doe',
            email: 'john@example.com',
            password: 'password123',
            role: 'admin'
          },
          {
            name: 'Jane Smith',
            email: 'jane@example.com',
            password: 'password123',
            role: 'user'
          },
          {
            name: 'Mike Johnson',
            email: 'mike@example.com',
            password: 'password123',
            role: 'user'
          }
        ]);
        
        // Create sample tasks
        await Task.insertMany([
          {
            title: 'Design new landing page',
            description: 'Create a modern, responsive landing page for the product launch',
            status: 'todo',
            priority: 'high',
            assignedTo: users[1]._id,
            createdBy: users[0]._id,
            tags: ['design', 'frontend', 'urgent'],
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
          },
          {
            title: 'Implement user authentication',
            description: 'Add JWT-based authentication system with login and registration',
            status: 'in-progress',
            priority: 'high',
            assignedTo: users[2]._id,
            createdBy: users[0]._id,
            tags: ['backend', 'security', 'auth'],
            dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
          },
          {
            title: 'Write API documentation',
            description: 'Create comprehensive API documentation with examples',
            status: 'todo',
            priority: 'medium',
            assignedTo: users[1]._id,
            createdBy: users[0]._id,
            tags: ['documentation', 'api'],
            dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000)
          },
          {
            title: 'Setup CI/CD pipeline',
            description: 'Configure automated testing and deployment pipeline',
            status: 'done',
            priority: 'medium',
            assignedTo: users[2]._id,
            createdBy: users[0]._id,
            tags: ['devops', 'ci-cd'],
            dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
          }
        ]);
        
        console.log('✅ Sample data created successfully!');
      }
    } else {
      console.log('📊 Using mock data - sample data already available!');
    }
  } catch (error) {
    console.log('⚠️ Could not create sample data:', error.message);
    console.log('📊 Using mock data instead - all features will work!');
  }
};

// Create sample data after connection
setTimeout(createSampleData, 3000);

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Routes - always use mock routes for demo
console.log('🔄 Setting up mock routes for demo...');

// Mock API routes
app.get('/api/users', (req, res) => {
  const { mockUsers } = require('./data/mockData');
  res.json(mockUsers);
});

app.get('/api/users/:id', (req, res) => {
  const { mockUsers } = require('./data/mockData');
  const user = mockUsers.find(u => u._id === req.params.id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.json(user);
});

app.get('/api/tasks', (req, res) => {
  const { mockTasks, populateTask } = require('./data/mockData');
  const populatedTasks = mockTasks.map(populateTask);
  res.json(populatedTasks);
});

app.get('/api/tasks/status/:status', (req, res) => {
  const { mockTasks, populateTask } = require('./data/mockData');
  const tasks = mockTasks.filter(task => task.status === req.params.status);
  const populatedTasks = tasks.map(populateTask);
  res.json(populatedTasks);
});

app.get('/api/tasks/:id', (req, res) => {
  const { mockTasks, populateTask } = require('./data/mockData');
  const task = mockTasks.find(t => t._id === req.params.id);
  if (!task) {
    return res.status(404).json({ message: 'Task not found' });
  }
  res.json(populateTask(task));
});

app.post('/api/tasks', (req, res) => {
  const { mockTasks, generateId, populateTask } = require('./data/mockData');
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

app.put('/api/tasks/:id', (req, res) => {
  const { mockTasks, populateTask } = require('./data/mockData');
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

app.delete('/api/tasks/:id', (req, res) => {
  const { mockTasks } = require('./data/mockData');
  const taskIndex = mockTasks.findIndex(t => t._id === req.params.id);
  if (taskIndex === -1) {
    return res.status(404).json({ message: 'Task not found' });
  }

  mockTasks.splice(taskIndex, 1);
  res.json({ message: 'Task deleted successfully' });
});

app.get('/api/tasks/:id/activity', (req, res) => {
  const { mockActivityLogs, populateActivityLog } = require('./data/mockData');
  const activities = mockActivityLogs.filter(log => log.task === req.params.id);
  const populatedActivities = activities.map(populateActivityLog);
  res.json(populatedActivities);
});

app.get('/api/tasks/activity/all', (req, res) => {
  const { mockActivityLogs, populateActivityLog } = require('./data/mockData');
  const populatedActivities = mockActivityLogs.map(populateActivityLog);
  res.json(populatedActivities);
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running!' });
});

// Socket.io connection handling
socketHandlers(io);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
