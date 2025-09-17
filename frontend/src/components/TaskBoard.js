import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useApp } from '../context/AppContext';
import TaskCard from './TaskCard';
import CreateTaskModal from './CreateTaskModal';
import './TaskBoard.css';

const TaskBoard = () => {
  const { tasks, emitStatusChange } = useApp();
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Group tasks by status
  const tasksByStatus = {
    todo: tasks.filter(task => task.status === 'todo'),
    'in-progress': tasks.filter(task => task.status === 'in-progress'),
    done: tasks.filter(task => task.status === 'done')
  };

  const statusConfig = {
    todo: {
      title: 'To Do',
      color: '#6b7280',
      bgColor: '#f9fafb'
    },
    'in-progress': {
      title: 'In Progress',
      color: '#d97706',
      bgColor: '#fffbeb'
    },
    done: {
      title: 'Done',
      color: '#059669',
      bgColor: '#f0fdf4'
    }
  };

  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const newStatus = destination.droppableId;
    const newPosition = destination.index;

    emitStatusChange(draggableId, newStatus, newPosition);
  };

  const renderTaskColumn = (status) => {
    const config = statusConfig[status];
    const columnTasks = tasksByStatus[status];

    return (
      <div className="task-column" key={status}>
        <div className="column-header" style={{ backgroundColor: config.bgColor }}>
          <h3 className="column-title" style={{ color: config.color }}>
            {config.title}
          </h3>
          <span className="task-count">{columnTasks.length}</span>
        </div>
        
        <Droppable droppableId={status}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`column-content ${snapshot.isDraggingOver ? 'dragging-over' : ''}`}
            >
              {columnTasks.map((task, index) => (
                <Draggable key={task._id} draggableId={task._id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`task-wrapper ${snapshot.isDragging ? 'dragging' : ''}`}
                    >
                      <TaskCard task={task} />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
              
              {status === 'todo' && (
                <button
                  className="add-task-btn"
                  onClick={() => setShowCreateModal(true)}
                >
                  + Add Task
                </button>
              )}
            </div>
          )}
        </Droppable>
      </div>
    );
  };

  return (
    <div className="task-board">
      <div className="board-header">
        <h2 className="board-title">Task Board</h2>
        <button
          className="btn btn-primary"
          onClick={() => setShowCreateModal(true)}
        >
          + New Task
        </button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="board-columns">
          {Object.keys(statusConfig).map(status => renderTaskColumn(status))}
        </div>
      </DragDropContext>

      {showCreateModal && (
        <CreateTaskModal onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  );
};

export default TaskBoard;
