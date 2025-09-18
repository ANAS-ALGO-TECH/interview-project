import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useApp } from '../context/AppContext';
import TaskModal from './TaskModal';
import './TaskCard.css';

const TaskCard = ({ task }) => {
  const { users, emitTaskAssignment, updateTask } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getAssignedUser = () => {
    if (!task.assignedTo) return null;
    if (typeof task.assignedTo === 'object') {
      return task.assignedTo; // Already a user object
    }
    return users.find(user => user._id === task.assignedTo);
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const isOverdue = () => {
    if (!task.dueDate) return false;
    return new Date(task.dueDate) < new Date() && task.status !== 'done';
  };

  const assignedUser = getAssignedUser();

  const handleCardClick = (e) => {
    if (!isDragging) {
      setShowModal(true);
    }
  };

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setTimeout(() => setIsDragging(false), 100);
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await updateTask(task._id, { status: newStatus });
      setShowMenu(false);
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const handleMenuClick = (e) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  const handleMenuClose = () => {
    setShowMenu(false);
  };

  return (
    <>
      <div 
        className="task-card" 
        onClick={handleCardClick}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="task-header">
          <div className="drag-handle">⋮⋮</div>
          <h4 className="task-title">{task.title}</h4>
          <div className="task-header-actions">
            <div 
              className="priority-indicator"
              style={{ backgroundColor: getPriorityColor(task.priority) }}
            />
            <button 
              className="three-dot-menu"
              onClick={handleMenuClick}
              title="Quick Actions"
            >
              ⋯
            </button>
          </div>
        </div>
        
        {task.description && (
          <p className="task-description">{task.description}</p>
        )}
        
        {task.tags && task.tags.length > 0 && (
          <div className="task-tags">
            {task.tags.map((tag, index) => (
              <span key={index} className="task-tag">
                {tag}
              </span>
            ))}
          </div>
        )}
        
        <div className="task-footer">
          <div className="task-meta">
            {assignedUser && (
              <div className="assigned-user">
                <div className="avatar avatar-sm">
                  {assignedUser.name.charAt(0).toUpperCase()}
                </div>
                <span className="user-name">{assignedUser.name}</span>
              </div>
            )}
            
            {task.dueDate && (
              <div className={`due-date ${isOverdue() ? 'overdue' : ''}`}>
                📅 {formatDate(task.dueDate)}
              </div>
            )}
          </div>
          
          <div className="task-badges">
            <span className={`badge badge-${task.priority}`}>
              {task.priority}
            </span>
          </div>
        </div>
      </div>

      {showMenu && createPortal(
        <div className="status-menu-overlay" onClick={handleMenuClose}>
          <div className="status-menu" onClick={(e) => e.stopPropagation()}>
            <div className="status-menu-header">
              <span>Change Status</span>
              <button className="menu-close" onClick={handleMenuClose}>×</button>
            </div>
            <div className="status-options">
              <button 
                className={`status-option ${task.status === 'todo' ? 'active' : ''}`}
                onClick={() => handleStatusChange('todo')}
              >
                📋 To Do
              </button>
              <button 
                className={`status-option ${task.status === 'in-progress' ? 'active' : ''}`}
                onClick={() => handleStatusChange('in-progress')}
              >
                🔄 In Progress
              </button>
              <button 
                className={`status-option ${task.status === 'done' ? 'active' : ''}`}
                onClick={() => handleStatusChange('done')}
              >
                ✅ Done
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {showModal && createPortal(
        <TaskModal 
          task={task} 
          onClose={() => setShowModal(false)}
        />,
        document.body
      )}
    </>
  );
};

export default TaskCard;
