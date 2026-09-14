import React, { useState } from 'react';
import { generateBlog } from '../services/ai';
import { renderSafeMarkdown } from '../services/markdown';
import { 
  FileText, 
  Sparkles, 
  Copy, 
  Download, 
  Bookmark, 
  ShieldCheck, 
  Edit3, 
  Eye, 
  AlertCircle
} from 'lucide-react';

export default function BlogGenerator({ placeholders, onSaveHistory, setTab, setPreloadedSeoContent }) {
  // Form states
  const [topic, setTopic] = useState('');
  const [keywords, setKeywords] = useState('');
  const [tone, setTone] = useState('Informative');
  const [length, setLength] = useState('medium');
  const [audience, setAudience] = useState('Marketers & Business Owners');

  // Generator states
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [activeSubTab, setActiveSubTab] = useState('preview'); // preview, raw, meta
  const [editableContent, setEditableContent] = useState('');

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const blog = generateBlog(topic, keywords, tone, length, audience);
      const resolvedBlog = await blog;
      setResult(resolvedBlog);
      setEditableContent(resolvedBlog.content);
    } catch (error) {
      console.error(error);
      alert('Content generation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!result) return;
    navigator.clipboard.writeText(editableContent);
    alert('Copied blog post to clipboard!');
  };

  const downloadFile = (format) => {
    if (!result) return;
    const element = document.createElement("a");
    const file = new Blob([editableContent], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `${topic.trim().toLowerCase().replace(/\s+/g, '-')}.${format}`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleSave = () => {
    if (!result) return;
    const historyItem = {
      id: Date.now().toString(),
      type: 'blog',
      topic: topic,
      timestamp: new Date().toISOString(),
      saved: true,
      data: {
        title: result.title,
        content: editableContent,
        metaDescription: result.metaDescription,
        wordCount: editableContent.split(/\s+/).filter(w => w.length > 0).length,
        readingTime: Math.max(1, Math.ceil(editableContent.split(/\s+/).filter(w => w.length > 0).length / 200)),
        keywordsSuggested: result.keywordsSuggested
      }
    };
    onSaveHistory(historyItem);
    alert('Blog post saved to your History!');
  };

  const handleSeoOptimization = () => {
    if (!result) return;
    setPreloadedSeoContent({
      content: editableContent,
      keyword: keywords.split(',')[0]?.trim() || topic
    });
    setTab('seo');
  };

  const currentReadingTime = Math.max(1, Math.ceil(editableContent.split(/\s+/).filter(w => w.length > 0).length / 200));

  return (
    <div className="blog-generator animate-fade-in">
      <div className="generator-layout">
        
        {/* Left Side: Form Controls */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">
              <Sparkles size={18} style={{ color: 'var(--primary)' }} /> Configure Blog Post
            </h2>
          </div>

          <form onSubmit={handleGenerate}>
            <div className="form-group">
              <label className="form-label">Blog Topic / Focus Prompt</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder={placeholders?.blogTopic || "e.g. Topic..."} 
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Primary & Secondary Keywords (comma-separated)</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder={placeholders?.blogKeywords || "e.g. Keywords..."} 
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Target Audience</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder={placeholders?.blogAudience || "e.g. Audience..."} 
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Desired Word Length</label>
                <select 
                  className="form-select" 
                  value={length} 
                  onChange={(e) => setLength(e.target.value)}
                >
                  <option value="short">Short (~500 words)</option>
                  <option value="medium">Medium (~1000 words)</option>
                  <option value="long">Long (~1500+ words)</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Tone of Voice</label>
              <div className="tone-grid">
                {['Informative', 'Professional', 'Casual', 'Witty', 'Persuasive'].map(tName => (
                  <label key={tName} className="tone-container">
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
              <Sparkles size={16} /> Generate Blog Post
            </button>
          </form>
        </div>

        {/* Right Side: Output Preview */}
        <div className="card output-panel">
          {loading && (
            <div className="output-placeholder pulse-loading">
              <Sparkles size={48} className="pulse-loading" style={{ color: 'var(--primary)' }} />
              <h3>Synthesizing Content Outline...</h3>
              <p style={{ marginTop: '8px' }}>Drafting blog headings, aligning tone filters, and optimization criteria.</p>
            </div>
          )}

          {!loading && !result && (
            <div className="output-placeholder">
              <FileText size={48} />
              <h3>Awaiting Input Configuration</h3>
              <p style={{ marginTop: '8px' }}>Fill in the topic form on the left and click Generate to produce your article structure instantly.</p>
            </div>
          )}

          {!loading && result && (
            <div className="output-container animate-fade-in">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button 
                    className={`social-tab-btn ${activeSubTab === 'preview' ? 'active' : ''}`}
                    onClick={() => setActiveSubTab('preview')}
                  >
                    <Eye size={14} style={{ marginRight: '6px', display: 'inline' }} /> Preview
                  </button>
                  <button 
                    className={`social-tab-btn ${activeSubTab === 'raw' ? 'active' : ''}`}
                    onClick={() => setActiveSubTab('raw')}
                  >
                    <Edit3 size={14} style={{ marginRight: '6px', display: 'inline' }} /> Edit / Raw Markdown
                  </button>
                  <button 
                    className={`social-tab-btn ${activeSubTab === 'meta' ? 'active' : ''}`}
                    onClick={() => setActiveSubTab('meta')}
                  >
                    <AlertCircle size={14} style={{ marginRight: '6px', display: 'inline' }} /> Meta Tags & Keywords
                  </button>
                </div>

                <div className="btn-group">
                  <button className="btn btn-secondary btn-icon-only" title="Copy to Clipboard" onClick={copyToClipboard}>
                    <Copy size={15} />
                  </button>
                  <button className="btn btn-secondary btn-icon-only" title="Export as Markdown" onClick={() => downloadFile('md')}>
                    <Download size={15} />
                  </button>
                  <button className="btn btn-secondary btn-icon-only" title="Save to History" onClick={handleSave}>
                    <Bookmark size={15} />
                  </button>
                </div>
              </div>

              {/* Word Count Metrics */}
              <div className="output-meta-pills">
                <span className="meta-pill">
                  <strong>Estimated Words:</strong> {editableContent.split(/\s+/).filter(w => w.length > 0).length}
                </span>
                <span className="meta-pill">
                  <strong>Reading Time:</strong> {currentReadingTime} min
                </span>
                <span className="meta-pill">
                  <strong>Target Tone:</strong> {tone}
                </span>
                <span className="meta-pill">
                  <strong>Source:</strong> {result.source === 'ai' ? 'OpenAI' : 'Local Dataset'}
                </span>
              </div>

              {/* Sub-tabs Rendering */}
              <div className="output-body">
                {activeSubTab === 'preview' && (
                  <div className="markdown-body" dangerouslySetInnerHTML={renderSafeMarkdown(editableContent)} />
                )}

                {activeSubTab === 'raw' && (
                  <textarea
                    className="form-textarea"
                    style={{ height: '360px', width: '100%', fontFamily: 'var(--font-mono)', fontSize: '13px', background: 'transparent', border: 'none', resize: 'none' }}
                    value={editableContent}
                    onChange={(e) => setEditableContent(e.target.value)}
                  />
                )}

                {activeSubTab === 'meta' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div>
                      <h4 style={{ color: '#fff', fontSize: '14px', marginBottom: '8px', fontFamily: 'var(--font-outfit)', fontWeight: '600' }}>SEO Meta Title Suggestions:</h4>
                      <div style={{ padding: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-light)', borderRadius: '8px', fontSize: '13px' }}>
                        {result.title}
                      </div>
                    </div>
                    
                    <div>
                      <h4 style={{ color: '#fff', fontSize: '14px', marginBottom: '8px', fontFamily: 'var(--font-outfit)', fontWeight: '600' }}>SEO Meta Description:</h4>
                      <div style={{ padding: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-light)', borderRadius: '8px', fontSize: '13px', lineHeight: '1.5' }}>
                        {result.metaDescription}
                      </div>
                    </div>

                    <div>
                      <h4 style={{ color: '#fff', fontSize: '14px', marginBottom: '8px', fontFamily: 'var(--font-outfit)', fontWeight: '600' }}>Suggested Content Keywords:</h4>
                      <div className="pills-container">
                        {result.keywordsSuggested.map(k => (
                          <span key={k} className="hashtag-pill">{k}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Secondary CTA: Send to SEO Panel */}
              <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
                <button className="btn btn-primary" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', border: '1px solid rgba(59, 130, 246, 0.3)', boxShadow: 'none' }} onClick={handleSeoOptimization}>
                  <ShieldCheck size={16} /> Audit Content with SEO Optimizer
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
