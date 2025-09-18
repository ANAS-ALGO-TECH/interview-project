# 🚀 Quick Start Guide

## Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)

## 🎯 One-Command Setup

```bash
npm run setup
```

This will install all dependencies for root, backend, and frontend.

## 🏃‍♂️ Running the Application

```bash
npm start
```

This will start both frontend (port 3000) and backend (port 5000) simultaneously.

## 🌐 Access Points

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/api/health

## 📊 Sample Data

The application automatically creates sample data on first run:
- 3 sample users (John Doe, Jane Smith, Mike Johnson)
- 4 sample tasks with different statuses and priorities

## 🎨 Features to Demo

1. **Real-time Updates**: Open multiple browser tabs to see live updates
2. **Drag & Drop**: Move tasks between columns
3. **Task Management**: Create, edit, delete tasks
4. **User Assignment**: Assign tasks to team members
5. **Activity Logs**: View real-time activity feed
6. **Responsive Design**: Works on mobile and desktop

## 🔧 Troubleshooting

### MongoDB Issues
- **Local MongoDB**: Start with `brew services start mongodb-community` (macOS)
- **MongoDB Atlas**: Update connection string in `backend/config/database.js`

### Port Conflicts
- Frontend: Change port in `frontend/package.json`
- Backend: Change PORT in `backend/.env` or environment

### Dependencies
- Clear `node_modules` and run `npm run setup` again

## 📱 Demo Script for Video

1. **Introduction**: Show the beautiful gradient background and modern UI
2. **Task Board**: Demonstrate the three-column layout (Todo, In Progress, Done)
3. **Create Task**: Click "New Task" and fill out the form
4. **Drag & Drop**: Move tasks between columns
5. **Real-time**: Open another tab to show live updates
6. **Task Details**: Click on a task to show the detailed modal
7. **Activity Feed**: Show the real-time activity log
8. **Responsive**: Resize browser to show mobile view
