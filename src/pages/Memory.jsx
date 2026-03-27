import { useState, useEffect } from 'react';
import { initialMemories, categories } from '../data/memories';

export function Memory() {
  const [memories, setMemories] = useState(initialMemories);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedMemory, setSelectedMemory] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('memories');
    if (saved) {
      setMemories(JSON.parse(saved));
    }
  }, []);

  const filteredMemories = memories.filter((memory) => {
    const matchesSearch =
      memory.title.toLowerCase().includes(search.toLowerCase()) ||
      memory.preview.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || memory.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px', color: '#e0e0e0' }}>
        Memory — Knowledge Base
      </h1>

      <div className="search-bar">
        <input
          type="text"
          className="search-input"
          placeholder="Search documents..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="category-tabs">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`tab ${selectedCategory === cat ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {selectedMemory ? (
        <div>
          <button
            style={{
              background: 'none',
              border: 'none',
              color: '#00ff41',
              cursor: 'pointer',
              marginBottom: '16px',
              fontSize: '13px',
              fontWeight: '600',
            }}
            onClick={() => setSelectedMemory(null)}
          >
            ← Back to library
          </button>
          <div className="memory-detail">
            <div className="memory-detail-title">{selectedMemory.title}</div>
            <div style={{ fontSize: '12px', color: '#888', marginBottom: '16px', textTransform: 'uppercase' }}>
              Category: {selectedMemory.category}
            </div>
            <div className="memory-detail-content">{selectedMemory.content}</div>
          </div>
        </div>
      ) : (
        <>
          {filteredMemories.length > 0 ? (
            <div className="memory-cards">
              {filteredMemories.map((memory) => (
                <div
                  key={memory.id}
                  className="memory-card"
                  onClick={() => setSelectedMemory(memory)}
                >
                  <div className="memory-title">{memory.title}</div>
                  <div className="memory-category">{memory.category}</div>
                  <div className="memory-preview">{memory.preview}</div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#888' }}>
              <div style={{ fontSize: '16px', marginBottom: '8px' }}>No documents found</div>
              <div style={{ fontSize: '12px' }}>Try adjusting your search or category filters</div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
