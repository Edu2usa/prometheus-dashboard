import { useState, useEffect } from 'react';
import { KanbanBoard } from '../components/KanbanBoard';

export function ContentPipeline() {
  const initialContent = {
    ideas: [
      { id: '1', title: 'How AI runs my janitorial business', platform: 'YouTube', dueDate: '2026-04-10', status: 'ideas' },
      { id: '2', title: 'Property manager retention tips', platform: 'LinkedIn', dueDate: '2026-04-15', status: 'ideas' },
    ],
    research: [
      { id: '3', title: 'Market size of commercial cleaning 2026', platform: 'Blog', dueDate: '2026-04-05', status: 'research' },
    ],
    draft: [
      { id: '4', title: 'LinkedIn post: Why we use AI agents', platform: 'X', dueDate: '2026-03-28', status: 'draft' },
    ],
    edit: [],
    schedule: [],
    published: [],
    archive: [],
  };

  const [content, setContent] = useState(initialContent);
  const [selectedTask, setSelectedTask] = useState(null);
  const [draggedTask, setDraggedTask] = useState(null);

  const columnOrder = ['ideas', 'research', 'draft', 'edit', 'schedule', 'published', 'archive'];
  const columnNames = {
    ideas: 'Ideas',
    research: 'Research',
    draft: 'Draft',
    edit: 'Edit',
    schedule: 'Schedule',
    published: 'Published',
    archive: 'Archive',
  };

  useEffect(() => {
    const saved = localStorage.getItem('content');
    if (saved) {
      setContent(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('content', JSON.stringify(content));
  }, [content]);

  const handleDragStart = (e, columnKey, taskId) => {
    setDraggedTask({ columnKey, taskId });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetColumn) => {
    e.preventDefault();
    if (!draggedTask) return;

    const { columnKey: sourceColumn, taskId } = draggedTask;
    if (sourceColumn === targetColumn) {
      setDraggedTask(null);
      return;
    }

    const taskToMove = content[sourceColumn].find((t) => t.id === taskId);
    if (!taskToMove) {
      setDraggedTask(null);
      return;
    }

    setContent((prevContent) => ({
      ...prevContent,
      [sourceColumn]: prevContent[sourceColumn].filter((t) => t.id !== taskId),
      [targetColumn]: [...prevContent[targetColumn], { ...taskToMove, status: targetColumn }],
    }));

    setDraggedTask(null);
  };

  return (
    <div>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px', color: '#e0e0e0' }}>
        Content Pipeline
      </h1>

      <div style={{ marginBottom: '24px', background: '#141414', border: '1px solid #1e1e1e', borderRadius: '8px', padding: '16px' }}>
        <h3 style={{ color: '#e0e0e0', marginBottom: '12px', fontSize: '14px', fontWeight: '600' }}>
          Weekly Schedule
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px' }}>
          {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => (
            <div
              key={day}
              style={{
                background: '#1a1a1a',
                border: '1px solid #2a2a2a',
                borderRadius: '6px',
                padding: '12px',
                textAlign: 'center',
                color: '#888',
                fontSize: '12px',
              }}
            >
              <div style={{ fontWeight: '600', marginBottom: '8px', color: '#e0e0e0' }}>{day}</div>
              <div>Set your themes</div>
            </div>
          ))}
        </div>
      </div>

      <KanbanBoard
        tasks={content}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onCardClick={setSelectedTask}
        columnOrder={columnOrder}
        columnNames={columnNames}
      />
    </div>
  );
}
