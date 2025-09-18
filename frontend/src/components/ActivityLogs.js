import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useApp } from '../context/AppContext';
import './ActivityLogs.css';

const ActivityLogs = () => {
  const { tasks } = useApp();
  const [activityLogs, setActivityLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTask, setSelectedTask] = useState('all');

  useEffect(() => {
    fetchActivityLogs();
  }, [selectedTask]);

  const fetchActivityLogs = async () => {
    setLoading(true);
    try {
      let url = 'http://localhost:5000/api/tasks/activity/all';
      if (selectedTask !== 'all') {
        url = `http://localhost:5000/api/tasks/${selectedTask}/activity`;
      }
      
      const response = await axios.get(url);
      setActivityLogs(response.data);
    } catch (error) {
      console.error('Error fetching activity logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now - date) / (1000 * 60));
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  const getActionIcon = (action) => {
    switch (action) {
      case 'created': return '➕';
      case 'updated': return '✏️';
      case 'deleted': return '🗑️';
      case 'status_changed': return '🔄';
      case 'assigned': return '👤';
      case 'unassigned': return '👤❌';
      case 'priority_changed': return '⚡';
      case 'due_date_changed': return '📅';
      default: return '📝';
    }
  };

  const getActionColor = (action) => {
    switch (action) {
      case 'created': return '#10b981';
      case 'updated': return '#3b82f6';
      case 'deleted': return '#ef4444';
      case 'status_changed': return '#f59e0b';
      case 'assigned': return '#8b5cf6';
      case 'unassigned': return '#6b7280';
      case 'priority_changed': return '#f97316';
      case 'due_date_changed': return '#06b6d4';
      default: return '#6b7280';
    }
  };

  return (
    <div className="activity-logs">
      <div className="activity-header">
        <h3 className="activity-title">Activity Feed</h3>
        <select
          value={selectedTask}
          onChange={(e) => setSelectedTask(e.target.value)}
          className="select"
        >
          <option value="all">All Tasks</option>
          {tasks.map(task => (
            <option key={task._id} value={task._id}>
              {task.title}
            </option>
          ))}
        </select>
      </div>

      <div className="activity-content">
        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            <span>Loading activities...</span>
          </div>
        ) : activityLogs.length === 0 ? (
          <div className="no-activities">
            <p>No activities yet</p>
            <span>Activities will appear here as tasks are created and updated</span>
          </div>
        ) : (
          <div className="activity-list">
            {activityLogs.map((log, index) => (
              <div key={index} className="activity-item">
                <div className="activity-icon" style={{ backgroundColor: getActionColor(log.action) }}>
                  {getActionIcon(log.action)}
                </div>
                
                <div className="activity-content">
                  <div className="activity-description">
                    {log.description}
                  </div>
                  
                  <div className="activity-meta">
                    <div className="activity-user">
                      <div className="avatar avatar-sm">
                        {log.user?.name?.charAt(0)?.toUpperCase() || '?'}
                      </div>
                      <span>{log.user?.name || 'Unknown User'}</span>
                    </div>
                    
                    <span className="activity-time">
                      {formatDate(log.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityLogs;
