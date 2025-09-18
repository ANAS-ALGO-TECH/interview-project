import React, { createContext, useContext, useReducer, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

const AppContext = createContext();

// Socket instance
let socket = null;

const initialState = {
  tasks: [],
  users: [],
  loading: false,
  error: null,
  socketConnected: false,
  currentUser: {
    _id: '507f1f77bcf86cd799439011', // Default user for demo
    name: 'Demo User',
    email: 'demo@example.com',
    avatar: ''
  }
};

const appReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    case 'SET_TASKS':
      return { ...state, tasks: action.payload };
    
    case 'SET_USERS':
      return { ...state, users: action.payload };
    
    case 'ADD_TASK':
      return { ...state, tasks: [...state.tasks, action.payload] };
    
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task._id === action.payload._id ? action.payload : task
        )
      };
    
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(task => task._id !== action.payload.taskId)
      };
    
    case 'SET_SOCKET_CONNECTED':
      return { ...state, socketConnected: action.payload };
    
    default:
      return state;
  }
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Initialize socket connection
  useEffect(() => {
    socket = io('http://localhost:5000');
    
    socket.on('connect', () => {
      console.log('Connected to server');
      dispatch({ type: 'SET_SOCKET_CONNECTED', payload: true });
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
      dispatch({ type: 'SET_SOCKET_CONNECTED', payload: false });
    });

    // Listen for real-time updates
    socket.on('task-created', (task) => {
      dispatch({ type: 'ADD_TASK', payload: task });
    });

    socket.on('task-updated', (task) => {
      dispatch({ type: 'UPDATE_TASK', payload: task });
    });

    socket.on('task-deleted', (data) => {
      dispatch({ type: 'DELETE_TASK', payload: data });
    });

    socket.on('task-status-changed', (task) => {
      dispatch({ type: 'UPDATE_TASK', payload: task });
    });

    socket.on('task-assigned', (task) => {
      dispatch({ type: 'UPDATE_TASK', payload: task });
    });

    socket.on('task-board-updated', (task) => {
      dispatch({ type: 'UPDATE_TASK', payload: task });
    });

    socket.on('error', (error) => {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    });

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  // API functions
  const fetchTasks = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await axios.get('http://localhost:5000/api/tasks');
      dispatch({ type: 'SET_TASKS', payload: response.data });
    } catch (error) {
      console.error('Error fetching tasks:', error);
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message || 'Failed to fetch tasks' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/users');
      dispatch({ type: 'SET_USERS', payload: response.data });
    } catch (error) {
      console.error('Error fetching users:', error);
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message || 'Failed to fetch users' });
    }
  };

  const createTask = async (taskData) => {
    try {
      const response = await axios.post('http://localhost:5000/api/tasks', taskData);
      dispatch({ type: 'ADD_TASK', payload: response.data });
      return response.data;
    } catch (error) {
      console.error('Error creating task:', error);
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message || 'Failed to create task' });
      throw error;
    }
  };

  const updateTask = async (taskId, updates) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/tasks/${taskId}`, updates);
      dispatch({ type: 'UPDATE_TASK', payload: response.data });
      return response.data;
    } catch (error) {
      console.error('Error updating task:', error);
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message || 'Failed to update task' });
      throw error;
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${taskId}`);
      dispatch({ type: 'DELETE_TASK', payload: { taskId } });
    } catch (error) {
      console.error('Error deleting task:', error);
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message || 'Failed to delete task' });
      throw error;
    }
  };

  // Socket functions
  const emitTaskUpdate = (taskId, updates) => {
    if (socket) {
      socket.emit('task-updated', {
        taskId,
        updates,
        userId: state.currentUser._id
      });
    }
  };

  const emitTaskCreation = (taskData) => {
    if (socket) {
      socket.emit('task-created', {
        taskData,
        userId: state.currentUser._id
      });
    }
  };

  const emitTaskDeletion = (taskId) => {
    if (socket) {
      socket.emit('task-deleted', {
        taskId,
        userId: state.currentUser._id
      });
    }
  };

  const emitStatusChange = (taskId, newStatus, newPosition) => {
    if (socket) {
      socket.emit('task-status-changed', {
        taskId,
        newStatus,
        newPosition,
        userId: state.currentUser._id
      });
    }
  };

  const emitTaskAssignment = (taskId, assignedTo) => {
    if (socket) {
      socket.emit('task-assigned', {
        taskId,
        assignedTo,
        userId: state.currentUser._id
      });
    }
  };

  const joinTaskRoom = (taskId) => {
    if (socket) {
      socket.emit('join-task-room', taskId);
    }
  };

  const leaveTaskRoom = (taskId) => {
    if (socket) {
      socket.emit('leave-task-room', taskId);
    }
  };

  const value = {
    ...state,
    fetchTasks,
    fetchUsers,
    createTask,
    updateTask,
    deleteTask,
    emitTaskUpdate,
    emitTaskCreation,
    emitTaskDeletion,
    emitStatusChange,
    emitTaskAssignment,
    joinTaskRoom,
    leaveTaskRoom
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
