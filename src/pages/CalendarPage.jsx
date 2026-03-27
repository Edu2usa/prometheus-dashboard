import { useState, useEffect } from 'react';
import { initialEvents, getCategoryColor, getCategoryName } from '../data/events';

export function CalendarPage() {
  const [events, setEvents] = useState(initialEvents);
  const [viewMode, setViewMode] = useState('month');
  const [currentDate, setCurrentDate] = useState(new Date(2026, 2, 26));
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('events');
    if (saved) {
      setEvents(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('events', JSON.stringify(events));
  }, [events]);

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getEventsForDate = (year, month, day) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter((e) => e.date === dateStr);
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date(2026, 2, 26));
  };

  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const days = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const isToday = (day) => {
    return day === 26 && month === 2 && year === 2026;
  };

  return (
    <div>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px', color: '#e0e0e0' }}>
        Calendar
      </h1>

      <div className="calendar-container">
        <div className="calendar-header">
          <h2 className="calendar-title">{monthName}</h2>
          <div className="calendar-controls">
            <button className="calendar-btn" onClick={handlePrevMonth}>
              ← Prev
            </button>
            <button className="calendar-btn" onClick={handleToday}>
              Today
            </button>
            <button className="calendar-btn" onClick={handleNextMonth}>
              Next →
            </button>
            <button className={`calendar-btn ${viewMode === 'month' ? 'active' : ''}`} onClick={() => setViewMode('month')}>
              Month
            </button>
            <button className={`calendar-btn ${viewMode === 'week' ? 'active' : ''}`} onClick={() => setViewMode('week')}>
              Week
            </button>
            <button className={`calendar-btn ${viewMode === 'day' ? 'active' : ''}`} onClick={() => setViewMode('day')}>
              Day
            </button>
          </div>
        </div>

        {viewMode === 'month' && (
          <>
            <div className="calendar-weekdays">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="calendar-weekday">
                  {day}
                </div>
              ))}
            </div>

            <div className="calendar-grid">
              {days.map((day, idx) => {
                const dayEvents = day ? getEventsForDate(year, month, day) : [];
                const isOtherMonth = !day;
                const isCurrentDay = isToday(day);

                return (
                  <div
                    key={idx}
                    className={`calendar-day ${isOtherMonth ? 'other-month' : ''} ${isCurrentDay ? 'today' : ''}`}
                  >
                    <div className="calendar-day-number">{day}</div>
                    {dayEvents.slice(0, 2).map((event) => (
                      <div key={event.id} className="calendar-day-event" title={event.title}>
                        {event.title}
                      </div>
                    ))}
                    {dayEvents.length > 2 && <div className="calendar-day-event">+{dayEvents.length - 2} more</div>}
                  </div>
                );
              })}
            </div>
          </>
        )}

        {viewMode === 'week' && (
          <div style={{ marginTop: '20px', color: '#888', textAlign: 'center', padding: '40px' }}>
            Week view coming soon
          </div>
        )}

        {viewMode === 'day' && (
          <div style={{ marginTop: '20px', color: '#888', textAlign: 'center', padding: '40px' }}>
            Day view coming soon
          </div>
        )}
      </div>

      {events.length > 0 && (
        <div style={{ marginTop: '32px', background: '#141414', border: '1px solid #1e1e1e', borderRadius: '8px', padding: '20px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#e0e0e0', marginBottom: '16px', textTransform: 'uppercase' }}>
            Upcoming Events
          </h3>
          <div style={{ display: 'grid', gap: '12px' }}>
            {events.slice(0, 6).map((event) => (
              <div
                key={event.id}
                style={{
                  background: '#1a1a1a',
                  border: `1px solid ${getCategoryColor(event.category)}22`,
                  borderRadius: '6px',
                  padding: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = getCategoryColor(event.category);
                  e.currentTarget.style.boxShadow = `0 0 10px ${getCategoryColor(event.category)}22`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = getCategoryColor(event.category) + '22';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div>
                  <div style={{ fontWeight: '500', color: '#e0e0e0', marginBottom: '4px' }}>
                    {event.title}
                  </div>
                  <div style={{ fontSize: '12px', color: '#888' }}>
                    {event.date} at {event.time}
                  </div>
                </div>
                <div
                  style={{
                    padding: '4px 8px',
                    background: getCategoryColor(event.category) + '22',
                    color: getCategoryColor(event.category),
                    borderRadius: '3px',
                    fontSize: '11px',
                    fontWeight: '500',
                    textTransform: 'uppercase',
                  }}
                >
                  {getCategoryName(event.category)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
