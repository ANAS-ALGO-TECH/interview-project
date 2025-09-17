import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import TaskModal from './TaskModal';
import './TaskCard.css';

const TaskCard = ({ task }) => {
  const { users, emitTaskAssignment } = useApp();
  const [showModal, setShowModal] = useState(false);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getAssignedUser = () => {
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

  return (
    <>
      <div className="task-card" onClick={() => setShowModal(true)}>
        <div className="task-header">
          <h4 className="task-title">{task.title}</h4>
          <div 
            className="priority-indicator"
            style={{ backgroundColor: getPriorityColor(task.priority) }}
          />
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

      {showModal && (
        <TaskModal 
          task={task} 
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
};

export default TaskCard;
