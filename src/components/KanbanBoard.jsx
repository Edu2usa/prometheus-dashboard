import { TaskCard } from './TaskCard';

export function KanbanBoard({ tasks, onDragStart, onDragOver, onDrop, onCardClick, columnOrder, columnNames }) {
  return (
    <div className="kanban-container">
      {columnOrder.map((columnKey) => (
        <div key={columnKey} className="kanban-column">
          <div className="kanban-column-title">
            {columnNames[columnKey]}
            <span className="kanban-column-count">({tasks[columnKey]?.length || 0})</span>
          </div>
          <div
            className="kanban-cards"
            onDragOver={(e) => onDragOver(e, columnKey)}
            onDrop={(e) => onDrop(e, columnKey)}
          >
            {(tasks[columnKey] || []).map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onDragStart={(e) => onDragStart(e, columnKey, task.id)}
                onClick={() => onCardClick(task)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
