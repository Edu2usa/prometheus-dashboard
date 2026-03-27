import { useState, useEffect } from 'react';
import { initialContacts, contactCategories } from '../data/contacts';

export function Contacts() {
  const [contacts, setContacts] = useState(initialContacts);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    company: '',
    email: '',
    phone: '',
    timezone: '',
    category: 'internal',
    notes: '',
  });

  useEffect(() => {
    const saved = localStorage.getItem('contacts');
    if (saved) {
      setContacts(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('contacts', JSON.stringify(contacts));
  }, [contacts]);

  const filteredContacts =
    selectedCategory === 'all'
      ? contacts
      : contacts.filter((c) => c.category === selectedCategory);

  const handleAddContact = (e) => {
    e.preventDefault();
    const newContact = {
      id: Date.now().toString(),
      ...formData,
      status: 'active',
    };
    setContacts([...contacts, newContact]);
    setFormData({
      name: '',
      role: '',
      company: '',
      email: '',
      phone: '',
      timezone: '',
      category: 'internal',
      notes: '',
    });
    setShowAddForm(false);
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#e0e0e0' }}>
          Contacts
        </h1>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          style={{
            background: '#00ff41',
            color: '#0a0a0a',
            border: 'none',
            borderRadius: '6px',
            padding: '10px 16px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '13px',
          }}
        >
          + Add Contact
        </button>
      </div>

      {showAddForm && (
        <div
          style={{
            background: '#141414',
            border: '1px solid #1e1e1e',
            borderRadius: '8px',
            padding: '20px',
            marginBottom: '20px',
          }}
        >
          <form onSubmit={handleAddContact}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
              <input
                type="text"
                placeholder="Name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                style={{
                  background: '#1a1a1a',
                  border: '1px solid #2a2a2a',
                  borderRadius: '6px',
                  padding: '10px',
                  color: '#e0e0e0',
                }}
              />
              <input
                type="text"
                placeholder="Role"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                style={{
                  background: '#1a1a1a',
                  border: '1px solid #2a2a2a',
                  borderRadius: '6px',
                  padding: '10px',
                  color: '#e0e0e0',
                }}
              />
              <input
                type="text"
                placeholder="Company"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                style={{
                  background: '#1a1a1a',
                  border: '1px solid #2a2a2a',
                  borderRadius: '6px',
                  padding: '10px',
                  color: '#e0e0e0',
                }}
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                style={{
                  background: '#1a1a1a',
                  border: '1px solid #2a2a2a',
                  borderRadius: '6px',
                  padding: '10px',
                  color: '#e0e0e0',
                }}
              />
              <input
                type="text"
                placeholder="Phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                style={{
                  background: '#1a1a1a',
                  border: '1px solid #2a2a2a',
                  borderRadius: '6px',
                  padding: '10px',
                  color: '#e0e0e0',
                }}
              />
              <select
                value={formData.timezone}
                onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                style={{
                  background: '#1a1a1a',
                  border: '1px solid #2a2a2a',
                  borderRadius: '6px',
                  padding: '10px',
                  color: '#e0e0e0',
                }}
              >
                <option value="">Timezone</option>
                <option>EST</option>
                <option>CST</option>
                <option>MST</option>
                <option>PST</option>
                <option>UTC</option>
              </select>
            </div>
            <textarea
              placeholder="Notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              style={{
                width: '100%',
                marginTop: '16px',
                background: '#1a1a1a',
                border: '1px solid #2a2a2a',
                borderRadius: '6px',
                padding: '10px',
                color: '#e0e0e0',
                fontFamily: 'system-ui',
                minHeight: '80px',
              }}
            />
            <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
              <button
                type="submit"
                style={{
                  background: '#00ff41',
                  color: '#0a0a0a',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '10px 16px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '13px',
                }}
              >
                Save Contact
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                style={{
                  background: '#1a1a1a',
                  color: '#e0e0e0',
                  border: '1px solid #2a2a2a',
                  borderRadius: '6px',
                  padding: '10px 16px',
                  cursor: 'pointer',
                  fontSize: '13px',
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="category-tabs">
        {contactCategories.map((cat) => (
          <button
            key={cat}
            className={`tab ${selectedCategory === cat ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="contact-cards">
        {filteredContacts.map((contact) => (
          <div key={contact.id} className="contact-card">
            <div className="contact-header">
              <div className="contact-avatar">{getInitials(contact.name)}</div>
              <div>
                <div className="contact-name">{contact.name}</div>
                <div className="contact-role">{contact.role}</div>
              </div>
            </div>

            <div className="contact-detail">
              <div className="contact-label">Company</div>
              <div>{contact.company}</div>
            </div>

            <div className="contact-detail">
              <div className="contact-label">Email</div>
              <div style={{ fontSize: '12px', wordBreak: 'break-all' }}>{contact.email}</div>
            </div>

            <div className="contact-detail">
              <div className="contact-label">Phone</div>
              <div>{contact.phone}</div>
            </div>

            <div className="contact-detail">
              <div className="contact-label">Timezone</div>
              <div>{contact.timezone}</div>
            </div>

            {contact.notes && (
              <div className="contact-detail">
                <div className="contact-label">Notes</div>
                <div style={{ fontSize: '12px', color: '#888' }}>{contact.notes}</div>
              </div>
            )}

            <div className="contact-status">
              <div className="status-dot" style={{ background: '#00ff41' }}></div>
              {contact.status}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
