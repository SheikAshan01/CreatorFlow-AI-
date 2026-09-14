import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Share2, 
  TrendingUp, 
  Search, 
  History as HistoryIcon, 
  Settings as SettingsIcon,
  Sparkles,
  User,
  X,
  Copy
} from 'lucide-react';
import { renderSafeMarkdown } from './services/markdown';

import Dashboard from './components/Dashboard';
import BlogGenerator from './components/BlogGenerator';
import SocialGenerator from './components/SocialGenerator';
import SeoOptimizer from './components/SeoOptimizer';
import KeywordGenerator from './components/KeywordGenerator';
import History from './components/History';
import Settings from './components/Settings';

// Dynamic rotating placeholders database (3 options per niche, switching every 3 seconds)
const nichePlaceholders = {
  all: [
    {
      blogTopic: "e.g. How remote work is reshaping modern city life",
      blogKeywords: "e.g. remote work, urban planning, digital nomads",
      blogAudience: "e.g. General public, city planners",
      socialTopic: "e.g. Sharing 5 simple habits that changed my personal productivity",
      seoKeyword: "e.g. remote work productivity",
      seoContent: "Paste your general draft copy here to inspect search indicators...",
      keywordTopic: "e.g. sustainable travel, home hobbies"
    },
    {
      blogTopic: "e.g. The psychology behind impulse buying habits",
      blogKeywords: "e.g. consumer psychology, shopping habits, retail therapy",
      blogAudience: "e.g. Retail marketers, general consumers",
      socialTopic: "e.g. Did you know 60% of purchases are impulse? Here is why 👇",
      seoKeyword: "e.g. consumer impulse buying",
      seoContent: "Paste your consumer psychology draft here...",
      keywordTopic: "e.g. shopping trends, retail consumer habits"
    },
    {
      blogTopic: "e.g. Sustainable architecture in modern urban environments",
      blogKeywords: "e.g. green architecture, solar panels, urban ecosystems",
      blogAudience: "e.g. Eco advocates, civil engineers",
      socialTopic: "e.g. How solar roofs are transforming housing projects 🏡🌱",
      seoKeyword: "e.g. green building designs",
      seoContent: "Paste your green design post here to audit...",
      keywordTopic: "e.g. sustainable architecture, eco housing"
    }
  ],
  tech: [
    {
      blogTopic: "e.g. Benefits of automation in cloud infrastructure engineering",
      blogKeywords: "e.g. cloud optimization, DevOps, automation benefits",
      blogAudience: "e.g. Tech leads, cloud architects, developers",
      socialTopic: "e.g. Launching my new React web app designed for digital creators",
      seoKeyword: "e.g. React performance optimization",
      seoContent: "Paste your technical blog post or release notes here...",
      keywordTopic: "e.g. artificial intelligence, cloud architectures"
    },
    {
      blogTopic: "e.g. Understanding API security and JWT authentication",
      blogKeywords: "e.g. JWT token, token security, backend security",
      blogAudience: "e.g. Junior developers, security analysts",
      socialTopic: "e.g. Never store secrets in client-side code! Here is why 🔐",
      seoKeyword: "e.g. JWT API security guidelines",
      seoContent: "Paste your security blog post here to audit...",
      keywordTopic: "e.g. API security, web token authentication"
    },
    {
      blogTopic: "e.g. The impact of WebAssembly on modern browser applications",
      blogKeywords: "e.g. webassembly, JS compiler, high speed browser",
      blogAudience: "e.g. Frontend developers, gaming engineers",
      socialTopic: "e.g. WebAssembly is making browser games run at 60FPS! 🎮⚡",
      seoKeyword: "e.g. webassembly browser performance",
      seoContent: "Paste your web development article here...",
      keywordTopic: "e.g. WebAssembly coding, canvas rendering"
    }
  ],
  marketing: [
    {
      blogTopic: "e.g. How to structure a high-conversion email sales campaign",
      blogKeywords: "e.g. email marketing, conversion rates, CTA optimization",
      blogAudience: "e.g. E-commerce brand owners, growth marketers",
      socialTopic: "e.g. Introducing our brand rebranding strategy and identity values",
      seoKeyword: "e.g. local SEO ranking factors",
      seoContent: "Paste your marketing articles or sales copywriting draft here...",
      keywordTopic: "e.g. digital marketing trends, B2B lead generation"
    },
    {
      blogTopic: "e.g. 5 psychological triggers that drive landing page sales",
      blogKeywords: "e.g. scarcity bias, social proof, landing page layout",
      blogAudience: "e.g. UX designers, product copywriters",
      socialTopic: "e.g. Add testimonials above the fold to boost sales by 30%! 📈",
      seoKeyword: "e.g. landing page conversion design",
      seoContent: "Paste your landing page draft here...",
      keywordTopic: "e.g. growth hacking, UX copywriting tips"
    },
    {
      blogTopic: "e.g. The future of influencer marketing on short-form video",
      blogKeywords: "e.g. TikTok ads, micro influencers, viral marketing",
      blogAudience: "e.g. Brand managers, content creators",
      socialTopic: "e.g. Micro-influencers actually drive 20% higher ROI than celebrities! 🚀",
      seoKeyword: "e.g. short form video advertising",
      seoContent: "Paste your video marketing draft here...",
      keywordTopic: "e.g. TikTok advertising, brand collaborations"
    }
  ],
  finance: [
    {
      blogTopic: "e.g. Beginner guide to low-cost index fund investing",
      blogKeywords: "e.g. index funds, retirement budgets, compound interest",
      blogAudience: "e.g. Young professionals, passive income seekers",
      socialTopic: "e.g. 3 simple rules to build an emergency finance reserve",
      seoKeyword: "e.g. passive wealth compounding",
      seoContent: "Paste your financial breakdown or budget advice article here...",
      keywordTopic: "e.g. stock market investing, personal finance budgets"
    },
    {
      blogTopic: "e.g. Understanding compound interest: The eighth wonder",
      blogKeywords: "e.g. compounding interest, savings rate, financial freedom",
      blogAudience: "e.g. High school graduates, budget beginners",
      socialTopic: "e.g. If you save $10 a day at 8% interest, look what happens in 30 years 💰✨",
      seoKeyword: "e.g. compound interest wealth creation",
      seoContent: "Paste your compound interest guide here...",
      keywordTopic: "e.g. saving habits, long term investing"
    },
    {
      blogTopic: "e.g. Cryptocurrencies vs. traditional gold as inflation hedges",
      blogKeywords: "e.g. gold standard, Bitcoin halving, inflation store of value",
      blogAudience: "e.g. Macro investors, crypto enthusiasts",
      socialTopic: "e.g. Is Bitcoin really digital gold or just high-risk speculation? 🪙🤔",
      seoKeyword: "e.g. inflation hedging assets",
      seoContent: "Paste your asset comparison post here...",
      keywordTopic: "e.g. cryptocurrency hedge, gold assets"
    }
  ],
  health: [
    {
      blogTopic: "e.g. The role of sleep hygiene in cognitive recovery",
      blogKeywords: "e.g. sleep architecture, deep sleep, stress management",
      blogAudience: "e.g. Fitness enthusiasts, corporate professionals",
      socialTopic: "e.g. Quick meal prep routines to save time and eat healthy",
      seoKeyword: "e.g. circadian rhythm optimization",
      seoContent: "Paste your fitness tips, diet guidelines, or mental wellness post here...",
      keywordTopic: "e.g. home workouts, healthy nutrition guidelines"
    },
    {
      blogTopic: "e.g. Benefits of high-intensity interval training (HIIT)",
      blogKeywords: "e.g. HIIT workouts, fat loss, cardiovascular stamina",
      blogAudience: "e.g. Busy parents, gym novices",
      socialTopic: "e.g. Short on time? 15 minutes of HIIT does wonders for metabolism! 🔥🏃",
      seoKeyword: "e.g. HIIT exercise routines",
      seoContent: "Paste your workout tips draft here...",
      keywordTopic: "e.g. interval training, fat burning exercises"
    },
    {
      blogTopic: "e.g. Mindfulness meditation for corporate stress management",
      blogKeywords: "e.g. workplace stress, breathing exercises, mental clarity",
      blogAudience: "e.g. HR managers, office employees",
      socialTopic: "e.g. 5 minutes of focused breathing before meetings stops burnout! 🧘💻",
      seoKeyword: "e.g. workplace mindfulness stress relief",
      seoContent: "Paste your meditation guide here...",
      keywordTopic: "e.g. breathing exercises, stress relief guides"
    }
  ],
  general: [
    {
      blogTopic: "e.g. Finding balance: 5 habits of mindful lifestyle living",
      blogKeywords: "e.g. mindfulness, daily habits, lifestyle balance",
      blogAudience: "e.g. Everyday readers, lifestyle enthusiasts",
      socialTopic: "e.g. My top book recommendations for self-development this month",
      seoKeyword: "e.g. mindful habits daily",
      seoContent: "Paste your general lifestyle story or hobby post here...",
      keywordTopic: "e.g. daily hobbies, travel plans"
    },
    {
      blogTopic: "e.g. The benefits of solo travel for personal confidence",
      blogKeywords: "e.g. solo backpacking, cultural immersion, self discovery",
      blogAudience: "e.g. Adventurous youth, remote workers",
      socialTopic: "e.g. Traveling alone forces you to find yourself. Here is my story 🗺️✈️",
      seoKeyword: "e.g. solo travel advantages",
      seoContent: "Paste your travel journal draft here...",
      keywordTopic: "e.g. backpacker guides, cultural travel"
    },
    {
      blogTopic: "e.g. Designing a minimal clutter-free home office setup",
      blogKeywords: "e.g. minimal desk setup, ergonomic chair, study space",
      blogAudience: "e.g. Remote writers, interior designers",
      socialTopic: "e.g. A clean workspace equals a clean mind. Rate my minimal desk! 🖥️✨",
      seoKeyword: "e.g. minimal home office layouts",
      seoContent: "Paste your home office decoration draft here...",
      keywordTopic: "e.g. ergonomic setup, minimal decor ideas"
    }
  ]
};

