import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Header from './components/Header';
import TaskBoard from './components/TaskBoard';
import ActivityLogs from './components/ActivityLogs';
import ErrorBoundary from './components/ErrorBoundary';
import './App.css';

const AppContent = () => {
  const { fetchTasks, fetchUsers, loading, error } = useApp();

  useEffect(() => {
    fetchTasks();
    fetchUsers();
  }, [fetchTasks, fetchUsers]);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white'
      }}>
        <div className="spinner" style={{ width: '40px', height: '40px', borderWidth: '4px' }}></div>
        <span style={{ marginTop: '20px', fontSize: '18px' }}>Loading your dashboard...</span>
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
    <ErrorBoundary>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </ErrorBoundary>
  );
}

export default App;
