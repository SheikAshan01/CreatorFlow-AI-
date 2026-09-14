import React from 'react';
import { 
  FileText, 
  Share2, 
  Search, 
  TrendingUp, 
  History as HistoryIcon,
  Copy, 
  ArrowRight,
  Eye
} from 'lucide-react';

export default function Dashboard({ history, setTab, viewHistoryItem }) {
  // Compute Stats
  const totalItems = history.length;
  
  const totalWords = history.reduce((acc, item) => {
    if (item.type === 'blog') {
      return acc + (item.data.wordCount || 0);
    }
    // Social media captions word estimate
    if (item.type === 'social') {
      return acc + (item.data.caption || '').split(/\s+/).filter(w => w.length > 0).length;
    }
    return acc;
  }, 0);

  const stats = [
    {
      id: 'docs',
      title: 'Total Items Written',
      value: totalItems,
      icon: <FileText size={24} />,
      color: '#8b5cf6'
    },
    {
      id: 'words',
      title: 'Estimated Words Generated',
      value: totalWords.toLocaleString(),
      icon: <TrendingUp size={24} />,
      color: '#d946ef'
    },
    {
      id: 'history',
      title: 'Saved in History',
      value: history.filter(item => item.saved).length,
      icon: <HistoryIcon size={24} />,
      color: '#3b82f6'
    }
  ];

  const quickTools = [
    {
      tab: 'blog',
      title: 'Blog Post Writer',
      desc: 'Create SEO-optimized long-form articles, post outlines, and meta-descriptions instantly.',
      icon: <FileText size={20} />
    },
    {
      tab: 'social',
      title: 'Social Captions Generator',
      desc: 'Draft catchy, platform-ready captions for LinkedIn, X (Twitter), Instagram, and Facebook.',
      icon: <Share2 size={20} />
    },
    {
      tab: 'seo',
      title: 'SEO Post Optimizer',
      desc: 'Grade your text, perform keyword density audits, and improve readability scores.',
      icon: <TrendingUp size={20} />
    },
    {
      tab: 'keywords',
      title: 'Keyword & Tag Finder',
      desc: 'Discover related search terms, volume estimates, CPC values, and relevant hashtags.',
      icon: <Search size={20} />
    }
  ];

  const recentItems = history.slice(0, 5);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied content to clipboard!');
  };

  const getFriendlyTitle = (item) => {
    if (item.type === 'blog') return item.data.title || `Blog on: ${item.topic}`;
    if (item.type === 'social') return `Social Posts: ${item.topic}`;
    if (item.type === 'seo') return `SEO Audit: ${item.topic}`;
    if (item.type === 'keywords') return `Keywords for: ${item.topic}`;
    return item.topic;
  };

  const getTypeClass = (type) => {
    return `type-tag ${type}`;
  };

  return (
    <div className="dashboard-view animate-fade-in">
      {/* Welcome Banner */}
      <div className="card" style={{ marginBottom: '32px', background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(217, 70, 239, 0.05) 100%)', borderColor: 'rgba(139, 92, 246, 0.2)' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '800', fontFamily: 'var(--font-outfit)', marginBottom: '8px', color: '#fff' }}>
          Welcome back to CreatorFlow AI
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: '1.5', maxWidth: '600px' }}>
          Your client-side content suite is fully ready. Create, analyze, and optimize articles and social captions instantly. No external logins, no active subscription, 100% private.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="dashboard-grid">
        {stats.map(stat => (
          <div key={stat.id} className="card stat-card">
            <div className="stat-icon" style={{ color: stat.color }}>
              {stat.icon}
            </div>
            <div className="stat-details">
              <h3>{stat.title}</h3>
              <p>{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Section */}
      <div className="dashboard-sections">
        {/* Recent Creations */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="card-header">
            <h2 className="card-title">
              <HistoryIcon size={18} /> Recent Creations
            </h2>
            {history.length > 5 && (
              <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={() => setTab('history')}>
                View All
              </button>
            )}
          </div>

          <div style={{ flexGrow: 1 }}>
            {recentItems.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
                <p>No recent items found. Try generating a blog or social post!</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {recentItems.map(item => (
                  <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-light)', borderRadius: '12px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxWidth: '70%' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span className={getTypeClass(item.type)}>{item.type}</span>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                          {new Date(item.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                      <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {getFriendlyTitle(item)}
                      </h4>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="btn btn-secondary btn-icon-only" title="View Item" onClick={() => viewHistoryItem(item)}>
                        <Eye size={16} />
                      </button>
                      <button className="btn btn-secondary btn-icon-only" title="Copy Content" onClick={() => {
                        const txt = item.type === 'blog' ? item.data.content : JSON.stringify(item.data);
                        copyToClipboard(txt);
                      }}>
                        <Copy size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Tools */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Quick Toolkit</h2>
          </div>
          <div className="tools-grid">
            {quickTools.map(tool => (
              <div key={tool.tab} className="tool-tile" onClick={() => setTab(tool.tab)}>
                <div className="tool-tile-icon">
                  {tool.icon}
                </div>
                <h3>{tool.title}</h3>
                <p>{tool.desc}</p>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px', color: 'var(--primary)' }}>
                  <ArrowRight size={16} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