export default function App() {
  const [tab, setTab] = useState('dashboard');
  const [history, setHistory] = useState(() => {
    const savedHistory = localStorage.getItem('creatorflow_history');
    if (!savedHistory) return [];
    try {
      return JSON.parse(savedHistory);
    } catch (e) {
      console.error('Failed to parse history', e);
      return [];
    }
  });
  const [preloadedSeoContent, setPreloadedSeoContent] = useState(null);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState(null);
  const [profileName, setProfileName] = useState(() => localStorage.getItem('creator_name') || 'Afsal');
  const [niche, setNiche] = useState(() => localStorage.getItem('creator_niche') || 'all');
  
  // State for rotating placeholder options
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  // Setup interval to rotate placeholders every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const [hasRealAi, setHasRealAi] = useState(() => {
    const k = localStorage.getItem('creator_ai_key') || localStorage.getItem('creator_openai_key') || '';
    return k.trim().length > 5;
  });

  // Sync profile name and niche modifications dynamically
  useEffect(() => {
    const handleStorageChange = () => {
      const savedName = localStorage.getItem('creator_name');
      if (savedName) setProfileName(savedName);
      const savedNiche = localStorage.getItem('creator_niche');
      if (savedNiche) setNiche(savedNiche);
      const k = localStorage.getItem('creator_ai_key') || localStorage.getItem('creator_openai_key') || '';
      setHasRealAi(k.trim().length > 5);
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleSaveHistoryItem = (item) => {
    const updated = [item, ...history];
    setHistory(updated);
    localStorage.setItem('creatorflow_history', JSON.stringify(updated));
  };

  const handleDeleteHistoryItem = (id) => {
    const updated = history.filter(item => item.id !== id);
    setHistory(updated);
    localStorage.setItem('creatorflow_history', JSON.stringify(updated));
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem('creatorflow_history');
  };

  const handleSaveProfile = (name, newNiche) => {
    setProfileName(name);
    setNiche(newNiche);
  };

  const viewHistoryItem = (item) => {
    setSelectedHistoryItem(item);
  };

  const closeHistoryItemModal = () => {
    setSelectedHistoryItem(null);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied content to clipboard!');
  };

  // Sidebar Menu Items
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { id: 'blog', label: 'Blog Generator', icon: <FileText size={18} /> },
    { id: 'social', label: 'Social Captions', icon: <Share2 size={18} /> },
    { id: 'seo', label: 'SEO Optimizer', icon: <TrendingUp size={18} /> },
    { id: 'keywords', label: 'Keyword Finder', icon: <Search size={18} /> },
    { id: 'history', label: 'Saved History', icon: <HistoryIcon size={18} /> },
    { id: 'settings', label: 'Settings', icon: <SettingsIcon size={18} /> }
  ];

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-icon">
            <Sparkles size={20} style={{ color: '#fff' }} />
          </div>
          <span className="logo-text">CreatorFlow AI</span>
        </div>

        <nav className="sidebar-menu">
          {menuItems.map(item => (
            <div key={item.id} className="menu-item">
              <button 
                className={`menu-btn ${tab === item.id ? 'active' : ''}`}
                onClick={() => setTab(item.id)}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            </div>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="sidebar-footer">
          <div className="demo-badge" style={hasRealAi ? { background: 'rgba(16,185,129,0.15)', borderColor: 'rgba(16,185,129,0.35)', color: '#10b981' } : {}}>
            <Sparkles size={13} />
            <span>{hasRealAi ? 'Real AI Active' : 'Local Engine'}</span>
          </div>
        </div>
      </aside>

      {/* Main Panel Content Area */}
      <main className="main-content">
        <header className="content-header">
          <div className="header-title-container">
            <h1>
              {tab === 'dashboard' && 'Creative Workspace'}
              {tab === 'blog' && 'AI Blog Article Writer'}
              {tab === 'social' && 'Social Caption Generator'}
              {tab === 'seo' && 'Linguistic SEO Analysis'}
              {tab === 'keywords' && 'Keywords & Tags Research'}
              {tab === 'history' && 'Saved Content Hub'}
              {tab === 'settings' && 'System Config'}
            </h1>
            <p>
              {tab === 'dashboard' && 'Monitor recent copies, generate templates, and inspect SEO metrics.'}
              {tab === 'blog' && 'Compose full articles, outlines, and summaries instantly.'}
              {tab === 'social' && 'Draft emoji-rich marketing posts tailored for platform guidelines.'}
              {tab === 'seo' && 'Score your draft readability index and check keyword placements.'}
              {tab === 'keywords' && 'Extract keywords volumes, intent tags, and relevant hashtags.'}
              {tab === 'history' && 'Explore, review, copy, and purge your locally saved outputs.'}
              {tab === 'settings' && 'Manage your local system profile preferences and storage.'}
            </p>
          </div>

          <div className="header-meta">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 14px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-light)', borderRadius: '12px', fontSize: '13px' }}>
              <User size={14} style={{ color: 'var(--primary)' }} />
              <span style={{ fontWeight: '500', color: '#fff' }}>{profileName}</span>
            </div>
          </div>
        </header>

        {/* Current Tab Render */}
        {(() => {
          const currentNicheList = nichePlaceholders[niche] || nichePlaceholders.all;
          const currentPlaceholders = currentNicheList[placeholderIndex] || currentNicheList[0];
          
          return (
            <>
              {tab === 'dashboard' && (
                <Dashboard 
                  history={history} 
                  setTab={setTab} 
                  viewHistoryItem={viewHistoryItem} 
                />
              )}
              {tab === 'blog' && (
                <BlogGenerator 
                  placeholders={currentPlaceholders}
                  onSaveHistory={handleSaveHistoryItem} 
                  setTab={setTab}
                  setPreloadedSeoContent={setPreloadedSeoContent}
                />
              )}
              {tab === 'social' && (
                <SocialGenerator 
                  placeholders={currentPlaceholders}
                  onSaveHistory={handleSaveHistoryItem} 
                />
              )}
              {tab === 'seo' && (
                <SeoOptimizer 
                  placeholders={currentPlaceholders}
                  preloadedSeoContent={preloadedSeoContent}
                  clearPreloadedContent={() => setPreloadedSeoContent(null)}
                />
              )}
              {tab === 'keywords' && (
                <KeywordGenerator 
                  placeholders={currentPlaceholders}
                />
              )}
              {tab === 'history' && (
                <History 
                  history={history} 
                  onDeleteHistoryItem={handleDeleteHistoryItem} 
                  viewHistoryItem={viewHistoryItem}
                />
              )}
              {tab === 'settings' && (
                <Settings 
                  history={history} 
                  onClearHistory={handleClearHistory} 
                  onSaveProfile={handleSaveProfile}
                />
              )}
            </>
          );
        })()}
      </main>

      {/* History Details Modal Overlay */}
      {selectedHistoryItem && (
        <div className="modal-overlay animate-fade-in" onClick={closeHistoryItemModal}>
          <div className="card modal-content" onClick={(e) => e.stopPropagation()} style={{ background: '#0e0f14', border: '1px solid var(--border-light)', width: '90%', maxWidth: '720px' }}>
            <div className="card-header" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '16px' }}>
              <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className={`type-tag ${selectedHistoryItem.type}`}>
                  {selectedHistoryItem.type}
                </span>
                <span>
                  {selectedHistoryItem.type === 'blog' ? 'Saved Blog Post Details' : 'Saved Social Caption'}
                </span>
              </h2>
              <button className="btn btn-secondary btn-icon-only" style={{ width: '32px', height: '32px' }} onClick={closeHistoryItemModal}>
                <X size={16} />
              </button>
            </div>

            <div style={{ padding: '20px 0', maxHeight: '50vh', overflowY: 'auto' }}>
              {selectedHistoryItem.type === 'blog' ? (
                <div>
                  <div className="output-meta-pills" style={{ marginBottom: '20px' }}>
                    <span className="meta-pill"><strong>Words:</strong> {selectedHistoryItem.data.wordCount || 0}</span>
                    <span className="meta-pill"><strong>Reading Time:</strong> {selectedHistoryItem.data.readingTime || 1} min</span>
                    {selectedHistoryItem.data.keywordsSuggested && (
                      <span className="meta-pill"><strong>Keywords:</strong> {selectedHistoryItem.data.keywordsSuggested.join(', ')}</span>
                    )}
                  </div>
                  
                  {selectedHistoryItem.data.metaDescription && (
                    <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-light)', padding: '12px 16px', borderRadius: '10px', fontSize: '13px', marginBottom: '20px', lineHeight: '1.5' }}>
                      <strong style={{ color: 'var(--primary)' }}>Meta Description:</strong> {selectedHistoryItem.data.metaDescription}
                    </div>
                  )}

                  <div className="markdown-body" dangerouslySetInnerHTML={renderSafeMarkdown(selectedHistoryItem.data.content)} />
                </div>
              ) : (
                <div>
                  <div className="output-meta-pills" style={{ marginBottom: '20px' }}>
                    <span className="meta-pill" style={{ textTransform: 'capitalize' }}>
                      <strong>Platform:</strong> {selectedHistoryItem.data.platform}
                    </span>
                    <span className="meta-pill">
                      <strong>Tone:</strong> {selectedHistoryItem.data.tone}
                    </span>
                  </div>

                  <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-light)', padding: '20px', borderRadius: '14px', fontSize: '14px', whiteSpace: 'pre-wrap', lineHeight: '1.6', color: '#f3f4f6' }}>
                    {selectedHistoryItem.data.caption}
                  </div>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '16px', marginTop: '12px', gap: '12px' }}>
              <button 
                className="btn btn-secondary" 
                onClick={() => {
                  const txt = selectedHistoryItem.type === 'blog' 
                    ? selectedHistoryItem.data.content 
                    : selectedHistoryItem.data.caption;
                  copyToClipboard(txt);
                }}
              >
                <Copy size={14} /> Copy Full Text
              </button>
              <button className="btn btn-primary" onClick={closeHistoryItemModal}>
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
