import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import axios from 'axios';
import './TaskModal.css';

const TaskModal = ({ task, onClose }) => {
  const { users, emitTaskUpdate, emitTaskDeletion, emitTaskAssignment } = useApp();
  const [formData, setFormData] = useState({
    title: task.title,
    description: task.description || '',
    status: task.status,
    priority: task.priority,
    assignedTo: task.assignedTo || '',
    dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
    tags: task.tags ? task.tags.join(', ') : ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activityLogs, setActivityLogs] = useState([]);
  const [showActivityLogs, setShowActivityLogs] = useState(false);

  useEffect(() => {
    fetchActivityLogs();
  }, [task._id]);

  const fetchActivityLogs = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/tasks/${task._id}/activity`);
      setActivityLogs(response.data);
    } catch (error) {
      console.error('Error fetching activity logs:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const updates = {
        ...formData,
        assignedTo: formData.assignedTo || null,
        dueDate: formData.dueDate || null,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : []
      };

      // Update task via API
      await emitTaskUpdate(task._id, updates);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update task');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setLoading(true);
      try {
        await emitTaskDeletion(task._id);
        onClose();
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete task');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleQuickAssign = (userId) => {
    emitTaskAssignment(task._id, userId);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No date';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getAssignedUser = () => {
    return users.find(user => user._id === task.assignedTo);
  };

  const assignedUser = getAssignedUser();

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal task-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Task Details</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="task-modal-content">
          <div className="task-info">
            <div className="task-header-info">
              <div className="task-status-badge">
                <span className={`badge badge-${task.status}`}>
                  {task.status.replace('-', ' ')}
                </span>
              </div>
              <div className="task-priority-badge">
                <span className={`badge badge-${task.priority}`}>
                  {task.priority} priority
                </span>
              </div>
            </div>

            <div className="task-assignment">
              <h4>Assignment</h4>
              {assignedUser ? (
                <div className="assigned-user-info">
                  <div className="avatar">
                    {assignedUser.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="user-name">{assignedUser.name}</div>
                    <div className="user-email">{assignedUser.email}</div>
                  </div>
                  <button
                    className="btn btn-sm btn-secondary"
                    onClick={() => handleQuickAssign(null)}
                  >
                    Unassign
                  </button>
                </div>
              ) : (
                <div className="unassigned">
                  <p>No one assigned</p>
                  <div className="quick-assign">
                    <span>Quick assign:</span>
                    {users.slice(0, 3).map(user => (
                      <button
                        key={user._id}
                        className="btn btn-sm btn-primary"
                        onClick={() => handleQuickAssign(user._id)}
                      >
                        {user.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="task-dates">
              <div className="date-info">
                <strong>Created:</strong> {formatDate(task.createdAt)}
              </div>
              <div className="date-info">
                <strong>Updated:</strong> {formatDate(task.updatedAt)}
              </div>
              {task.dueDate && (
                <div className="date-info">
                  <strong>Due:</strong> {formatDate(task.dueDate)}
                </div>
              )}
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="textarea"
                rows="4"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="select"
                >
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Priority</label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="select"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Assign To</label>
                <select
                  name="assignedTo"
                  value={formData.assignedTo}
                  onChange={handleChange}
                  className="select"
                >
                  <option value="">Unassigned</option>
                  {users.map(user => (
                    <option key={user._id} value={user._id}>
                      {user.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Due Date</label>
                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  className="input"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Tags</label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className="input"
                placeholder="Enter tags separated by commas"
              />
            </div>

            {error && (
              <div className="form-error">{error}</div>
            )}

            <div className="modal-actions">
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleDelete}
                disabled={loading}
              >
                Delete Task
              </button>
              <div className="action-buttons">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowActivityLogs(!showActivityLogs)}
                >
                  {showActivityLogs ? 'Hide' : 'Show'} Activity
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={onClose}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="spinner" style={{ width: '16px', height: '16px' }}></div>
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </div>
          </form>

          {showActivityLogs && (
            <div className="activity-logs-section">
              <h4>Activity Log</h4>
              <div className="activity-list">
                {activityLogs.map((log, index) => (
                  <div key={index} className="activity-item">
                    <div className="activity-header">
                      <div className="activity-user">
                        <div className="avatar avatar-sm">
                          {log.user?.name?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                        <span>{log.user?.name || 'Unknown User'}</span>
                      </div>
                      <span className="activity-time">
                        {new Date(log.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <div className="activity-description">
                      {log.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
