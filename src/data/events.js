export const initialEvents = [
  {
    id: '1',
    title: 'Board Meeting — Q1 Review',
    date: '2026-03-26',
    time: '2:00 PM',
    category: 'meetings',
    description: 'Quarterly strategic review with board members',
  },
  {
    id: '2',
    title: 'Client walkthrough — Riverside Plaza',
    date: '2026-03-27',
    time: '10:00 AM',
    category: 'client',
    description: 'Site walkthrough for new facility management contract',
  },
  {
    id: '3',
    title: 'Prometheus system maintenance',
    date: '2026-03-28',
    time: '11:00 PM',
    category: 'system',
    description: 'Scheduled maintenance window for XQUADS infrastructure',
  },
  {
    id: '4',
    title: 'Payroll processing',
    date: '2026-03-30',
    time: '9:00 AM',
    category: 'admin',
    description: 'Monthly payroll run for all employees',
  },
  {
    id: '5',
    title: 'Content Strategy Planning',
    date: '2026-03-31',
    time: '3:00 PM',
    category: 'meetings',
    description: 'Q2 content calendar planning session',
  },
  {
    id: '6',
    title: 'Client: Metro Office Complex',
    date: '2026-04-02',
    time: '1:00 PM',
    category: 'client',
    description: 'Contract renewal discussion and service review',
  },
];

export const getCategoryColor = (category) => {
  switch (category) {
    case 'meetings': return '#4488ff';
    case 'client': return '#00ff41';
    case 'system': return '#aa44ff';
    case 'admin': return '#666';
    default: return '#888';
  }
};

export const getCategoryName = (category) => {
  switch (category) {
    case 'meetings': return 'Meetings';
    case 'client': return 'Client/Operations';
    case 'system': return 'AI/System';
    case 'admin': return 'Admin';
    default: return 'Other';
  }
};
