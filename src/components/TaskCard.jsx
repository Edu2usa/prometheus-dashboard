import { getPriorityColor, getAssigneeColor } from '../data/tasks';

export function TaskCard({ task, onDragStart, onClick }) {
  return (
    <div
      className="task-card"
      draggable
      onDragStart={onDragStart}
      onClick={onClick}
    >
      <div className="task-card-title">{task.title}</div>
      <div className="task-card-meta">
        <span
          className="task-assignee"
          style={{ background: getAssigneeColor(task.assignee) + '22' }}
        >
          {task.assignee}
        </span>
        <span
          className="task-priority"
          style={{ background: getPriorityColor(task.priority) + '22' }}
        >
          {task.priority}
        </span>
      </div>
      <div className="task-duedate">{task.dueDate}</div>
    </div>
  );
}
