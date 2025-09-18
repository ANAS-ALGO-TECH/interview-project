import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Header from './components/Header';
import TaskBoard from './components/TaskBoard';
import ActivityLogs from './components/ActivityLogs';
import ErrorBoundary from './components/ErrorBoundary';
import FallbackApp from './components/FallbackApp';
import './App.css';

const AppContent = () => {
  const { loading, error, success, tasks, users } = useApp();
  const [showFallback, setShowFallback] = useState(false);

  // Show fallback if loading takes too long or if there are persistent errors
  useEffect(() => {
    const timer = setTimeout(() => {
      if (loading) {
        setShowFallback(true);
      }
    }, 10000); // 10 seconds timeout

    return () => clearTimeout(timer);
  }, [loading]);

  // Reset fallback when data loads successfully
  useEffect(() => {
    if (tasks.length > 0 && users.length > 0) {
      setShowFallback(false);
    }
  }, [tasks, users]);

  if (showFallback) {
    return <FallbackApp />;
  }

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
        <button 
          onClick={() => setShowFallback(true)}
          style={{
            marginTop: '20px',
            padding: '8px 16px',
            background: 'rgba(255, 255, 255, 0.2)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '6px',
            color: 'white',
            cursor: 'pointer'
          }}
        >
          Skip to Demo
        </button>
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
          {success && (
            <div className="success-banner">
              <p>✅ {success}</p>
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
