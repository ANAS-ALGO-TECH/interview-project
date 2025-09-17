import React from 'react';
import { useApp } from '../context/AppContext';
import './Header.css';

const Header = () => {
  const { currentUser, socketConnected } = useApp();

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="header-left">
            <h1 className="header-title">
              <span className="header-icon">📋</span>
              Collaboration Dashboard
            </h1>
          </div>
          
          <div className="header-right">
            <div className="connection-status">
              <div className={`status-indicator ${socketConnected ? 'connected' : 'disconnected'}`}>
                <div className="status-dot"></div>
                <span className="status-text">
                  {socketConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
            </div>
            
            <div className="user-info">
              <div className="avatar avatar-sm">
                {currentUser.name.charAt(0).toUpperCase()}
              </div>
              <span className="user-name">{currentUser.name}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
