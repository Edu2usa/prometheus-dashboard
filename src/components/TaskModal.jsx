import { useState } from 'react';

export function TaskModal({ task, onClose, onUpdate }) {
  const [comment, setComment] = useState('');

  const handleSave = () => {
    if (comment.trim()) {
      onUpdate(task.id, comment);
      setComment('');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{task.title}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-section">
          <label className="modal-label">Status</label>
          <div className="modal-value" style={{ textTransform: 'capitalize' }}>
            {task.status}
          </div>
        </div>

        <div className="modal-section">
          <label className="modal-label">Assignee</label>
          <div className="modal-value">{task.assignee}</div>
        </div>

        <div className="modal-section">
          <label className="modal-label">Priority</label>
          <div className="modal-value" style={{ textTransform: 'capitalize' }}>
            {task.priority}
          </div>
        </div>

        <div className="modal-section">
          <label className="modal-label">Due Date</label>
          <div className="modal-value">{task.dueDate}</div>
        </div>

        <div className="modal-section">
          <label className="modal-label">Add Comment</label>
          <textarea
            className="modal-textarea"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add your comment..."
          />
          <button className="modal-button" onClick={handleSave}>
            Save Comment
          </button>
        </div>
      </div>
    </div>
  );
}
