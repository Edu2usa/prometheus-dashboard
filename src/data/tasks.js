export const initialTasks = {
  inbox: [
    { id: '1', title: 'Evaluate new floor care supplier', assignee: 'Eduardo', priority: 'high', dueDate: '2026-03-28', status: 'inbox' },
    { id: '2', title: 'Review Q2 budget proposal', assignee: 'Eduardo', priority: 'medium', dueDate: '2026-03-30', status: 'inbox' },
  ],
  prometheus: [
    { id: '3', title: 'Generate April marketing plan', assignee: 'Prometheus', priority: 'high', dueDate: '2026-03-31', status: 'prometheus' },
    { id: '4', title: 'Audit client satisfaction scores', assignee: 'Prometheus', priority: 'medium', dueDate: '2026-04-02', status: 'prometheus' },
  ],
  inProgress: [
    { id: '5', title: 'Onboard ABC Property Group', assignee: 'TAXIS', priority: 'urgent', dueDate: '2026-03-27', status: 'inProgress' },
    { id: '6', title: 'Update service pricing sheet', assignee: 'LEONIDAS', priority: 'high', dueDate: '2026-03-29', status: 'inProgress' },
  ],
  review: [
    { id: '7', title: 'Client retention report for March', assignee: 'AUDIT', priority: 'medium', dueDate: '2026-03-26', status: 'review' },
  ],
  done: [
    { id: '8', title: 'Invoice batch #47 verified', assignee: 'AUDIT', priority: 'medium', dueDate: '2026-03-25', status: 'done' },
    { id: '9', title: 'New hire background check complete', assignee: 'VAULT', priority: 'low', dueDate: '2026-03-24', status: 'done' },
  ],
};

export const getPriorityColor = (priority) => {
  switch (priority) {
    case 'urgent': return '#ff4444';
    case 'high': return '#ff8800';
    case 'medium': return '#ffd700';
    case 'low': return '#555';
    default: return '#888';
  }
};

export const getAssigneeColor = (assignee) => {
  if (assignee === 'Eduardo') return '#00ff41';
  if (assignee === 'Prometheus') return '#00ccff';
  return '#888';
};
