const mongoose = require('mongoose');
const User = require('./models/User');
const Task = require('./models/Task');
const ActivityLog = require('./models/ActivityLog');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/collaboration_dashboard', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const sampleUsers = [
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
  },
  {
    name: 'Sarah Wilson',
    email: 'sarah@example.com',
    password: 'password123',
    role: 'user'
  }
];

const sampleTasks = [
  {
    title: 'Design new landing page',
    description: 'Create a modern, responsive landing page for the product launch',
    status: 'todo',
    priority: 'high',
    tags: ['design', 'frontend', 'urgent'],
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
  },
  {
    title: 'Implement user authentication',
    description: 'Add JWT-based authentication system with login and registration',
    status: 'in-progress',
    priority: 'high',
    tags: ['backend', 'security', 'auth'],
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) // 5 days from now
  },
  {
    title: 'Write API documentation',
    description: 'Create comprehensive API documentation with examples',
    status: 'todo',
    priority: 'medium',
    tags: ['documentation', 'api'],
    dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000) // 10 days from now
  },
  {
    title: 'Setup CI/CD pipeline',
    description: 'Configure automated testing and deployment pipeline',
    status: 'done',
    priority: 'medium',
    tags: ['devops', 'ci-cd'],
    dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
  },
  {
    title: 'Database optimization',
    description: 'Optimize database queries and add proper indexing',
    status: 'in-progress',
    priority: 'low',
    tags: ['database', 'optimization'],
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 14 days from now
  },
  {
    title: 'Mobile app development',
    description: 'Develop React Native mobile application',
    status: 'todo',
    priority: 'high',
    tags: ['mobile', 'react-native'],
    dueDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000) // 21 days from now
  }
];

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Task.deleteMany({});
    await ActivityLog.deleteMany({});

    console.log('🗑️ Cleared existing data');

    // Create users
    const createdUsers = await User.insertMany(sampleUsers);
    console.log(`👥 Created ${createdUsers.length} users`);

    // Create tasks with assignments
    const tasksWithAssignments = sampleTasks.map((task, index) => ({
      ...task,
      createdBy: createdUsers[0]._id, // John Doe creates all tasks
      assignedTo: index % 2 === 0 ? createdUsers[1]._id : createdUsers[2]._id, // Alternate assignments
      position: index
    }));

    const createdTasks = await Task.insertMany(tasksWithAssignments);
    console.log(`📋 Created ${createdTasks.length} tasks`);

    // Create activity logs
    const activityLogs = [];
    
    // Log task creation
    createdTasks.forEach(task => {
      activityLogs.push({
        task: task._id,
        user: task.createdBy,
        action: 'created',
        description: `Task "${task.title}" was created`
      });
    });

    // Log some status changes
    const inProgressTask = createdTasks.find(task => task.status === 'in-progress');
    if (inProgressTask) {
      activityLogs.push({
        task: inProgressTask._id,
        user: inProgressTask.assignedTo,
        action: 'status_changed',
        description: `Task "${inProgressTask.title}" status changed to "in-progress"`,
        oldValue: { status: 'todo' },
        newValue: { status: 'in-progress' }
      });
    }

    // Log completion
    const doneTask = createdTasks.find(task => task.status === 'done');
    if (doneTask) {
      activityLogs.push({
        task: doneTask._id,
        user: doneTask.assignedTo,
        action: 'status_changed',
        description: `Task "${doneTask.title}" was completed`,
        oldValue: { status: 'in-progress' },
        newValue: { status: 'done' }
      });
    }

    await ActivityLog.insertMany(activityLogs);
    console.log(`📝 Created ${activityLogs.length} activity logs`);

    console.log('✅ Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`- Users: ${createdUsers.length}`);
    console.log(`- Tasks: ${createdTasks.length}`);
    console.log(`- Activity Logs: ${activityLogs.length}`);
    console.log('\n🔑 Login credentials:');
    console.log('Email: john@example.com, Password: password123');
    console.log('Email: jane@example.com, Password: password123');
    console.log('Email: mike@example.com, Password: password123');
    console.log('Email: sarah@example.com, Password: password123');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    mongoose.connection.close();
  }
}

// Run the seeder
seedDatabase();
