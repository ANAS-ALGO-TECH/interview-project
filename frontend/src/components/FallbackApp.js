import React from 'react';

const FallbackApp = () => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      textAlign: 'center',
      padding: '20px'
    }}>
      <h1>🚀 Real-Time Collaboration Dashboard</h1>
      <p style={{ fontSize: '18px', marginBottom: '30px' }}>
        A beautiful task management board with real-time updates
      </p>
      
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '12px',
        padding: '30px',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        maxWidth: '600px'
      }}>
        <h2>✨ Features</h2>
        <ul style={{ textAlign: 'left', fontSize: '16px', lineHeight: '1.6' }}>
          <li>📋 Real-time task management</li>
          <li>🔄 Drag & drop functionality</li>
          <li>👥 User assignment system</li>
          <li>📊 Activity logging</li>
          <li>📱 Responsive design</li>
          <li>⚡ WebSocket integration</li>
        </ul>
        
        <div style={{ marginTop: '30px' }}>
          <h3>🎬 Perfect for Video Demo!</h3>
          <p>This dashboard showcases modern web development with:</p>
          <ul style={{ textAlign: 'left', fontSize: '14px' }}>
            <li>React.js frontend</li>
            <li>Node.js/Express backend</li>
            <li>Socket.io real-time communication</li>
            <li>MongoDB database</li>
            <li>Beautiful glass morphism UI</li>
          </ul>
        </div>
      </div>
      
      <button 
        onClick={() => window.location.reload()}
        style={{
          marginTop: '30px',
          padding: '12px 24px',
          background: 'rgba(255, 255, 255, 0.2)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          borderRadius: '8px',
          color: 'white',
          cursor: 'pointer',
          fontSize: '16px',
          fontWeight: '500'
        }}
      >
        🔄 Reload Application
      </button>
    </div>
  );
};

export default FallbackApp;
