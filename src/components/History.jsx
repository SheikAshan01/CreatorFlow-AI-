import React, { useState } from 'react';
import { 
  History as HistoryIcon,
  Search, 
  Trash2, 
  Copy, 
  Eye
} from 'lucide-react';

export default function History({ history, onDeleteHistoryItem, viewHistoryItem }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');

  const filteredHistory = history.filter(item => {
    // Filter by type
    if (filterType !== 'all' && item.type !== filterType) return false;
    
    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const topicMatch = item.topic?.toLowerCase().includes(q);
      const titleMatch = item.type === 'blog' && item.data.title?.toLowerCase().includes(q);
      const contentMatch = item.type === 'blog' 
        ? item.data.content?.toLowerCase().includes(q) 
        : item.data.caption?.toLowerCase().includes(q);
      
      return topicMatch || titleMatch || contentMatch;
    }
    
    return true;
  });

  const getFriendlyTitle = (item) => {
    if (item.type === 'blog') return item.data.title || `Blog on: ${item.topic}`;
    if (item.type === 'social') return `Social Posts: ${item.topic}`;
    return item.topic;
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied content to clipboard!');
  };

  return (
    <div className="history-view animate-fade-in">
      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="history-filters">
          <div className="form-group" style={{ flexGrow: 1, marginBottom: 0 }}>
            <div style={{ position: 'relative' }}>
              <input 
                type="text" 
                className="form-input history-search-input" 
                style={{ paddingLeft: '44px' }}
                placeholder="Search saved content history..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              className={`btn ${filterType === 'all' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '10px 16px', fontSize: '13px' }}
              onClick={() => setFilterType('all')}
            >
              All Types
            </button>
            <button 
              className={`btn ${filterType === 'blog' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '10px 16px', fontSize: '13px' }}
              onClick={() => setFilterType('blog')}
            >
              Blogs
            </button>
            <button 
              className={`btn ${filterType === 'social' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '10px 16px', fontSize: '13px' }}
              onClick={() => setFilterType('social')}
            >
              Social Posts
            </button>
          </div>
        </div>
      </div>

      {filteredHistory.length === 0 ? (
        <div className="card empty-state">
          <HistoryIcon size={48} />
          <h3>No Content Found</h3>
          <p style={{ marginTop: '8px' }}>
            {history.length === 0 
              ? "You haven't generated or saved any content yet." 
              : "No saved items match your search query filters."}
          </p>
        </div>
      ) : (
        <div className="history-grid">
          {filteredHistory.map(item => (
            <div key={item.id} className="card history-card animate-fade-in">
              <div className="history-card-body">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span className={`type-tag ${item.type}`}>
                    {item.type}
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    {new Date(item.timestamp).toLocaleDateString()}
                  </span>
                </div>

                <h3>{getFriendlyTitle(item)}</h3>
                <p>
                  {item.type === 'blog' 
                    ? item.data.content?.substring(0, 180).replace(/[#*_]/g, '') + '...' 
                    : item.data.caption}
                </p>
              </div>

              <div className="history-card-footer">
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  {item.type === 'blog' 
                    ? `${item.data.wordCount || 0} words` 
                    : `${item.data.platform || 'social'} post`}
                </div>
                
                <div className="btn-group">
                  <button className="btn btn-secondary btn-icon-only" title="View Item" onClick={() => viewHistoryItem(item)}>
                    <Eye size={14} />
                  </button>
                  <button className="btn btn-secondary btn-icon-only" title="Copy Content" onClick={() => {
                    const txt = item.type === 'blog' ? item.data.content : item.data.caption;
                    copyToClipboard(txt);
                  }}>
                    <Copy size={14} />
                  </button>
                  <button className="btn btn-secondary btn-icon-only" style={{ color: 'var(--danger)', borderColor: 'rgba(239, 68, 68, 0.2)' }} title="Delete" onClick={() => onDeleteHistoryItem(item.id)}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
