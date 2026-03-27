import { useState, useEffect, useMemo } from 'react';
import { initialEvents, getCategoryColor, getCategoryName } from '../data/events';

function EventModal({ event, onSave, onDelete, onClose }) {
  const [form, setForm] = useState(
    event || { title: '', date: '', time: '09:00 AM', category: 'meetings', description: '' }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.date) return;
    onSave({
      ...form,
      id: form.id || String(Date.now()),
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">{event ? 'Edit Event' : 'New Event'}</h3>
          <button className="modal-close" onClick={onClose}>Ã</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-section">
            <label className="modal-label">Title</label>
            <input
              className="search-input"
              style={{ width: '100%' }}
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Event title"
              autoFocus
            />
          </div>
          <div className="modal-section">
            <label className="modal-label">Date</label>
            <input
              className="search-input"
              style={{ width: '100%' }}
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
          </div>
          <div className="modal-section">
            <label className="modal-label">Time</label>
            <input
              className="search-input"
              style={{ width: '100%' }}
              value={form.time}
              onChange={(e) => setForm({ ...form, time: e.target.value })}
              placeholder="e.g. 2:00 PM"
            />
          </div>
          <div className="modal-section">
            <label className="modal-label">Category</label>
            <select
              className="search-input"
              style={{ width: '100%' }}
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              <option value="meetings">Meetings</option>
              <option value="client">Client / Operations</option>
              <option value="system">AI / System</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="modal-section">
            <label className="modal-label">Description</label>
            <textarea
              className="modal-textarea"
              value={form.description || ''}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Optional description"
            />
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button type="submit" className="modal-button" style={{ flex: 1 }}>
              {event ? 'Save Changes' : 'Create Event'}
            </button>
            {event && (
              <button
                type="button"
                className="modal-button"
                style={{ flex: 0, background: '#1a1a1a', color: '#ff4444', border: '1px solid #ff4444' }}
                onClick={() => onDelete(event.id)}
              >
                Delete
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

const pad = (n) => String(n).padStart(2, '0');
const fmtDate = (y, m, d) => `${y}-${pad(m + 1)}-${pad(d)}`;

const todayDate = () => {
  const t = new Date();
  return { year: t.getFullYear(), month: t.getMonth(), day: t.getDate() };
};

function getWeekDays(date) {
  const d = new Date(date);
  const day = d.getDay();
  const start = new Date(d);
  start.setDate(d.getDate() - day);
  const days = [];
  for (let i = 0; i < 7; i++) {
    const cur = new Date(start);
    cur.setDate(start.getDate() + i);
    days.push({ year: cur.getFullYear(), month: cur.getMonth(), day: cur.getDate() });
  }
  return days;
}

const HOURS = Array.from({ length: 14 }, (_, i) => i + 7);

export function CalendarPage() {
  const [events, setEvents] = useState(initialEvents);
  const [viewMode, setViewMode] = useState('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [modalEvent, setModalEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('events');
    if (saved) setEvents(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('events', JSON.stringify(events));
  }, [events]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const today = todayDate();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const monthDays = useMemo(() => {
    const arr = [];
    for (let i = 0; i < firstDay; i++) arr.push(null);
    for (let i = 1; i <= daysInMonth; i++) arr.push(i);
    return arr;
  }, [firstDay, daysInMonth]);

  const weekDays = useMemo(() => getWeekDays(currentDate), [currentDate]);

  const eventsForDate = (dateStr) => events.filter((e) => e.date === dateStr);

  const isToday = (y, m, d) => y === today.year && m === today.month && d === today.day;

  const navigate = (dir) => {
    const d = new Date(currentDate);
    if (viewMode === 'month') d.setMonth(d.getMonth() + dir);
    else if (viewMode === 'week') d.setDate(d.getDate() + dir * 7);
    else d.setDate(d.getDate() + dir);
    setCurrentDate(d);
  };

  const goToday = () => setCurrentDate(new Date());

  const openNew = (dateStr) => {
    setModalEvent({ title: '', date: dateStr || '', time: '09:00 AM', category: 'meetings', description: '' });
    setShowModal(true);
  };

  const openEdit = (evt) => {
    setModalEvent({ ...evt });
    setShowModal(true);
  };

  const handleSave = (evt) => {
    setEvents((prev) => {
      const exists = prev.find((e) => e.id === evt.id);
      if (exists) return prev.map((e) => (e.id === evt.id ? evt : e));
      return [...prev, evt];
    });
    setShowModal(false);
  };

  const handleDelete = (id) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
    setShowModal(false);
  };

  const weekLabel = useMemo(() => {
    if (viewMode !== 'week' || weekDays.length === 0) return '';
    const s = weekDays[0];
    const e = weekDays[6];
    const sm = new Date(s.year, s.month).toLocaleDateString('en-US', { month: 'short' });
    const em = new Date(e.year, e.month).toLocaleDateString('en-US', { month: 'short' });
    if (s.month === e.month) return sm + ' ' + s.day + ' - ' + e.day + ', ' + s.year;
    return sm + ' ' + s.day + ' - ' + em + ' ' + e.day + ', ' + e.year;
  }, [viewMode, weekDays]);

  const dayLabel = currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  const parseHour = (timeStr) => {
    if (!timeStr) return 9;
    const match = timeStr.match(/(\\d+):?(\\d*)\\s*(AM|PM)?/i);
    if (!match) return 9;
    let h = parseInt(match[1]);
    const ampm = (match[3] || '').toUpperCase();
    if (ampm === 'PM' && h < 12) h += 12;
    if (ampm === 'AM' && h === 12) h = 0;
    return h;
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#e0e0e0' }}>Calendar</h1>
        <button
          className="modal-button"
          style={{ width: 'auto', marginTop: 0, padding: '8px 16px' }}
          onClick={() => openNew(fmtDate(year, month, today.day))}
        >
          + New Event
        </button>
      </div>
      <div className="calendar-container">
        <div className="calendar-header">
          <h2 className="calendar-title">
            {viewMode === 'month' ? monthName : viewMode === 'week' ? weekLabel : dayLabel}
          </h2>
          <div className="calendar-controls">
            <button className="calendar-btn" onClick={() => navigate(-1)}>Prev</button>
            <button className="calendar-btn" onClick={goToday}>Today</button>
            <button className="calendar-btn" onClick={() => navigate(1)}>Next</button>
            {['month', 'week', 'day'].map((v) => (
              <button key={v} className={'calendar-btn ' + (viewMode === v ? 'active' : '')} onClick={() => setViewMode(v)}>
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </button>
            ))}
          </div>
        </div>
        {viewMode === 'month' && (<>
          <div className="calendar-weekdays">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (<div key={d} className="calendar-weekday">{d}</div>))}
          </div>
          <div className="calendar-grid">
            {monthDays.map((day, idx) => {
              const dateStr = day ? fmtDate(year, month, day) : '';
              const dayEvents = day ? eventsForDate(dateStr) : [];
              return (<div key={idx} className={'calendar-day ' + (!day ? 'other-month' : '') + ' ' + (day && isToday(year, month, day) ? 'today' : '')} onClick={() => day && openNew(dateStr)}>
                <div className="calendar-day-number">{day}</div>
                {dayEvents.slice(0, 2).map((evt) => (<div key={evt.id} className="calendar-day-event" style={{color: getCategoryColor(evt.category)}} title={evt.title} onClick={(e) => { e.stopPropagation(); openEdit(evt); }}><span className="calendar-event-dot" style={{background: getCategoryColor(evt.category)}} />{evt.title}</div>))}
                {dayEvents.length > 2 && (<div className="calendar-day-event" style={{color: '#888'}}>+{dayEvents.length - 2} more</div>)}
              </div>);
            })}
          </div>
        </>)}
        {viewMode === 'week' && (
          <div className="calendar-week-view">
            <div className="week-header-row">
              <div className="week-time-gutter" />
              {weekDays.map((wd, i) => {
                const dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][i];
                const isTodayCol = isToday(wd.year, wd.month, wd.day);
                return (<div key={i} className={'week-col-header ' + (isTodayCol ? 'today' : '')}><span className="week-col-dayname">{dayName}</span><span className={'week-col-daynum ' + (isTodayCol ? 'today-num' : '')}>{wd.day}</span></div>);
              })}
            </div>
            <div className="week-body">
              {HOURS.map((hour) => (<div key={hour} className="week-hour-row">
                <div className="week-time-gutter"><span className="week-time-label">{hour > 12 ? hour - 12 : hour} {hour >= 12 ? 'PM' : 'AM'}</span></div>
                {weekDays.map((wd, i) => {
                  const dateStr = fmtDate(wd.year, wd.month, wd.day);
                  const hourEvents = eventsForDate(dateStr).filter((e) => parseHour(e.time) === hour);
                  return (<div key={i} className="week-cell" onClick={() => openNew(dateStr)}>
                    {hourEvents.map((evt) => (<div key={evt.id} className="week-event-chip" style={{background: getCategoryColor(evt.category) + '22', borderLeft: '3px solid ' + getCategoryColor(evt.category), color: getCategoryColor(evt.category)}} onClick={(e) => { e.stopPropagation(); openEdit(evt); }}><div style={{fontWeight: 500, fontSize: '11px'}}>{evt.title}</div><div style={{fontSize: '10px', opacity: 0.7}}>{evt.time}</div></div>))}
                  </div>);
                })}
              </div>))}
            </div>
          </div>
        )}
        {viewMode === 'day' && (
          <div className="calendar-day-view">
            {HOURS.map((hour) => {
              const dateStr = fmtDate(year, month, currentDate.getDate());
              const hourEvents = eventsForDate(dateStr).filter((e) => parseHour(e.time) === hour);
              return (<div key={hour} className="day-hour-row" onClick={() => openNew(dateStr)}>
                <div className="day-time-label">{hour > 12 ? hour - 12 : hour} {hour >= 12 ? 'PM' : 'AM'}</div>
                <div className="day-hour-content">
                  {hourEvents.map((evt) => (<div key={evt.id} className="day-event-block" style={{background: getCategoryColor(evt.category) + '22', borderLeft: '3px solid ' + getCategoryColor(evt.category), color: getCategoryColor(evt.category)}} onClick={(e) => { e.stopPropagation(); openEdit(evt); }}>
                    <div style={{fontWeight: 600, marginBottom: '2px'}}>{evt.title}</div>
                    <div style={{fontSize: '11px', opacity: 0.7}}>{evt.time} - {getCategoryName(evt.category)}</div>
                    {evt.description && (<div style={{fontSize: '11px', opacity: 0.5, marginTop: '4px'}}>{evt.description}</div>)}
                  </div>))}
                </div>
              </div>);
            })}
          </div>
        )}
      </div>
      {events.length > 0 && (
        <div style={{marginTop: '32px', background: '#141414', border: '1px solid #1e1e1e', borderRadius: '8px', padding: '20px'}}>
          <h3 style={{fontSize: '14px', fontWeight: '600', color: '#e0e0e0', marginBottom: '16px', textTransform: 'uppercase'}}>Upcoming Events</h3>
          <div style={{display: 'grid', gap: '12px'}}>
            {[...events].sort((a, b) => a.date.localeCompare(b.date)).filter((e) => e.date >= fmtDate(today.year, today.month, today.day)).slice(0, 6).map((event) => (
              <div key={event.id} style={{background: '#1a1a1a', border: '1px solid ' + getCategoryColor(event.category) + '22', borderRadius: '6px', padding: '12px', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}} onClick={() => openEdit(event)} onMouseEnter={(e) => { e.currentTarget.style.borderColor = getCategoryColor(event.category); e.currentTarget.style.boxShadow = '0 0 10px ' + getCategoryColor(event.category) + '22'; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = getCategoryColor(event.category) + '22'; e.currentTarget.style.boxShadow = 'none'; }}>
                <div><div style={{fontWeight: '500', color: '#e0e0e0', marginBottom: '4px'}}>{event.title}</div><div style={{fontSize: '12px', color: '#888'}}>{event.date} at {event.time}</div></div>
                <div style={{padding: '4px 8px', background: getCategoryColor(event.category) + '22', color: getCategoryColor(event.category), borderRadius: '3px', fontSize: '11px', fontWeight: '500', textTransform: 'uppercase'}}>{getCategoryName(event.category)}</div>
              </div>))}
          </div>
        </div>
      )}
      {showModal && (<EventModal event={modalEvent?.id ? modalEvent : null} onSave={handleSave} onDelete={handleDelete} onClose={() => setShowModal(false)} />)}
    </div>
  );
}
