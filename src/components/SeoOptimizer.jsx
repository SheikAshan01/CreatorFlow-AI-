import React, { useState, useEffect } from 'react';
import { analyzeSEO } from '../services/ai';
import { 
  TrendingUp, 
  CheckCircle, 
  AlertTriangle, 
  XCircle
} from 'lucide-react';

export default function SeoOptimizer({ placeholders, preloadedSeoContent, clearPreloadedContent }) {
  const [keyword, setKeyword] = useState('');
  const [metaDesc, setMetaDesc] = useState('');
  const [content, setContent] = useState('');
  const [analysis, setAnalysis] = useState(null);

  // If there's preloaded content from BlogGenerator, populate and run
  useEffect(() => {
    if (preloadedSeoContent) {
      // oxlint-disable-next-line react/set-state-in-effect
      setKeyword(preloadedSeoContent.keyword || '');
      setContent(preloadedSeoContent.content || '');
      
      const runInitial = async () => {
        const initialAnalysis = await analyzeSEO(
          preloadedSeoContent.content,
          preloadedSeoContent.keyword || '',
          ''
        );
        setAnalysis(initialAnalysis);
      };
      runInitial();
      
      // Clear it so it doesn't overwrite user edits if they navigate back
      clearPreloadedContent();
    }
  }, [preloadedSeoContent, clearPreloadedContent]);

  const handleAnalyze = async (e) => {
    if (e) e.preventDefault();
    const result = await analyzeSEO(content, keyword, metaDesc);
    setAnalysis(result);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#10b981'; // Green
    if (score >= 50) return '#f59e0b'; // Amber
    return '#ef4444'; // Red
  };

  // Radial progress calculations
  const strokeRadius = 38;
  const strokeCircumference = 2 * Math.PI * strokeRadius;
  const strokeOffset = analysis 
    ? strokeCircumference - (analysis.score / 100) * strokeCircumference 
    : strokeCircumference;

  return (
    <div className="seo-optimizer animate-fade-in">
      <div className="generator-layout">
        
        {/* Left Input Section */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">
              <TrendingUp size={18} style={{ color: 'var(--primary)' }} /> SEO Optimization Audit
            </h2>
          </div>

          <form onSubmit={handleAnalyze}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Focus Keyword</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder={placeholders?.seoKeyword || "e.g. Keyword..."} 
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Meta Description Draft (Optional)</label>
              <textarea 
                className="form-input" 
                style={{ minHeight: '60px', height: '60px' }}
                placeholder="Brief summary shown in Google search results (120-160 characters)..." 
                value={metaDesc}
                onChange={(e) => setMetaDesc(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Article / Post Body Content</label>
              <textarea 
                className="form-textarea" 
                style={{ minHeight: '260px' }}
                placeholder={placeholders?.seoContent || "Paste your content here..."} 
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              <TrendingUp size={16} /> Analyze SEO Signals
            </button>
          </form>
        </div>

        {/* Right Output checklist */}
        <div className="card output-panel">
          {!analysis && (
            <div className="output-placeholder">
              <TrendingUp size={48} />
              <h3>Search Optimization Console</h3>
              <p style={{ marginTop: '8px' }}>Paste draft copy and set your target search term. The analyzer checks readability, tags, and keyword placement instantly.</p>
            </div>
          )}

          {analysis && (
            <div className="seo-results-panel animate-fade-in">
              
              {/* Radial Metrics */}
              <div className="seo-metrics-row">
                <div className="seo-radial-container">
                  <svg className="seo-radial-svg">
                    <circle 
                      className="seo-radial-circle-bg"
                      cx="50" 
                      cy="50" 
                      r={strokeRadius}
                    />
                    <circle 
                      className="seo-radial-circle-fill"
                      cx="50" 
                      cy="50" 
                      r={strokeRadius}
                      strokeDasharray={strokeCircumference}
                      strokeDashoffset={strokeOffset}
                      style={{ stroke: getScoreColor(analysis.score) }}
                    />
                  </svg>
                  <div className="seo-radial-text" style={{ color: getScoreColor(analysis.score) }}>
                    {analysis.score}
                  </div>
                </div>

                <div className="seo-radial-desc">
                  <h3>SEO Grade Score</h3>
                  <p>
                    {analysis.score >= 80 ? 'Excellent! Content is fully optimized for organic indexing.' :
                     analysis.score >= 50 ? 'Moderate. A few tweaks can significantly improve search performance.' :
                     'Suboptimal. Critical keywords are missing or density is too low.'}
                  </p>
                </div>
              </div>

              {/* Checklist Cards */}
              <div>
                <h3 style={{ fontFamily: 'var(--font-outfit)', fontSize: '15px', fontWeight: '600', color: '#fff', marginBottom: '14px' }}>
                  Signal Audit Checklist
                </h3>

                <div className="seo-checklist">
                  {analysis.checklist.map((item, index) => (
                    <div key={index} className={`seo-check-item ${item.status}`}>
                      <div className="seo-check-icon">
                        {item.status === 'pass' && <CheckCircle size={16} />}
                        {item.status === 'warn' && <AlertTriangle size={16} />}
                        {item.status === 'fail' && <XCircle size={16} />}
                      </div>
                      <div>{item.label}</div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}
