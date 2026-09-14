import React, { useState } from 'react';
import { generateSocialCaptions } from '../services/ai';
import { 
  Share2, 
  Sparkles, 
  Copy, 
  Bookmark, 
  AlertCircle
} from 'lucide-react';

export default function SocialGenerator({ placeholders, onSaveHistory }) {
  // Form states
  const [topic, setTopic] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState(['linkedin', 'twitter']);
  const [tone, setTone] = useState('Professional');
  const [count, setCount] = useState(3);

  // Generator states
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null); // { linkedin: [...], twitter: [...] }
  const [activePlatformTab, setActivePlatformTab] = useState('');

  const togglePlatform = (plat) => {
    if (selectedPlatforms.includes(plat)) {
      if (selectedPlatforms.length > 1) {
        setSelectedPlatforms(selectedPlatforms.filter(p => p !== plat));
      }
    } else {
      setSelectedPlatforms([...selectedPlatforms, plat]);
    }
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const captions = generateSocialCaptions(topic, selectedPlatforms, tone, count);
      setResult(await captions);
      setActivePlatformTab(selectedPlatforms[0]);
    } catch (error) {
      console.error(error);
      alert('Caption generation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied caption to clipboard!');
  };

  const handleSaveItem = (platform, text, index) => {
    const historyItem = {
      // oxlint-disable-next-line react/purity
      id: `${Date.now()}-${platform}-${index}`,
      type: 'social',
      topic: topic,
      timestamp: new Date().toISOString(),
      saved: true,
      data: {
        platform: platform,
        caption: text,
        tone: tone
      }
    };
    onSaveHistory(historyItem);
    alert('Caption saved to your History!');
  };

  const getPlatformIcon = (plat, size = 16) => {
    const p = plat.toLowerCase();
    if (p === 'twitter') {
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      );
    }
    if (p === 'linkedin') {
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
        </svg>
      );
    }
    if (p === 'instagram') {
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
        </svg>
      );
    }
    if (p === 'facebook') {
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
          <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
        </svg>
      );
    }
    return <Share2 size={size} />;
  };

  const getCharLimit = (plat) => {
    const p = plat.toLowerCase();
    if (p === 'twitter') return 280;
    if (p === 'linkedin') return 3000;
    if (p === 'instagram') return 2200;
    return 5000;
  };

  return (
    <div className="social-generator animate-fade-in">
      <div className="generator-layout">
        
        {/* Left Side: Forms */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">
              <Share2 size={18} style={{ color: 'var(--primary)' }} /> Configure Captions
            </h2>
          </div>

          <form onSubmit={handleGenerate}>
            <div className="form-group">
              <label className="form-label">Core Message / Topic</label>
              <textarea 
                className="form-textarea" 
                placeholder={placeholders?.socialTopic || "What is your post about? e.g. Topic..."} 
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Target Social Platforms (Select multiple)</label>
              <div className="platform-grid">
                {[
                  { id: 'linkedin', label: 'LinkedIn' },
                  { id: 'twitter', label: 'X (Twitter)' },
                  { id: 'instagram', label: 'Instagram' },
                  { id: 'facebook', label: 'Facebook' }
                ].map(plat => (
                  <div key={plat.id}>
                    <input 
                      type="checkbox" 
                      id={`p-${plat.id}`}
                      className="platform-checkbox"
                      checked={selectedPlatforms.includes(plat.id)}
                      onChange={() => togglePlatform(plat.id)}
                    />
                    <label htmlFor={`p-${plat.id}`} className="platform-label">
                      {getPlatformIcon(plat.id, 20)}
                      <span>{plat.label}</span>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Variations Count</label>
                <select 
                  className="form-select" 
                  value={count} 
                  onChange={(e) => setCount(Number(e.target.value))}
                >
                  <option value={1}>1 Option</option>
                  <option value={3}>3 Options</option>
                  <option value={5}>5 Options</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Brand Tone</label>
              <div className="tone-grid">
                {['Hype', 'Professional', 'Casual', 'Witty', 'Bold'].map(tName => (
                  <label key={tName}>
                    <input 
                      type="radio" 
                      name="tone" 
                      className="tone-radio" 
                      value={tName} 
                      checked={tone === tName}
                      onChange={() => setTone(tName)}
                    />
                    <span className="tone-label">{tName}</span>
                  </label>
                ))}
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '12px' }}>
              <Sparkles size={16} /> Generate Captions
            </button>
          </form>
        </div>

        {/* Right Side: Output */}
        <div className="card output-panel">
          {loading && (
            <div className="output-placeholder pulse-loading">
              <Share2 size={48} className="pulse-loading" style={{ color: 'var(--primary)' }} />
              <h3>Drafting Platform Captions...</h3>
              <p style={{ marginTop: '8px' }}>Crafting post layouts, optimizing emoji usage, and compiling hashtags.</p>
            </div>
          )}

          {!loading && !result && (
            <div className="output-placeholder">
              <Share2 size={48} />
              <h3>Captions Preview Panel</h3>
              <p style={{ marginTop: '8px' }}>Create captions matching your brand guidelines. Select platform tabs to view output once generated.</p>
            </div>
          )}

          {!loading && result && (
            <div className="output-container animate-fade-in">
              
              {/* Platform Tabs */}
              <div className="social-output-tabs">
                {selectedPlatforms.map(plat => (
                  <button 
                    key={plat}
                    className={`social-tab-btn ${activePlatformTab === plat ? 'active' : ''}`}
                    onClick={() => setActivePlatformTab(plat)}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                  >
                    {getPlatformIcon(plat, 14)}
                    <span style={{ textTransform: 'capitalize' }}>{plat}</span>
                  </button>
                ))}
              </div>

              {/* Captions List */}
              <div className="output-body" style={{ background: 'transparent', border: 'none', padding: 0 }}>
                {result[activePlatformTab]?.map((caption, index) => {
                  const limit = getCharLimit(activePlatformTab);
                  const isOverLimit = caption.length > limit;

                  return (
                    <div key={index} className="social-caption-card">
                      <div className="caption-text">{caption}</div>
                      
                      <div className="caption-actions">
                        <span 
                          className="char-counter"
                          style={{ color: isOverLimit ? 'var(--danger)' : 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}
                        >
                          {isOverLimit && <AlertCircle size={12} />}
                          {caption.length} / {limit} characters
                        </span>
                        
                        <div className="btn-group">
                          <button 
                            className="btn btn-secondary" 
                            style={{ padding: '6px 12px', fontSize: '12px' }}
                            onClick={() => copyToClipboard(caption)}
                          >
                            <Copy size={12} /> Copy
                          </button>
                          <button 
                            className="btn btn-secondary" 
                            style={{ padding: '6px 12px', fontSize: '12px' }}
                            onClick={() => handleSaveItem(activePlatformTab, caption, index)}
                          >
                            <Bookmark size={12} /> Save
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}
