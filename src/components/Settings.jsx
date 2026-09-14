import React, { useState, useEffect } from 'react';
import { 
  User, 
  Trash2,
  Check,
  Server,
  RefreshCw,
  CheckCircle,
  XCircle,
  Sparkles,
  ExternalLink,
  Zap
} from 'lucide-react';
import { checkPythonBackend } from '../services/ai';

export default function Settings({ history, onClearHistory, onSaveProfile }) {
  const [userName, setUserName] = useState(() => localStorage.getItem('creator_name') || 'Afsal');
  const [niche, setNiche] = useState(() => localStorage.getItem('creator_niche') || 'all');
  const [aiProvider, setAiProvider] = useState(() => localStorage.getItem('creator_ai_provider') || 'gemini');
  const [aiKey, setAiKey] = useState(() => localStorage.getItem('creator_ai_key') || localStorage.getItem('creator_openai_key') || '');
  const [aiModel, setAiModel] = useState(() => localStorage.getItem('creator_ai_model') || 'gemini-2.5-flash');

  // Test state
  const [testingKey, setTestingKey] = useState(false);
  const [testStatus, setTestStatus] = useState(null);

  // Python Engine status
  const [pythonStatus, setPythonStatus] = useState({ checking: true, online: false });
  const [preferPython, setPreferPython] = useState(() => localStorage.getItem('creator_prefer_python') !== 'false');

  const verifyPythonEngine = async () => {
    setPythonStatus({ checking: true, online: false });
    const res = await checkPythonBackend();
    setPythonStatus({ checking: false, ...res });
  };

  useEffect(() => {
    // oxlint-disable-next-line react/set-state-in-effect
    verifyPythonEngine();
  }, []);

  const handleTogglePreferPython = (val) => {
    setPreferPython(val);
    localStorage.setItem('creator_prefer_python', String(val));
  };

  const providerDefaults = {
    gemini: 'gemini-1.5-flash',
    groq: 'llama-3.1-8b-instant',
    openai: 'gpt-4o-mini',
  };

  const handleProviderChange = (provider) => {
    setAiProvider(provider);
    setAiModel(providerDefaults[provider] || 'gemini-2.5-flash');
  };

  const handleKeyChange = (val) => {
    setAiKey(val);
    const trimmed = val.trim();
    if (trimmed.startsWith('AIza')) {
      setAiProvider('gemini');
      setAiModel('gemini-2.5-flash');
    } else if (trimmed.startsWith('gsk_')) {
      setAiProvider('groq');
      setAiModel('llama-3.1-8b-instant');
    } else if (trimmed.startsWith('sk-')) {
      setAiProvider('openai');
      setAiModel('gpt-4o-mini');
    }
  };
  
  const handleSaveProfile = (e) => {
    e.preventDefault();
    localStorage.setItem('creator_name', userName);
    localStorage.setItem('creator_niche', niche);
    onSaveProfile(userName, niche);
    alert('Local profile updated successfully!');
  };

  const handleClearHistory = () => {
    if (window.confirm('Are you absolutely sure you want to clear your local history? This action cannot be undone.')) {
      onClearHistory();
      alert('Local history cleared.');
    }
  };

  const handleSaveAiSettings = (e) => {
    e.preventDefault();
    const keyTrimmed = aiKey.trim();
    const isKeySet = keyTrimmed.length > 5;
    localStorage.setItem('creator_ai_enabled', String(isKeySet));
    localStorage.setItem('creator_ai_provider', aiProvider);
    localStorage.setItem('creator_ai_key', keyTrimmed);
    localStorage.setItem('creator_ai_model', aiModel.trim() || providerDefaults[aiProvider] || 'gemini-2.5-flash');
    
    if (isKeySet) {
      alert(`Real AI Activated with ${aiProvider.toUpperCase()} (${aiModel})! Any topic you type will now be answered with true AI understanding.`);
    } else {
      alert('AI Key cleared. Switched back to smart local engine.');
    }
  };

  const handleTestAi = async () => {
    if (!aiKey.trim()) {
      alert('Please paste your API Key first before testing.');
      return;
    }
    setTestingKey(true);
    setTestStatus(null);
    try {
      const res = await fetch('http://127.0.0.1:8000/api/social', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: 'Smartphones and Laptops',
          platforms: ['twitter'],
          count: 1,
          api_key: aiKey.trim(),
          provider: aiProvider,
          model: aiModel.trim() || providerDefaults[aiProvider]
        })
      });
      if (res.ok) {
        setTestStatus({ ok: true, msg: 'Connected successfully! Real AI is active and responding.' });
      } else {
        const err = await res.text();
        setTestStatus({ ok: false, msg: `Connection failed (${res.status}): ${err}` });
      }
    } catch (err) {
      setTestStatus({ ok: false, msg: `Test failed: ${err.message}` });
    } finally {
      setTestingKey(false);
    }
  };

  return (
    <div className="settings-view animate-fade-in" style={{ maxWidth: '640px', margin: '0 auto' }}>

      {/* Real AI Provider Card */}
      <div className="card" style={{ marginBottom: '24px', border: '1px solid rgba(139, 92, 246, 0.4)', background: 'linear-gradient(135deg, rgba(20,20,35,0.85), rgba(139,92,246,0.12))' }}>
        <div className="card-header">
          <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Zap size={20} style={{ color: '#ec4899' }} />
            <span>Real AI Model Provider (Recommended)</span>
          </h2>
          {aiKey.trim().length > 5 ? (
            <span style={{ fontSize: '12px', background: 'rgba(16,185,129,0.15)', color: '#10b981', padding: '4px 10px', borderRadius: '12px', border: '1px solid rgba(16,185,129,0.3)', fontWeight: '600' }}>
              Real AI Active
            </span>
          ) : (
            <span style={{ fontSize: '12px', background: 'rgba(245,158,11,0.15)', color: '#f59e0b', padding: '4px 10px', borderRadius: '12px', border: '1px solid rgba(245,158,11,0.3)', fontWeight: '600' }}>
              Local Fallback
            </span>
          )}
        </div>

        <div style={{ padding: '4px 0 16px 0' }}>
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '10px', padding: '12px 14px', marginBottom: '18px', fontSize: '13px', lineHeight: '1.5' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', color: '#fff', fontWeight: '600' }}>
              <Sparkles size={16} style={{ color: 'var(--primary)' }} />
              <span>Get 100% Free Gemini API (Instant, No Credit Card)</span>
            </div>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>
              Google Gemini is completely free for creators. When enabled, your questions will receive authentic ChatGPT-grade intelligence for any topic (smartphones, laptops, SEO, programming, etc.).
            </p>
            <a 
              href="https://aistudio.google.com/app/apikey" 
              target="_blank" 
              rel="noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--primary)', fontWeight: '600', textDecoration: 'underline' }}
            >
              Get Free Gemini API Key on Google AI Studio <ExternalLink size={13} />
            </a>
          </div>

          <form onSubmit={handleSaveAiSettings}>
            <div className="form-group">
              <label className="form-label">AI Provider</label>
              <select
                className="form-select"
                value={aiProvider}
                onChange={(e) => handleProviderChange(e.target.value)}
              >
                <option value="gemini">Google Gemini (Recommended - 100% Free)</option>
                <option value="groq">Groq LLaMA (Free, Ultra Fast)</option>
                <option value="openai">OpenAI (ChatGPT)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">API Key</label>
              <input
                type="password"
                className="form-input"
                value={aiKey}
                onChange={(e) => handleKeyChange(e.target.value)}
                placeholder={aiProvider === 'gemini' ? 'AIzaSy... (Paste Gemini key here)' : aiProvider === 'groq' ? 'gsk_...' : 'sk-...'}
                autoComplete="off"
              />
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                Your API key stays stored securely in your browser's local memory.
              </span>
            </div>

            <div className="form-group">
              <label className="form-label">Model Identifier</label>
              <input
                type="text"
                className="form-input"
                value={aiModel}
                onChange={(e) => setAiModel(e.target.value)}
                placeholder={providerDefaults[aiProvider]}
              />
            </div>

            {testStatus && (
              <div style={{ 
                padding: '10px 14px', 
                borderRadius: '8px', 
                fontSize: '13px', 
                marginBottom: '14px',
                background: testStatus.ok ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                border: `1px solid ${testStatus.ok ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
                color: testStatus.ok ? '#10b981' : '#ef4444'
              }}>
                {testStatus.msg}
              </div>
            )}

            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={handleTestAi}
                disabled={testingKey}
                style={{ flex: '1' }}
              >
                <RefreshCw size={14} className={testingKey ? 'animate-spin' : ''} />
                <span>{testingKey ? 'Testing Connection...' : 'Test AI Connection'}</span>
              </button>
              
              <button type="submit" className="btn btn-primary" style={{ flex: '1' }}>
                <Check size={16} /> Save & Activate AI
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Python Local AI Backend Card */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="card-header">
          <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Server size={18} style={{ color: 'var(--primary)' }} />
            <span>Python Backend Engine Status</span>
          </h2>
          <button 
            type="button" 
            className="btn btn-secondary btn-icon-only" 
            onClick={verifyPythonEngine}
            title="Check backend status"
            style={{ width: '32px', height: '32px' }}
          >
            <RefreshCw size={14} className={pythonStatus.checking ? 'animate-spin' : ''} />
          </button>
        </div>

        <div style={{ padding: '4px 0 12px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            {pythonStatus.online ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', fontSize: '14px', fontWeight: '500' }}>
                <CheckCircle size={18} />
                <span>Backend Connected (Port 8000)</span>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f59e0b', fontSize: '14px', fontWeight: '500' }}>
                <XCircle size={18} />
                <span>Backend Offline (Run: python backend/run_server.py)</span>
              </div>
            )}
          </div>

          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '16px' }}>
            {pythonStatus.online ? (
              <>Engine: <strong>{pythonStatus.engine}</strong>. Handles Real AI model calls, tone styling, and Flesch readability audits.</>
            ) : (
              <>Launch the local Python backend server to enable native Python NLP content generation and real-time Flesch readability audits.</>
            )}
          </p>

          <div className="settings-row" style={{ paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <div>
              <h3 style={{ fontSize: '14px', fontWeight: '600' }}>Enable Python Engine</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                Routes generation and SEO scoring through your local Python FastAPI server.
              </p>
            </div>
            <label className="switch-label">
              <input
                type="checkbox"
                className="switch-input"
                checked={preferPython}
                onChange={(e) => handleTogglePreferPython(e.target.checked)}
              />
              <span className="switch-slider" />
            </label>
          </div>
        </div>
      </div>
      
      {/* Local Creator Profile */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="card-header">
          <h2 className="card-title">
            <User size={18} style={{ color: 'var(--primary)' }} /> Creator Profile
          </h2>
        </div>

        <form onSubmit={handleSaveProfile}>
          <div className="form-group">
            <label className="form-label">Creator / Pen Name</label>
            <input 
              type="text" 
              className="form-input" 
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Your name..."
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Default Focus Niche</label>
            <select 
              className="form-select"
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
            >
              <option value="all">All Specialties (Dynamic Mode)</option>
              <option value="tech">Technology & Cloud Computing</option>
              <option value="marketing">Digital Marketing & SEO</option>
              <option value="finance">Finance & Investment</option>
              <option value="health">Health & Nutrition</option>
              <option value="general">General / Lifestyle Writing</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
            <Check size={16} /> Save Profile Settings
          </button>
        </form>
      </div>

      {/* Danger Zone */}
      <div className="card" style={{ borderColor: 'rgba(239, 68, 68, 0.2)' }}>
        <div className="card-header">
          <h2 className="card-title" style={{ color: 'var(--danger)' }}>
            <Trash2 size={18} /> Storage & Data
          </h2>
        </div>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: '1.5' }}>
          Stored copies, history logs, and generated items are held locally inside your browser's secure cache. You can clear this data at any time.
        </p>
        <button 
          type="button"
          className="btn btn-danger" 
          onClick={handleClearHistory}
          disabled={history.length === 0}
        >
          <Trash2 size={16} /> Purge All Local History ({history.length} items)
        </button>
      </div>
    </div>
  );
}
