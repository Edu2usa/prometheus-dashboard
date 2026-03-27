import { useState, useEffect } from 'react';
import { initialTasks } from '../data/tasks';
import { KanbanBoard } from '../components/KanbanBoard';
import { TaskModal } from '../components/TaskModal';

export function TasksBoard() {
  const [tasks, setTasks] = useState(initialTasks);
  const [selectedTask, setSelectedTask] = useState(null);
  const [draggedTask, setDraggedTask] = useState(null);
  const [filter, setFilter] = useState('all');

  const columnOrder = ['inbox', 'prometheus', 'inProgress', 'review', 'done'];
  const columnNames = {
    inbox: 'Inbox',
    prometheus: 'Prometheus',
    inProgress: 'In Progress',
    review: 'Review',
    done: 'Done',
  };

  useEffect(() => {
    const saved = localStorage.getItem('tasks');
    if (saved) {
      setTasks(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleDragStart = (e, columnKey, taskId) => {
    setDraggedTask({ columnKey, taskId });
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetColumn) => {
    e.preventDefault();
    if (!draggedTask) return;

    const { columnKey: sourceColumn, taskId } = draggedTask;
    if (sourceColumn === targetColumn) {
      setDraggedTask(null);
      return;
    }

    const taskToMove = tasks[sourceColumn].find((t) => t.id === taskId);
    if (!taskToMove) {
      setDraggedTask(null);
      return;
    }

    setTasks((prevTasks) => ({
      ...prevTasks,
      [sourceColumn]: prevTasks[sourceColumn].filter((t) => t.id !== taskId),
      [targetColumn]: [...prevTasks[targetColumn], { ...taskToMove, status: targetColumn }],
    }));

    setDraggedTask(null);
  };

  const getFilteredTasks = () => {
    if (filter === 'all') return tasks;
    return Object.keys(tasks).reduce((acc, key) => {
      acc[key] = tasks[key].filter((task) => {
        if (filter === 'urgent') return task.priority === 'urgent';
        if (filter === 'high') return task.priority === 'high';
        if (filter === 'medium') return task.priority === 'medium';
        if (filter === 'low') return task.priority === 'low';
        return task.assignee === filter;
      });
      return acc;
    }, {});
  };

  const filteredTasks = getFilteredTasks();

  return (
    <div>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px', color: '#e0e0e0' }}>
        Tasks Board
      </h1>

      <div className="filter-bar">
        <button
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All Tasks
        </button>
        <button
          className={`filter-btn ${filter === 'Eduardo' ? 'active' : ''}`}
          onClick={() => setFilter('Eduardo')}
        >
          Eduardo
        </button>
        <button
          className={`filter-btn ${filter === 'Prometheus' ? 'active' : ''}`}
          onClick={() => setFilter('Prometheus')}
        >
          Prometheus
        </button>
        <button
          className={`filter-btn ${filter === 'urgent' ? 'active' : ''}`}
          onClick={() => setFilter('urgent')}
        >
          Urgent
        </button>
        <button
          className={`filter-btn ${filter === 'high' ? 'active' : ''}`}
          onClick={() => setFilter('high')}
        >
          High Priority
        </button>
      </div>

      <KanbanBoard
        tasks={filteredTasks}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onCardClick={setSelectedTask}
        columnOrder={columnOrder}
        columnNames={columnNames}
      />

      {selectedTask && (
        <TaskModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onUpdate={(taskId, comment) => {
            console.log('Comment added to task', taskId, ':', comment);
            setSelectedTask(null);
          }}
        />
      )}
    </div>
  );
}
