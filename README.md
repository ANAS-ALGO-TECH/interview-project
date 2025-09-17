# Real-Time Collaboration Dashboard

A modern, real-time task management board built with React.js, Node.js, Express, MongoDB, and Socket.io. This project demonstrates full-stack CRUD operations, WebSocket real-time communication, and scalable database design.

## 🚀 Features

- **Real-time Task Management**: Create, read, update, and delete tasks with live updates
- **Drag & Drop Interface**: Move tasks between status columns (Todo → In Progress → Done)
- **User Assignment**: Assign tasks to team members with user management
- **Activity Logging**: Track all task changes with detailed activity logs
- **WebSocket Integration**: Real-time updates across multiple clients
- **Responsive Design**: Modern, professional UI that works on all devices
- **Priority System**: Set task priorities (Low, Medium, High)
- **Due Dates**: Set and track task deadlines
- **Tags**: Organize tasks with custom tags
- **MongoDB Persistence**: All data is stored and retrieved from MongoDB

## 🛠️ Tech Stack

### Frontend
- **React.js** - UI framework
- **Socket.io Client** - Real-time communication
- **React Beautiful DnD** - Drag and drop functionality
- **Axios** - HTTP client
- **CSS3** - Styling with modern design patterns

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Socket.io** - WebSocket server
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication

## 📁 Project Structure

```
realtime-collaboration-dashboard/
├── backend/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── models/
│   │   ├── User.js              # User model
│   │   ├── Task.js              # Task model
│   │   └── ActivityLog.js       # Activity log model
│   ├── routes/
│   │   ├── tasks.js             # Task API routes
│   │   └── users.js             # User API routes
│   ├── socket/
│   │   └── socketHandlers.js    # Socket.io event handlers
│   ├── package.json
│   └── server.js                # Main server file
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.js         # App header
│   │   │   ├── TaskBoard.js      # Main task board
│   │   │   ├── TaskCard.js       # Individual task card
│   │   │   ├── TaskModal.js      # Task details modal
│   │   │   ├── CreateTaskModal.js # Create task modal
│   │   │   └── ActivityLogs.js   # Activity feed
│   │   ├── context/
│   │   │   └── AppContext.js     # React context for state management
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
├── package.json                  # Root package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd realtime-collaboration-dashboard
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install backend dependencies
   cd backend
   npm install
   
   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Set up MongoDB**
   
   **Option A: Local MongoDB**
   - Install MongoDB locally
   - Start MongoDB service
   - The app will connect to `mongodb://localhost:27017/collaboration_dashboard`

   **Option B: MongoDB Atlas**
   - Create a MongoDB Atlas account
   - Create a new cluster
   - Get your connection string
   - Update the connection string in `backend/config/database.js`

4. **Environment Variables**
   
   Create a `.env` file in the backend directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/collaboration_dashboard
   JWT_SECRET=your_jwt_secret_key_here
   NODE_ENV=development
   ```

### Running the Application

1. **Start the backend server**
   ```bash
   cd backend
   npm run dev
   ```
   The server will start on `http://localhost:5000`

2. **Start the frontend development server**
   ```bash
   cd frontend
   npm start
   ```
   The React app will start on `http://localhost:3000`

3. **Or run both simultaneously**
   ```bash
   # From the root directory
   npm run dev
   ```

## 📖 Usage

### Creating Tasks
1. Click the "New Task" button or "+ Add Task" in the Todo column
2. Fill in the task details (title, description, priority, assignee, due date, tags)
3. Click "Create Task" to save

### Managing Tasks
- **Drag & Drop**: Move tasks between columns to change status
- **Click Task**: Open detailed view to edit task properties
- **Assign Users**: Assign tasks to team members
- **Set Priorities**: Mark tasks as Low, Medium, or High priority
- **Add Tags**: Organize tasks with custom tags

### Real-time Features
- **Live Updates**: Changes appear instantly across all connected clients
- **Activity Feed**: See all task activities in real-time
- **Connection Status**: Monitor WebSocket connection status in the header

### Activity Logging
- All task changes are automatically logged
- View activity logs in the right sidebar
- Filter activities by specific tasks
- See who made changes and when

## 🔧 API Endpoints

### Tasks
- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/:id` - Get single task
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `GET /api/tasks/:id/activity` - Get task activity logs
- `GET /api/tasks/activity/all` - Get all activity logs

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get single user
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

## 🔌 WebSocket Events

### Client to Server
- `task-created` - Create new task
- `task-updated` - Update existing task
- `task-deleted` - Delete task
- `task-status-changed` - Change task status/position
- `task-assigned` - Assign/unassign task
- `join-task-room` - Join task-specific room
- `leave-task-room` - Leave task-specific room

### Server to Client
- `task-created` - New task created
- `task-updated` - Task updated
- `task-deleted` - Task deleted
- `task-status-changed` - Task status changed
- `task-assigned` - Task assignment changed
- `task-board-updated` - General board update
- `error` - Error occurred

## 🗄️ Database Schema

### User Model
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required),
  avatar: String,
  role: String (enum: ['admin', 'user']),
  createdAt: Date,
  updatedAt: Date
}
```

### Task Model
```javascript
{
  title: String (required),
  description: String,
  status: String (enum: ['todo', 'in-progress', 'done']),
  priority: String (enum: ['low', 'medium', 'high']),
  assignedTo: ObjectId (ref: 'User'),
  createdBy: ObjectId (ref: 'User', required),
  dueDate: Date,
  tags: [String],
  position: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### ActivityLog Model
```javascript
{
  task: ObjectId (ref: 'Task', required),
  user: ObjectId (ref: 'User', required),
  action: String (enum: ['created', 'updated', 'deleted', ...]),
  description: String (required),
  oldValue: Mixed,
  newValue: Mixed,
  metadata: Mixed,
  createdAt: Date,
  updatedAt: Date
}
```

## 🎨 UI Components

### TaskBoard
- Three-column layout (Todo, In Progress, Done)
- Drag and drop functionality
- Task count indicators
- Add task buttons

### TaskCard
- Compact task display
- Priority indicators
- User avatars
- Due date warnings
- Tag display

### TaskModal
- Detailed task view
- Full editing capabilities
- Activity log integration
- Quick assignment options

### ActivityLogs
- Real-time activity feed
- Task filtering
- User attribution
- Time formatting

## 🔒 Security Features

- Password hashing with bcryptjs
- JWT token authentication (ready for implementation)
- Input validation and sanitization
- CORS configuration
- Environment variable protection

## 🚀 Deployment

### Backend Deployment
1. Set up MongoDB Atlas or cloud MongoDB instance
2. Configure environment variables
3. Deploy to platforms like Heroku, Railway, or AWS
4. Update CORS settings for production domain

### Frontend Deployment
1. Build the React app: `npm run build`
2. Deploy to platforms like Netlify, Vercel, or AWS S3
3. Update API endpoints for production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in environment variables
   - Verify network connectivity

2. **WebSocket Connection Issues**
   - Check if backend server is running on port 5000
   - Verify CORS settings
   - Check browser console for errors

3. **Frontend Build Errors**
   - Clear node_modules and reinstall dependencies
   - Check Node.js version compatibility
   - Verify all required packages are installed

### Performance Optimization

- Implement task pagination for large datasets
- Add database indexing for better query performance
- Implement Redis for session management
- Add task caching strategies

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the troubleshooting section
- Review the API documentation

---

**Built with ❤️ using React, Node.js, and MongoDB**
