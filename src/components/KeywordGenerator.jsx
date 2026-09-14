import React, { useState } from 'react';
import { generateKeywords } from '../services/ai';
import { 
  Search, 
  Sparkles, 
  Copy, 
  Hash, 
  Layers
} from 'lucide-react';

export default function KeywordGenerator({ placeholders }) {
  const [topic, setTopic] = useState('');
  const [intent, setIntent] = useState('informational');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [activeSubTab, setActiveSubTab] = useState('keywords'); // keywords, hashtags

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const data = generateKeywords(topic, intent);
      setResult(await data);
    } catch (error) {
      console.error(error);
      alert('Keyword generation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert(`Copied "${text}" to clipboard!`);
  };

  const copyAllHashtags = () => {
    if (!result) return;
    const allTags = [
      ...(result.hashtags?.highVolume || []),
      ...(result.hashtags?.mediumVolume || []),
      ...(result.hashtags?.lowVolume || [])
    ].join(' ');
    navigator.clipboard.writeText(allTags);
    alert('Copied all hashtags to clipboard!');
  };

  const getDiffClass = (diff) => {
    return `diff-badge ${diff.toLowerCase()}`;
  };

  return (
    <div className="keyword-generator animate-fade-in">
      <div className="generator-layout">
        
        {/* Left Form */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">
              <Search size={18} style={{ color: 'var(--primary)' }} /> Keyword Research
            </h2>
          </div>

          <form onSubmit={handleGenerate}>
            <div className="form-group">
              <label className="form-label">Search Topic / Focus Niche</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder={placeholders?.keywordTopic || "e.g. Topic..."} 
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Search Intent Objective</label>
              <select 
                className="form-select" 
                value={intent} 
                onChange={(e) => setIntent(e.target.value)}
              >
                <option value="informational">Informational (How to, Guides, Explanations)</option>
                <option value="transactional">Transactional (Commercial buy lists, comparisons)</option>
                <option value="general">General (Broad term exploration)</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '12px' }}>
              <Sparkles size={16} /> Research Keywords
            </button>
          </form>
        </div>

        {/* Right Output */}
        <div className="card output-panel">
          {loading && (
            <div className="output-placeholder pulse-loading">
              <Search size={48} className="pulse-loading" style={{ color: 'var(--primary)' }} />
              <h3>Querying Niche Directories...</h3>
              <p style={{ marginTop: '8px' }}>Scanning keyword volumes, indexing difficulties, and grouping tag tiers.</p>
            </div>
          )}

          {!loading && !result && (
            <div className="output-placeholder">
              <Search size={48} />
              <h3>Keyword & Hashtag Output</h3>
              <p style={{ marginTop: '8px' }}>Perform instant organic keyword analysis. Explore search intents and gather highly engaging tags.</p>
            </div>
          )}

          {!loading && result && (
            <div className="output-container animate-fade-in">
              
              {/* Selector Tabs */}
              <div className="social-output-tabs" style={{ marginBottom: '16px' }}>
                <button 
                  className={`social-tab-btn ${activeSubTab === 'keywords' ? 'active' : ''}`}
                  onClick={() => setActiveSubTab('keywords')}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Layers size={14} /> Keywords
                </button>
                <button 
                  className={`social-tab-btn ${activeSubTab === 'hashtags' ? 'active' : ''}`}
                  onClick={() => setActiveSubTab('hashtags')}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Hash size={14} /> Hashtags
                </button>
              </div>

              {/* Keywords Content */}
              {activeSubTab === 'keywords' && (() => {
                const primary = result.primary || (result.keywords && result.keywords[0]) || { kw: topic || 'Target Keyword', vol: '1.2K - 5.5K (Est.)', diff: 'Medium' };
                const secondary = result.secondary || (result.keywords && result.keywords.slice(1)) || [];
                return (
                  <div className="output-body" style={{ background: 'transparent', border: 'none', padding: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', background: 'rgba(139, 92, 246, 0.05)', border: '1px solid rgba(139, 92, 246, 0.15)', borderRadius: '12px', marginBottom: '20px' }}>
                      <div>
                        <span style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Primary Target Term</span>
                        <h4 style={{ fontSize: '16px', color: '#fff', fontWeight: '700', marginTop: '2px' }}>{primary.kw}</h4>
                      </div>
                      <div style={{ display: 'flex', gap: '16px', textAlign: 'right' }}>
                        <div>
                          <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Est. Volume</span>
                          <div style={{ fontSize: '14px', fontWeight: '600', color: '#fff' }}>{primary.vol}</div>
                        </div>
                        <div>
                          <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Diff</span>
                          <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--warning)' }}>{primary.diff}</div>
                        </div>
                      </div>
                    </div>

                    <div className="table-container">
                      <table className="kw-table">
                        <thead>
                          <tr>
                            <th>Related Keyword</th>
                            <th>Monthly Volume</th>
                            <th>Difficulty</th>
                            <th>Est. CPC</th>
                            <th style={{ textAlign: 'right' }}>Copy</th>
                          </tr>
                        </thead>
                        <tbody>
                          {secondary.map((item, idx) => (
                            <tr key={idx}>
                              <td className="kw-text">{item.kw}</td>
                              <td>{item.vol}</td>
                              <td>
                                <span className={getDiffClass(item.diff || 'Medium')}>{item.diff || 'Medium'}</span>
                              </td>
                              <td>{item.cpc}</td>
                              <td style={{ textAlign: 'right' }}>
                                <button 
                                  className="btn btn-secondary btn-icon-only" 
                                  style={{ width: '28px', height: '28px' }}
                                  onClick={() => copyToClipboard(item.kw)}
                                >
                                  <Copy size={12} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })()}

              {/* Hashtags Content */}
              {activeSubTab === 'hashtags' && (() => {
                const highTags = result.hashtags?.highVolume || [];
                const medTags = result.hashtags?.mediumVolume || [];
                const lowTags = result.hashtags?.lowVolume || [];
                return (
                  <div className="output-body" style={{ background: 'transparent', border: 'none', padding: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
                      <button className="btn btn-secondary" onClick={copyAllHashtags}>
                        <Copy size={14} /> Copy All Tags
                      </button>
                    </div>

                    <div className="keyword-result-sections">
                      <div className="hashtag-group">
                        <h4>High Volume (Broad Reach)</h4>
                        <div className="pills-container">
                          {highTags.map(tag => (
                            <span key={tag} className="hashtag-pill" onClick={() => copyToClipboard(tag)}>{tag}</span>
                          ))}
                        </div>
                      </div>

                      <div className="hashtag-group">
                        <h4>Medium Volume (Strategic Target)</h4>
                        <div className="pills-container">
                          {medTags.map(tag => (
                            <span key={tag} className="hashtag-pill" onClick={() => copyToClipboard(tag)}>{tag}</span>
                          ))}
                        </div>
                      </div>

                      <div className="hashtag-group">
                        <h4>Low Volume (Niche Conversions)</h4>
                        <div className="pills-container">
                          {lowTags.map(tag => (
                            <span key={tag} className="hashtag-pill" onClick={() => copyToClipboard(tag)}>{tag}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}

            </div>
          )}
        </div>
      </div>
    </div>
  );
}
