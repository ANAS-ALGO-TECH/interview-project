# 🚀 Real-Time Collaboration Dashboard

A beautiful, modern task management board with real-time updates, built with React.js, Node.js, Express, and Socket.io.

## ✨ Features

- **Real-time Task Management** - Create, update, delete tasks with live updates
- **Drag & Drop Interface** - Move tasks between Todo → In Progress → Done
- **User Assignment** - Assign tasks to team members
- **Activity Logging** - Track all changes with detailed activity logs
- **Beautiful UI** - Modern glass morphism design with gradients
- **Responsive Design** - Works perfectly on desktop and mobile
- **WebSocket Integration** - Real-time updates across multiple clients

## 🎯 Quick Start (For Video Recording)

### Option 1: Simple Start
```bash
# Install dependencies
npm run setup

# Start both servers
npm start
```

### Option 2: Manual Start
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend  
cd frontend
npm start
```

### Option 3: Demo Mode (No MongoDB Required)
```bash
# Start with mock data
node start-demo.js
```

## 🌐 Access Points

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/api/health

## 📊 Sample Data

The application includes pre-loaded sample data:
- **3 Users**: John Doe (Admin), Jane Smith, Mike Johnson
- **4 Tasks**: Various statuses and priorities
- **Activity Logs**: Sample activity history

## 🎬 Perfect for Video Demo

### Demo Script:
1. **Show Beautiful UI** - Gradient background, glass morphism effects
2. **Task Board** - Three columns (Todo, In Progress, Done)
3. **Create Task** - Click "New Task" button
4. **Drag & Drop** - Move tasks between columns
5. **Real-time Updates** - Open multiple browser tabs
6. **Task Details** - Click on any task card
7. **Activity Feed** - Show real-time activity logs
8. **Responsive Design** - Resize browser window

## 🛠️ Tech Stack

- **Frontend**: React.js, CSS3, Socket.io Client
- **Backend**: Node.js, Express.js, Socket.io
- **Database**: MongoDB (with mock data fallback)
- **Real-time**: WebSocket communication

## 🔧 Troubleshooting

### If MongoDB is not installed:
The app automatically uses mock data - no MongoDB required for demo!

### If ports are busy:
- Frontend: Change port in `frontend/package.json`
- Backend: Change PORT in environment variables

### If dependencies fail:
```bash
# Clear and reinstall
rm -rf node_modules backend/node_modules frontend/node_modules
npm run setup
```

## 🎥 Video Recording Tips

- Use a clean browser window
- Show the connection status indicator
- Demonstrate both desktop and mobile views
- Highlight real-time features
- Show smooth animations and transitions

---

**Ready for your video recording! 🎬✨**

The application is fully functional with beautiful UI and all features working perfectly for demonstration purposes.
