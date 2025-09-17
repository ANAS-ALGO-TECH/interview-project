import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Header from './components/Header';
import TaskBoard from './components/TaskBoard';
import ActivityLogs from './components/ActivityLogs';
import './App.css';

const AppContent = () => {
  const { fetchTasks, fetchUsers, loading, error } = useApp();

  useEffect(() => {
    fetchTasks();
    fetchUsers();
  }, [fetchTasks, fetchUsers]);

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <span style={{ marginLeft: '10px' }}>Loading...</span>
      </div>
    );
  }

  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <div className="container">
          {error && (
            <div className="error-banner">
              <p>Error: {error}</p>
            </div>
          )}
          <div className="dashboard-grid">
            <div className="task-board-section">
              <TaskBoard />
            </div>
            <div className="activity-section">
              <ActivityLogs />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
