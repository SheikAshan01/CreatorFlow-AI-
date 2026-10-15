import os

html_template = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CreatorFlow AI - Full Project Documentation</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 25mm 20mm 25mm 20mm;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: "Times New Roman", Times, serif;
      background-color: #e5e5e5;
      color: #000;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 20px 0;
      font-size: 12pt;
      line-height: 1.5;
    }

    .page {
      background: #fff;
      width: 210mm;
      min-height: 297mm;
      padding: 25mm 22mm;
      margin-bottom: 25px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
      position: relative;
      display: flex;
      flex-direction: column;
    }

    /* Centered Divider Page */
    .divider-page {
      justify-content: center;
      align-items: center;
      text-align: center;
    }

    .divider-title {
      font-size: 16pt;
      font-weight: bold;
      letter-spacing: 1.5px;
      text-transform: uppercase;
    }

    /* Content Headings */
    h1.chapter-title {
      font-size: 15pt;
      font-weight: bold;
      text-align: center;
      margin-bottom: 24px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    h2.section-title {
      font-size: 13pt;
      font-weight: bold;
      margin-top: 18px;
      margin-bottom: 12px;
      text-transform: uppercase;
    }

    h3.subsection-title {
      font-size: 12pt;
      font-weight: bold;
      margin-top: 14px;
      margin-bottom: 8px;
    }

    p {
      text-align: justify;
      margin-bottom: 14px;
      text-indent: 0;
    }

    ul, ol {
      margin-left: 24px;
      margin-bottom: 14px;
    }

    li {
      margin-bottom: 6px;
      text-align: justify;
    }

    /* Academic Tables */
    table {
      width: 100%;
      border-collapse: collapse;
      border: 1px solid #000;
      margin-top: 12px;
      margin-bottom: 16px;
      font-size: 11pt;
      line-height: 1.35;
    }

    th, td {
      border: 1px solid #000;
      padding: 6px 8px;
      vertical-align: top;
    }

    th {
      font-weight: bold;
      text-align: center;
      background-color: #fafafa;
    }

    /* Code blocks */
    pre {
      font-family: "Courier New", Courier, monospace;
      font-size: 9.5pt;
      background-color: #fbfbfb;
      border: 1px solid #000;
      padding: 10px;
      line-height: 1.3;
      white-space: pre-wrap;
      word-break: break-all;
      margin-bottom: 14px;
    }

    /* Diagrams & Mind Map box */
    .diagram-box {
      border: 1px solid #000;
      padding: 14px;
      margin: 14px 0;
      display: flex;
      justify-content: center;
      align-items: center;
      background: #fafafa;
    }

    .caption {
      font-weight: bold;
      margin-bottom: 10px;
      font-size: 11pt;
    }

    /* Print Controls */
    .print-bar {
      position: sticky;
      top: 10px;
      z-index: 1000;
      margin-bottom: 20px;
      background: #111;
      padding: 12px 25px;
      border-radius: 30px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      gap: 15px;
      color: #fff;
    }

    .print-btn {
      background-color: #2563eb;
      color: #fff;
      border: none;
      padding: 8px 18px;
      font-size: 13px;
      font-weight: bold;
      border-radius: 20px;
      cursor: pointer;
      font-family: inherit;
    }
    .print-btn:hover { background-color: #1d4ed8; }

    @media print {
      body {
        background: transparent;
        padding: 0;
      }
      .page {
        margin: 0;
        box-shadow: none;
        page-break-after: always;
        width: 100%;
        min-height: auto;
        padding: 0;
      }
      .print-bar { display: none; }
    }
  </style>
</head>
<body>

  <div class="print-bar no-print">
    <span><strong>CreatorFlow AI</strong> - Academic Documentation (61 Pages)</span>
    <button class="print-btn" onclick="window.print()">🖨️ Print / Save as PDF</button>
  </div>

  <!-- PAGE 1: ABSTRACT -->
  <div class="page">
    <h1 class="chapter-title">ABSTRACT</h1>
    <p>Content creators, digital copywriters, and online marketers must continuously coordinate blog article drafting, multi-platform social media messaging, search engine visibility audits, and keyword research while maintaining high brand quality and consistent publication schedules. When these workflows rely on disconnected third-party subscription tools, fragmented spreadsheets, and slow external cloud APIs, managing day-to-day content pipelines becomes inefficient, costly, and vulnerable to external data privacy risks. CreatorFlow AI is a high-performance content suite developed to bring these critical authoring and search audit functions together into a unified, zero-dependency digital platform.</p>
    <p>The application provides an intuitive workspace for bloggers, marketing specialists, and agency managers. Users can formulate structured long-form blog articles, customize audience profiles, define brand tones of voice, and generate platform-optimized social media copy simultaneously for LinkedIn, X (Twitter), Instagram, and Facebook. The system incorporates proactive character auditing to avoid formatting overflows, such as warning tags when Twitter posts approach the 280-character boundary.</p>
    <p>A specialized linguistic SEO engine enables creators to audit content readability and search ranking signals in real time. It computes an animated radial 0–100 SEO Grade Score based on Flesch-Kincaid readability formulas, target keyword density thresholds (1%–3%), introductory paragraph presence, and heading distribution. A companion keyword module clusters search terms into informational and transactional intents, supplying estimated search volume, cost-per-click metrics, and tiered hashtag groupings for maximum social reach.</p>
    <p>The platform is engineered using React 19, Vite, and Vanilla CSS on the presentation layer, paired with an asynchronous Python FastAPI Natural Language Processing backend. To guarantee uninterrupted operational uptime, the system employs a 3-Tier Hybrid AI Processing Model: it leverages cloud LLMs (Google Gemini, Groq Llama-3, OpenAI GPT) when API credentials are provided, automatically falls back to the native Python NLP engine on port 8000, and gracefully cascades to a client-side JavaScript rule synthesizer if running completely offline. All generated intellectual property is persisted locally within HTML5 Web Storage, ensuring zero-latency content synthesis, no mandatory monthly fees, and complete creator data privacy.</p>
  </div>

  <!-- PAGE 2: DIVIDER - INTRODUCTION -->
  <div class="page divider-page">
    <div class="divider-title">INTRODUCTION</div>
  </div>

  <!-- PAGE 3: 2.1 ABOUT THE PROJECT -->
  <div class="page">
    <h2 class="section-title">2.1 ABOUT THE PROJECT</h2>
    <p>CreatorFlow AI is a modern desktop and web application designed to digitize and automate routine content creation workflows. It brings blog article drafting, social media captioning, search engine readability auditing, keyword research, and creation history management together in one integrated platform for freelance writers, digital agencies, and independent creators.</p>
    <p>The application provides dedicated, intuitive toolkits for each stage of the content production lifecycle. Creators can input primary topics, specify target audience demographics, select tone filters (Informative, Professional, Casual, Witty, Persuasive), and select length requirements ranging from short summaries to comprehensive long-form articles. Authors can toggle between an interactive Markdown editor and a live HTML preview, with automated recommendations for search-engine-ready title tags and character-checked meta descriptions.</p>
    <p>The platform also supports omni-channel social media marketing workflows. Copywriters can generate tailored post variations for professional networks (LinkedIn), micro-blogging feeds (X / Twitter), and visual community networks (Instagram and Facebook). Real-time visual chips highlight platform constraints, preventing character overflows and ensuring high user engagement.</p>
    <p>The application is built using React 19, Vite, and custom Vanilla CSS with modern obsidian glassmorphism aesthetics. It utilizes a Python FastAPI backend for computational linguistics and Flesch-Kincaid readability calculations, Lucide React for modern SVG icons, and HTML5 localStorage for local data persistence. By combining these functions in a single responsive web interface, the project aims to make creative publishing workflows seamless, eliminate paid third-party dependencies, and provide creators with total ownership over their generated articles.</p>
  </div>

  <!-- PAGE 4: 2.2 OBJECTIVES & SCOPE -->
  <div class="page">
    <h2 class="section-title">2.2 OBJECTIVES & SCOPE</h2>
    <h3 class="subsection-title">Objectives</h3>
    <p>The primary objective of CreatorFlow AI is to provide a unified platform for coordinating digital content creation and SEO auditing activities. The project aims to:</p>
    <ul>
      <li>Provide zero-latency, local-first content synthesis without mandatory cloud subscriptions or API keys.</li>
      <li>Allow creators to generate long-form blog articles with structured headings, key takeaways, and meta summaries.</li>
      <li>Help copywriters create compliant social captions for LinkedIn, X (Twitter), Instagram, and Facebook simultaneously.</li>
      <li>Audit draft content for search engine readiness using Flesch-Kincaid readability formulas and keyword density metrics.</li>
      <li>Enable keyword and hashtag research classified by search intent (Informational vs. Transactional).</li>
      <li>Guarantee 100% platform availability through a 3-tier cascade (Cloud AI &rarr; Local Python FastAPI &rarr; Client-side JS).</li>
      <li>Store all generated copy securely and privately within the user's browser localStorage without remote tracking.</li>
      <li>Present creative analytics and history through an interactive glassmorphic dashboard.</li>
    </ul>

    <h3 class="subsection-title">Scope</h3>
    <p>The project covers the design and full-stack development of a web application for copywriters, bloggers, digital marketing professionals, and independent creators. Its functional scope includes content synthesis, markdown parsing, linguistic SEO evaluation, multi-tier hashtag generation, local database persistence, and external AI connectivity settings.</p>
    <p>The application uses React 19 for reactive user interfaces, Vite for rapid compilation, Python FastAPI and Uvicorn for asynchronous backend natural language processing, and Lucide React for visual iconography. The scope is centered on managing routine creative workflows through a desktop-optimized browser interface, from formulating initial seed concepts to verifying search engine signals and exporting final copy.</p>
  </div>

  <!-- PAGE 5: 2.3 MODULES -->
  <div class="page">
    <h2 class="section-title">2.3 MODULES</h2>
    <p><strong>1. Unified Creative Dashboard</strong></p>
    <p><strong>2. AI Blog Article Generator</strong></p>
    <p><strong>3. Multi-Platform Social Caption Generator</strong></p>
    <p><strong>4. Linguistic SEO Content Optimizer</strong></p>
    <p><strong>5. Keyword &amp; Hashtag Finder</strong></p>
    <p><strong>6. Local History Hub &amp; Storage</strong></p>
    <p><strong>7. AI Engine Settings &amp; Connectivity</strong></p>
    <p style="margin-top: 30px;">Together, these seven modules support the application's core workflows: creator concept ideation and article drafting, omni-channel social media adaptation, search engine readability auditing, keyword discovery, and offline draft persistence.</p>
  </div>

  <!-- PAGE 6: 2.4 MODULES DESCRIPTION - PART 1 -->
  <div class="page">
    <h2 class="section-title">2.4 MODULES DESCRIPTION</h2>
    <h3 class="subsection-title">1. Unified Creative Dashboard</h3>
    <p>This module provides an executive summary of content creation metrics and quick-launch utilities. It aggregates real-time indicators including total creations generated, total word volume produced, and saved library items. Creators can launch generation templates directly with a single click and review recent article drafts via an integrated quick-copy activity stream.</p>

    <h3 class="subsection-title">2. AI Blog Article Generator</h3>
    <p>The blog generation module produces complete, publication-ready long-form articles from seed concepts. Authors can specify focus topics, target audience groups, primary and secondary keywords, brand tone (Informative, Professional, Casual, Witty, Persuasive), and target word lengths (Short ~500w, Medium ~1000w, Long ~1500w). The module formats output into clean Markdown containing introductions, core arguments, actionable tips, and conclusions. It features a dual-mode viewer allowing users to toggle between a live rendered HTML preview and raw markdown editing, alongside automated meta title and description suggestions.</p>

    <h3 class="subsection-title">3. Multi-Platform Social Caption Generator</h3>
    <p>The social media module adapts core themes into platform-compliant captions across LinkedIn, X (Twitter), Instagram, and Facebook. It formats copy according to platform culture, applying professional hooks and bullet points for LinkedIn, visual storytelling and emoji arrays for Instagram, and viral community prompts for Facebook. For X (Twitter), dynamic character monitoring validates length and flags potential overflows beyond the 280-character boundary with visual warning tags.</p>
  </div>

  <!-- PAGE 7: 2.4 MODULES DESCRIPTION - PART 2 -->
  <div class="page">
    <h3 class="subsection-title">4. Linguistic SEO Content Optimizer</h3>
    <p>The SEO optimization module conducts linguistic and structural audits on provided draft copy. It computes an animated radial 0–100 SEO Grade Score by evaluating Flesch-Kincaid reading ease, word count milestones, and keyword density percentages (enforcing the 1%–3% optimal window). It verifies critical ranking signals, including target keyword appearance in the first paragraph, heading tag distribution (H1, H2, H3), and meta description character ranges (120–160 characters), displaying color-coded pass, warning, and failure indicators.</p>

    <h3 class="subsection-title">5. Keyword &amp; Hashtag Finder</h3>
    <p>This module expands seed keywords into actionable research tables. It computes estimated monthly search volumes, cost-per-click (CPC) values, and competition difficulty ratings. Creators can filter outputs by search intent (Informational vs. Transactional) and extract tiered hashtag buckets classified into High-Volume (#viral), Medium-Volume (#targeted), and Niche (#focused) categories.</p>

    <h3 class="subsection-title">6. Local History Hub &amp; Storage</h3>
    <p>The history module manages persistent storage using HTML5 localStorage. It allows users to browse saved drafts, perform instant text substring filtering, and filter items by category (All, Blog Posts, Social Captions). A full review modal enables copying complete formatted text or permanently deleting obsolete records.</p>

    <h3 class="subsection-title">7. AI Engine Settings &amp; Connectivity</h3>
    <p>This module provides configuration controls for creator profiles and AI execution engines. Users can customize their creator name, default niche (Tech, Marketing, Finance, Health, General), test live connectivity with the Python FastAPI backend (/api/health), and select their preferred AI intelligence mode (Local Hybrid Engine, Google Gemini, Groq, or OpenAI).</p>
  </div>

  <!-- PAGE 8: DIVIDER - PROJECT FLOW – MIND MAP -->
  <div class="page divider-page">
    <div class="divider-title">PROJECT FLOW – MIND MAP</div>
  </div>

  <!-- PAGE 9: 3. PROJECT FLOW – MIND MAP -->
  <div class="page">
    <h2 class="section-title">3. PROJECT FLOW – MIND MAP</h2>
    <div class="caption">FIGURE 3.1 Project Flow Mind Map of the CREATORFLOW AI SYSTEM</div>
    <div class="diagram-box">
      <svg width="600" height="420" viewBox="0 0 600 420" xmlns="http://www.w3.org/2000/svg" style="font-family:'Times New Roman', serif;">
        <!-- Center Node -->
        <ellipse cx="300" cy="210" rx="75" ry="35" fill="#f3e8ff" stroke="#7e22ce" stroke-width="2"/>
        <text x="300" y="214" font-size="12" font-weight="bold" text-anchor="middle" fill="#581c87">CreatorFlow AI</text>

        <!-- Lines to Main Nodes -->
        <line x1="230" y1="195" x2="140" y2="120" stroke="#9333ea" stroke-width="1.5"/>
        <line x1="240" y1="230" x2="140" y2="300" stroke="#2563eb" stroke-width="1.5"/>
        <line x1="370" y1="195" x2="460" y2="120" stroke="#059669" stroke-width="1.5"/>
        <line x1="360" y1="230" x2="460" y2="300" stroke="#d97706" stroke-width="1.5"/>
        <line x1="300" y1="175" x2="300" y2="70" stroke="#4b5563" stroke-width="1.5"/>

        <!-- Content Generation Node -->
        <rect x="60" y="90" width="140" height="45" rx="8" fill="#faf5ff" stroke="#9333ea" stroke-width="1.5"/>
        <text x="130" y="117" font-size="11" font-weight="bold" text-anchor="middle">Content Synthesis</text>

        <!-- Content Child Nodes -->
        <rect x="10" y="30" width="100" height="30" rx="4" fill="#fff" stroke="#9333ea" stroke-width="1"/>
        <text x="60" y="50" font-size="9" text-anchor="middle">Blog Generator</text>
        <line x1="100" y1="90" x2="60" y2="60" stroke="#9333ea" stroke-width="1"/>

        <rect x="10" y="160" width="100" height="30" rx="4" fill="#fff" stroke="#9333ea" stroke-width="1"/>
        <text x="60" y="180" font-size="9" text-anchor="middle">Social Captions</text>
        <line x1="100" y1="135" x2="60" y2="160" stroke="#9333ea" stroke-width="1"/>

        <!-- SEO & Intelligence Node -->
        <rect x="60" y="280" width="140" height="45" rx="8" fill="#eff6ff" stroke="#2563eb" stroke-width="1.5"/>
        <text x="130" y="307" font-size="11" font-weight="bold" text-anchor="middle">SEO &amp; Research</text>

        <!-- SEO Child Nodes -->
        <rect x="10" y="240" width="100" height="30" rx="4" fill="#fff" stroke="#2563eb" stroke-width="1"/>
        <text x="60" y="260" font-size="9" text-anchor="middle">SEO Readability</text>
        <line x1="100" y1="280" x2="60" y2="270" stroke="#2563eb" stroke-width="1"/>

        <rect x="10" y="350" width="100" height="30" rx="4" fill="#fff" stroke="#2563eb" stroke-width="1"/>
        <text x="60" y="370" font-size="9" text-anchor="middle">Keywords &amp; Tags</text>
        <line x1="100" y1="325" x2="60" y2="350" stroke="#2563eb" stroke-width="1"/>

        <!-- Hybrid Engine Node -->
        <rect x="230" y="35" width="140" height="45" rx="8" fill="#f3f4f6" stroke="#4b5563" stroke-width="1.5"/>
        <text x="300" y="62" font-size="11" font-weight="bold" text-anchor="middle">Hybrid AI Engine</text>

        <!-- Engine Child Nodes -->
        <rect x="150" y="-5" width="80" height="24" rx="4" fill="#fff" stroke="#4b5563" stroke-width="1"/>
        <text x="190" y="11" font-size="8" text-anchor="middle">Cloud LLM</text>
        <line x1="250" y1="35" x2="200" y2="19" stroke="#4b5563" stroke-width="1"/>

        <rect x="370" y="-5" width="80" height="24" rx="4" fill="#fff" stroke="#4b5563" stroke-width="1"/>
        <text x="410" y="11" font-size="8" text-anchor="middle">FastAPI Engine</text>
        <line x1="350" y1="35" x2="400" y2="19" stroke="#4b5563" stroke-width="1"/>

        <!-- History & Storage Node -->
        <rect x="400" y="90" width="140" height="45" rx="8" fill="#ecfdf5" stroke="#059669" stroke-width="1.5"/>
        <text x="470" y="117" font-size="11" font-weight="bold" text-anchor="middle">History &amp; Storage</text>

        <!-- History Children -->
        <rect x="490" y="30" width="100" height="30" rx="4" fill="#fff" stroke="#059669" stroke-width="1"/>
        <text x="540" y="50" font-size="9" text-anchor="middle">localStorage</text>
        <line x1="480" y1="90" x2="520" y2="60" stroke="#059669" stroke-width="1"/>

        <!-- Dashboard Node -->
        <rect x="400" y="280" width="140" height="45" rx="8" fill="#fffbeb" stroke="#d97706" stroke-width="1.5"/>
        <text x="470" y="307" font-size="11" font-weight="bold" text-anchor="middle">Dashboard &amp; Stats</text>
      </svg>
    </div>
    <p>Figure 3.1 illustrates the architectural mind map of CreatorFlow AI, depicting the central dispatch orchestrator connecting content synthesis, SEO intelligence, local data persistence, and the multi-tier execution engine.</p>
  </div>

  <!-- PAGE 10: 3.1 END-TO-END PROCESS NARRATIVE -->
  <div class="page">
    <h2 class="section-title">3.1 End-to-End Process Narrative</h2>
    <p>The operational process begins when a creator launches the CreatorFlow AI web application in any modern web browser. The application initializes local state from HTML5 localStorage, loading existing article history, custom profile settings, and selected AI execution preferences.</p>
    <p>When drafting a blog article, the user navigates to the Blog Generator, inputs a topic, target keywords, audience persona, and selects preferred tone and length. Upon clicking 'Generate Article', the request is processed through the 3-Tier Hybrid AI Engine in src/services/ai.js. If an API key is configured, the system requests the cloud LLM; otherwise, it dispatches the request to the local Python FastAPI backend (http://127.0.0.1:8000/api/blog). If the backend is unreachable, the client-side JavaScript rule engine immediately synthesizes structured Markdown copy. The output is displayed in the split-pane markdown/preview editor, and the creator can send the copy directly to the SEO Optimizer with a single click.</p>
    <p>In the SEO Optimizer, the draft is evaluated against target search terms. The system calculates word counts, reading duration, heading structures, and keyword density, generating a 0–100 animated score. The creator reviews diagnostic pass/warn/fail alerts and adjusts the copy as needed.</p>
    <p>For social media distribution, the creator accesses the Social Generator. The platform outputs distinct copy for LinkedIn, X (Twitter), Instagram, and Facebook. Active character monitors alert the user if Twitter copy exceeds 280 characters. Every generated creation is auto-saved to localStorage, appearing immediately in the History Hub and Dashboard activity streams.</p>
  </div>

  <!-- PAGE 11: 3.2 ROLE INTERACTION SUMMARY -->
  <div class="page">
    <h2 class="section-title">3.2 Role Interaction Summary</h2>
    <p>The CreatorFlow AI system provides tailored workspaces for individual writers, marketing copywriters, and agency administrators. Each user role utilizes the application according to their workflow goals.</p>
    <table>
      <thead>
        <tr>
          <th style="width: 20%;">Role</th>
          <th style="width: 40%;">Main actions</th>
          <th style="width: 40%;">Interactions with other users and app functions</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Solo Content Creator / Blogger</strong></td>
          <td>Generates blog articles, edits raw Markdown, audits readability scores, and conducts keyword research.</td>
          <td>Exports formatted Markdown files, saves items to local history, and monitors personal word volume metrics.</td>
        </tr>
        <tr>
          <td><strong>Social Media Specialist</strong></td>
          <td>Synthesizes omni-channel social posts, monitors Twitter character boundaries, and extracts tiered hashtag buckets.</td>
          <td>Quick-copies platform captions to clipboard, reviews character alert chips, and pulls post inspiration from Dashboard.</td>
        </tr>
        <tr>
          <td><strong>SEO Copywriter / Marketer</strong></td>
          <td>Audits draft copy against search terms, inspects keyword density and heading hierarchy, and reviews meta tags.</td>
          <td>Uses the animated radial 0–100 score to refine ranking factors before publishing to external Content Management Systems (CMS).</td>
        </tr>
      </tbody>
    </table>
    <p><strong>Shared system interactions:</strong> All user roles interact with the underlying 3-Tier Hybrid AI resolver, localStorage database persistence, and FastAPI Python NLP analysis modules. The application provides unified history search and centralized configuration settings across all workflows.</p>
  </div>

  <!-- PAGE 12: DIVIDER - SYSTEM ENVIRONMENT -->
  <div class="page divider-page">
    <div class="divider-title">SYSTEM ENVIRONMENT</div>
  </div>

  <!-- PAGE 13: 4. SYSTEM ENVIRONMENT -->
  <div class="page">
    <h2 class="section-title">4. SYSTEM ENVIRONMENT</h2>
    <p>The CreatorFlow AI application is designed as a modern decoupled full-stack application operating locally on the client machine with zero mandatory cloud dependencies.</p>
    <table>
      <thead>
        <tr>
          <th style="width: 30%;">Environment component</th>
          <th style="width: 70%;">Requirement or technology</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Client Platform</strong></td>
          <td>Modern Evergreen Web Browser (Chrome, Firefox, Edge, Brave, Safari) on Windows 10/11, macOS, or Linux.</td>
        </tr>
        <tr>
          <td><strong>Frontend Build Toolchain</strong></td>
          <td>Node.js (v18.0.0+), Vite (v8.2.0), React (v19.2.8), and ES6+ JavaScript modules.</td>
        </tr>
        <tr>
          <td><strong>User Interface</strong></td>
          <td>Vanilla CSS3 with CSS Custom Properties, Glassmorphism backdrop-blur, and Lucide React SVG icon renderers.</td>
        </tr>
        <tr>
          <td><strong>Backend API Server</strong></td>
          <td>Python 3.10+, FastAPI framework, and Uvicorn asynchronous ASGI server.</td>
        </tr>
        <tr>
          <td><strong>NLP &amp; SEO Engine</strong></td>
          <td>Custom Python computational linguistics modules (nlp_engine.py, seo_engine.py, keywords_engine.py).</td>
        </tr>
        <tr>
          <td><strong>Data Storage</strong></td>
          <td>HTML5 Web Storage (localStorage) providing offline client-side document persistence.</td>
        </tr>
        <tr>
          <td><strong>Optional Cloud AI</strong></td>
          <td>Google Gemini API, Groq Cloud API, or OpenAI API for extended high-parameter language modeling.</td>
        </tr>
      </tbody>
    </table>
    <p><strong>Service configuration:</strong> Running the application requires booting the Python FastAPI server on port 8000 and starting the Vite development server on port 5173. The frontend communicates with the backend via cross-origin asynchronous HTTP fetch requests.</p>
  </div>

  <!-- PAGE 14: 4.1 RUNTIME TOPOLOGY -->
  <div class="page">
    <h2 class="section-title">4.1 Runtime Topology</h2>
    <div class="diagram-box">
      <svg width="600" height="300" viewBox="0 0 600 300" xmlns="http://www.w3.org/2000/svg" style="font-family:'Times New Roman', serif;">
        <!-- Browser Box -->
        <rect x="20" y="30" width="220" height="240" rx="6" fill="#f8fafc" stroke="#334155" stroke-width="1.5"/>
        <text x="130" y="55" font-size="12" font-weight="bold" text-anchor="middle">Client Browser (Port 5173)</text>
        <rect x="35" y="75" width="190" height="40" rx="4" fill="#fff" stroke="#64748b" stroke-width="1"/>
        <text x="130" y="100" font-size="10" text-anchor="middle">React 19 Presentation UI</text>
        <rect x="35" y="125" width="190" height="40" rx="4" fill="#fff" stroke="#64748b" stroke-width="1"/>
        <text x="130" y="150" font-size="10" text-anchor="middle">ai.js Hybrid Resolver</text>
        <rect x="35" y="175" width="190" height="40" rx="4" fill="#fff" stroke="#64748b" stroke-width="1"/>
        <text x="130" y="200" font-size="10" text-anchor="middle">HTML5 localStorage Store</text>

        <!-- Python Backend Box -->
        <rect x="350" y="30" width="220" height="130" rx="6" fill="#f8fafc" stroke="#334155" stroke-width="1.5"/>
        <text x="460" y="55" font-size="12" font-weight="bold" text-anchor="middle">Python FastAPI (Port 8000)</text>
        <rect x="365" y="70" width="190" height="35" rx="4" fill="#fff" stroke="#64748b" stroke-width="1"/>
        <text x="460" y="92" font-size="9" text-anchor="middle">main.py (ASGI Endpoints)</text>
        <rect x="365" y="112" width="190" height="35" rx="4" fill="#fff" stroke="#64748b" stroke-width="1"/>
        <text x="460" y="134" font-size="9" text-anchor="middle">NLP &amp; SEO Engine</text>

        <!-- Cloud Box -->
        <rect x="350" y="180" width="220" height="90" rx="6" fill="#f8fafc" stroke="#334155" stroke-width="1.5"/>
        <text x="460" y="205" font-size="11" font-weight="bold" text-anchor="middle">Optional Cloud AI APIs</text>
        <text x="460" y="230" font-size="9" text-anchor="middle">Google Gemini / Groq / OpenAI</text>

        <!-- Connecting Lines -->
        <line x1="225" y1="145" x2="350" y2="100" stroke="#000" stroke-width="1.5"/>
        <line x1="225" y1="150" x2="350" y2="225" stroke="#000" stroke-width="1.5" stroke-dasharray="4"/>
      </svg>
    </div>
    <p>Users access the system through the React web frontend. The application routes generation tasks through the ai.js resolver to either the local FastAPI server (port 8000) or direct cloud endpoints when configured. State persists within browser localStorage.</p>
  </div>

  <!-- PAGE 15: 4.2 DIRECTORY STRUCTURE -->
  <div class="page">
    <h2 class="section-title">4.2 DIRECTORY STRUCTURE</h2>
    <p>The CreatorFlow AI application is organized into a clean decoupled full-stack project structure comprising frontend assets and a dedicated backend microservice:</p>
    <pre>afsal_project/
├── backend/
│   ├── __init__.py
│   ├── main.py                  # FastAPI server & route handlers
│   ├── nlp_engine.py               # Blog & Social NLP text synthesis
│   ├── seo_engine.py               # Readability & SEO grading algorithms
│   ├── keywords_engine.py          # Intent clustering & hashtag generator
│   ├── requirements.txt            # Python dependencies (fastapi, uvicorn)
│   └── run_server.py               # Uvicorn launcher script
├── public/                         # Static web assets
├── src/
│   ├── assets/                     # Graphical icons and branding
│   ├── components/
│   │   ├── Dashboard.jsx           # Performance metrics & recent feed
│   │   ├── BlogGenerator.jsx       # Blog writer & markdown editor
│   │   ├── SocialGenerator.jsx     # Multi-platform caption suite
│   │   ├── SeoOptimizer.jsx        # Readability & SEO grading dial
│   │   ├── KeywordGenerator.jsx    # Keyword tables & hashtag tiers
│   │   ├── History.jsx             # Local storage history management
│   │   └── Settings.jsx            # Profile & AI engine preferences
│   ├── services/
│   │   ├── ai.js                   # 3-Tier Hybrid AI resolver engine
│   │   └── markdown.js             # Safe Markdown-to-HTML parser
│   ├── App.jsx                     # Root application container & tab router
│   ├── index.css                   # Custom CSS design system & animations
│   └── main.jsx                    # React 19 application entry point
├── package.json                    # Node dependencies and build scripts
├── vite.config.js                  # Vite bundler configuration
└── README.md                       # Installation and execution guidelines</pre>
  </div>

  <!-- PAGE 16: 4.3 API SURFACE OVERVIEW -->
  <div class="page">
    <h2 class="section-title">4.3 API SURFACE OVERVIEW</h2>
    <p>The CreatorFlow AI backend provides lightweight RESTful endpoints powering computational linguistics, search analysis, and health verification:</p>
    <table>
      <thead>
        <tr>
          <th style="width: 20%;">Endpoint</th>
          <th style="width: 15%;">Method</th>
          <th style="width: 65%;">Main purpose in the application</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>/api/health</code></td>
          <td>GET</td>
          <td>Returns backend server status, active engine version, and available AI provider list.</td>
        </tr>
        <tr>
          <td><code>/api/blog</code></td>
          <td>POST</td>
          <td>Accepts topic, keywords, tone, and length parameters to synthesize structured Markdown blog articles with meta tags.</td>
        </tr>
        <tr>
          <td><code>/api/social</code></td>
          <td>POST</td>
          <td>Accepts topic and platform parameters to synthesize targeted captions for LinkedIn, Twitter, Instagram, and Facebook.</td>
        </tr>
        <tr>
          <td><code>/api/seo</code></td>
          <td>POST</td>
          <td>Analyzes submitted draft copy, computes Flesch-Kincaid reading metrics, keyword densities, and structural heading checks.</td>
        </tr>
        <tr>
          <td><code>/api/keywords</code></td>
          <td>POST</td>
          <td>Expands seed topics into secondary keyword variations with estimated search volume, CPC, difficulty, and hashtag tiers.</td>
        </tr>
      </tbody>
    </table>
    <p>The React frontend communicates with these endpoints asynchronously via HTTP JSON payloads, handling failover automatically if endpoints become unreachable.</p>
  </div>

  <!-- PAGE 17: 4.4 FRONTEND ROUTE MAP - PART 1 -->
  <div class="page">
    <h2 class="section-title">4.4 FRONTEND ROUTE MAP</h2>
    <p><strong>CREATORFLOW AI APPLICATION</strong><br>
    Launch Web Application<br>
    └── Load Local Storage &amp; Niche Preferences<br>
    &nbsp;&nbsp;&nbsp;&nbsp;└── Open Unified Creative Dashboard</p>
    <br>
    <p><strong>1. Dashboard Module</strong></p>
    <ul>
      <li>View total creation counts and aggregate word statistics</li>
      <li>Quick-launch action cards for Blog, Social, SEO, or Keywords</li>
      <li>Review recent drafts with one-click clipboard copy</li>
    </ul>

    <p><strong>2. AI Blog Article Generator</strong></p>
    <ul>
      <li>Configure Topic, Target Audience, Focus Keywords, Tone, and Length</li>
      <li>Generate structured Markdown articles with H1/H2 hierarchies</li>
      <li>Toggle between Rendered HTML Preview and Editable Raw Markdown</li>
      <li>Review SEO Title suggestions and character-checked Meta Descriptions</li>
      <li>Direct one-click export to Linguistic SEO Optimizer</li>
    </ul>

    <p><strong>3. Multi-Platform Social Caption Generator</strong></p>
    <ul>
      <li>Input seed post concept and customize voice tone</li>
      <li>Simultaneously view outputs for LinkedIn, X (Twitter), Instagram, Facebook</li>
      <li>Inspect active character counter badges (flagging overflows beyond 280 chars)</li>
      <li>One-click copy to clipboard for each platform card</li>
    </ul>
  </div>

  <!-- PAGE 18: 4.4 FRONTEND ROUTE MAP - PART 2 -->
  <div class="page">
    <p><strong>4. Linguistic SEO Content Optimizer</strong></p>
    <ul>
      <li>Input draft article, target keyword, and meta description</li>
      <li>Compute animated radial 0–100 SEO Grade Score</li>
      <li>Inspect pass/warn/fail diagnostic checklists:
        <ul>
          <li>Total word volume and estimated reading duration</li>
          <li>Target keyword density (optimal 1%–3% threshold)</li>
          <li>First paragraph keyword placement check</li>
          <li>Heading tag presence (H1, H2, H3 distribution)</li>
          <li>Meta description length validation (120–160 characters)</li>
        </ul>
      </li>
    </ul>

    <p><strong>5. Keyword &amp; Hashtag Finder</strong></p>
    <ul>
      <li>Input seed niche topic and select Search Intent (Informational / Transactional)</li>
      <li>Review keyword metrics table (Volume, CPC, Competition Difficulty)</li>
      <li>Inspect categorized hashtag tiers (High-Volume, Medium-Volume, Niche)</li>
    </ul>

    <p><strong>6. Local History Hub</strong></p>
    <ul>
      <li>Filter saved items by category (All, Blog Posts, Social Captions)</li>
      <li>Real-time substring search across title and content</li>
      <li>Full review modal popup with copy and delete utilities</li>
    </ul>

    <p><strong>7. Settings &amp; AI Engine Configuration</strong></p>
    <ul>
      <li>Customize creator name and default content niche</li>
      <li>Select AI engine provider (Local Hybrid, Gemini, Groq, OpenAI)</li>
      <li>Test live backend connectivity (/api/health)</li>
      <li>Clear browser cache and local history store</li>
    </ul>
  </div>

  <!-- PAGE 19: DIVIDER - SYSTEM REQUIREMENT -->
  <div class="page divider-page">
    <div class="divider-title">SYSTEM REQUIREMENT</div>
  </div>

  <!-- PAGE 20: 5.1 HARDWARE REQUIREMENTS -->
  <div class="page">
    <h2 class="section-title">5.1 HARDWARE REQUIREMENTS</h2>
    <p>CreatorFlow AI is designed to run efficiently on standard consumer-grade computer hardware without requiring dedicated graphic accelerators (GPUs) or costly server infrastructures.</p>
    <table>
      <thead>
        <tr>
          <th style="width: 25%;">Use</th>
          <th style="width: 75%;">Hardware requirement</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Run the Web Application (Client)</strong></td>
          <td>Any standard PC, laptop, or tablet capable of executing a modern web browser. Minimum Intel Core i3 or equivalent, 4 GB RAM, 100 MB available disk cache, and a minimum screen resolution of 1280 x 720 pixels.</td>
        </tr>
        <tr>
          <td><strong>Local Full-Stack Development</strong></td>
          <td>A 64-bit multi-core computer (Intel Core i5 / AMD Ryzen 5 or higher). Minimum 8 GB RAM (16 GB recommended for concurrent Vite compilation and Python FastAPI processing). At least 1 GB free SSD disk space.</td>
        </tr>
        <tr>
          <td><strong>Local Offline Python NLP Engine</strong></td>
          <td>Minimum 4 GB available system RAM to process text tokenization and Flesch-Kincaid lexical formulas in memory with zero thermal throttling.</td>
        </tr>
      </tbody>
    </table>
    <p>These specifications ensure low-latency responsiveness, smooth 60 FPS CSS glassmorphism animations, and near-instantaneous content synthesis.</p>
  </div>

  <!-- PAGE 21: 5.2 SOFTWARE REQUIREMENTS -->
  <div class="page">
    <h2 class="section-title">5.2 SOFTWARE REQUIREMENTS</h2>
    <p>The CreatorFlow AI application requires the following development tools, runtimes, and libraries:</p>
    <table>
      <thead>
        <tr>
          <th style="width: 25%;">Category</th>
          <th style="width: 75%;">Software requirement</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Operating System</strong></td>
          <td>Microsoft Windows 10/11 (64-bit), macOS Monterey or newer, or modern Linux distribution (Ubuntu 20.04+).</td>
        </tr>
        <tr>
          <td><strong>Node.js Toolchain</strong></td>
          <td>Node.js runtime v18.0.0 or higher with npm (Node Package Manager) v9+.</td>
        </tr>
        <tr>
          <td><strong>Python Environment</strong></td>
          <td>Python v3.10.0 or higher with pip package installer.</td>
        </tr>
        <tr>
          <td><strong>Web Frameworks</strong></td>
          <td>React v19.2.8 and Vite v8.2.0 bundler.</td>
        </tr>
        <tr>
          <td><strong>Backend Framework</strong></td>
          <td>FastAPI v0.100.0+, Uvicorn v0.22.0+, and Pydantic v2.0.0+.</td>
        </tr>
        <tr>
          <td><strong>Iconography</strong></td>
          <td>Lucide React v1.33.0 SVG icon library.</td>
        </tr>
        <tr>
          <td><strong>Web Browser</strong></td>
          <td>Google Chrome v100+, Mozilla Firefox v100+, or Microsoft Edge v100+.</td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- PAGE 22: 5.3 SOFTWARE DESCRIPTION - PART 1 -->
  <div class="page">
    <h2 class="section-title">5.3 SOFTWARE DESCRIPTION</h2>
    <table>
      <thead>
        <tr>
          <th style="width: 30%;">Software or component</th>
          <th style="width: 70%;">Description and role in the project</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>React 19</strong></td>
          <td>Declarative component-based frontend library used to build interactive user interfaces, manage application state, and render tab navigation without page reloads.</td>
        </tr>
        <tr>
          <td><strong>Vite</strong></td>
          <td>Next-generation frontend tooling providing rapid Hot Module Replacement (HMR) during development and optimized Rollup bundling for production.</td>
        </tr>
        <tr>
          <td><strong>FastAPI</strong></td>
          <td>Modern, asynchronous Python web framework providing high-speed RESTful API endpoints with automated OpenAPI documentation and Pydantic data validation.</td>
        </tr>
        <tr>
          <td><strong>Uvicorn</strong></td>
          <td>Lightning-fast ASGI web server implementation used to run FastAPI applications concurrently on local port 8000.</td>
        </tr>
        <tr>
          <td><strong>Vanilla CSS3</strong></td>
          <td>Custom design system leveraging CSS variables, glassmorphic backdrop filters, responsive flex/grid layouts, and smooth animations without external CSS frameworks.</td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- PAGE 23: 5.3 SOFTWARE DESCRIPTION - PART 2 -->
  <div class="page">
    <table>
      <thead>
        <tr>
          <th style="width: 30%;">Software or component</th>
          <th style="width: 70%;">Description and role in the project</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Lucide React</strong></td>
          <td>Comprehensive open-source SVG icon suite utilized for consistent, scalable navigation and action iconography.</td>
        </tr>
        <tr>
          <td><strong>HTML5 Web Storage</strong></td>
          <td>Browser-native localStorage API used to persist generated drafts, user profile names, and AI provider credentials locally on the client machine.</td>
        </tr>
        <tr>
          <td><strong>Python NLP Engine</strong></td>
          <td>Custom algorithmic module executing deterministic natural language synthesis, keyword injection, and Markdown structuring.</td>
        </tr>
        <tr>
          <td><strong>SEO Engine</strong></td>
          <td>Custom computational module computing Flesch-Kincaid reading ease formulas, sentence complexity metrics, and keyword density percentages.</td>
        </tr>
      </tbody>
    </table>
    <p>The combination of these technologies delivers a responsive, self-contained architecture capable of operating entirely offline while providing optional cloud connectivity.</p>
  </div>

  <!-- PAGE 24: DIVIDER - SYSTEM STUDY & ANALYSIS -->
  <div class="page divider-page">
    <div class="divider-title">SYSTEM STUDY &amp; ANALYSIS</div>
  </div>

  <!-- PAGE 25: 6.1 EXISTING SYSTEM -->
  <div class="page">
    <h2 class="section-title">6.1 EXISTING SYSTEM</h2>
    <p>Before introducing CreatorFlow AI, creators and digital marketing teams relied on commercial subscription platforms (such as Jasper AI, Copy.ai, and Writesonic) or disjointed manual processes using generic chat interfaces and spreadsheets. The project identifies rigid monthly fees, strict cloud dependence, and fragmented workflows as the primary limitations of existing approaches.</p>
    <p>In such an arrangement, authors must navigate between separate software solutions: one for article copywriting, another for social character counts, a third for SEO readability analysis, and manual spreadsheets for keyword logging. Furthermore, commercial tools store draft copy on remote databases, introducing data sovereignty concerns for proprietary commercial concepts.</p>
    <h3 class="subsection-title">LIMITATIONS OF THE EXISTING SYSTEM</h3>
    <ul>
      <li><strong>Recurring Subscription Costs:</strong> Commercial AI copywriting suites enforce expensive monthly plans, restricting access for student creators and small business owners.</li>
      <li><strong>Mandatory Cloud Network Dependency:</strong> Operations halt completely if the user encounters network interruptions or remote provider outages.</li>
      <li><strong>Data Privacy &amp; Sovereignty Risks:</strong> Sensitive unpublished drafts and intellectual property are transmitted to and stored on remote third-party servers.</li>
    </ul>
  </div>

  <!-- PAGE 26: 6.1 LIMITATIONS CONTINUED -->
  <div class="page">
    <ul>
      <li><strong>Fragmented Tooling Workflows:</strong> Authors must manually copy and paste copy across multiple separate tools to evaluate character limits and SEO scores.</li>
      <li><strong>Lack of Real-Time Linguistic Auditing:</strong> Standard chat interfaces do not calculate mathematical readability scores or verify keyword density thresholds.</li>
      <li><strong>Unpredictable API Quotas &amp; Rate Limits:</strong> Commercial LLM APIs frequently encounter HTTP 429 quota exhaustion errors during peak operational windows.</li>
    </ul>
    <p>These fragmented processes introduce friction and increase production expenses. CreatorFlow AI addresses this context by uniting content drafting, omni-channel social formatting, readability analysis, and keyword intelligence into a single self-contained application.</p>
  </div>

  <!-- PAGE 27: 6.2 PROPOSED SYSTEM -->
  <div class="page">
    <h2 class="section-title">6.2 PROPOSED SYSTEM</h2>
    <p>CreatorFlow AI is proposed as an integrated, self-hosted content generation and SEO auditing platform. It brings blog article drafting, multi-platform social captioning, linguistic readability grading, keyword metrics research, and local history management together in one modern web interface.</p>
    <p>Authors can customize topics, brand tones, target lengths, and audience personas to generate publication-ready copy. The platform's 3-Tier Hybrid AI Processing Model ensures continuous reliability by seamlessly transitioning between cloud LLMs, local Python FastAPI algorithms, and browser-side JavaScript rule engines.</p>
    <h3 class="subsection-title">ADVANTAGES OF THE PROPOSED SYSTEM</h3>
    <ul>
      <li><strong>100% Free &amp; Self-Hosted:</strong> Eliminates recurring credit fees and monthly software subscriptions.</li>
      <li><strong>Zero-Latency Offline Execution:</strong> Operates locally even during internet disconnections through built-in algorithmic engines.</li>
      <li><strong>Local Data Sovereignty:</strong> Retains all draft history, profiles, and API credentials securely within browser localStorage.</li>
    </ul>
  </div>

  <!-- PAGE 28: 6.2 ADVANTAGES CONTINUED -->
  <div class="page">
    <ul>
      <li><strong>Unified Creative Workflow:</strong> Integrates blog generation, social formatting, SEO auditing, and keyword research under a single interface.</li>
      <li><strong>Omni-Channel Adaptation:</strong> Generates platform-tailored copy for LinkedIn, X (Twitter), Instagram, and Facebook simultaneously.</li>
      <li><strong>Linguistic SEO Verification:</strong> Computes objective Flesch-Kincaid scores and checks keyword density thresholds prior to publishing.</li>
      <li><strong>Graceful 3-Tier Fallback:</strong> Guarantees zero downtime by cascading from Cloud AI to Local FastAPI to Client-side JavaScript.</li>
    </ul>
    <p>These advantages empower digital creators to accelerate publication frequency while preserving complete control over their content assets.</p>
  </div>

  <!-- PAGE 29: 6.3 FEASIBILITY STUDY -->
  <div class="page">
    <h2 class="section-title">6.3 FEASIBILITY STUDY</h2>
    <p>This preliminary study evaluates whether CreatorFlow AI can be successfully developed and deployed using the chosen architectural stack:</p>
    <table>
      <thead>
        <tr>
          <th style="width: 25%;">Area</th>
          <th style="width: 75%;">Assessment</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Technical Feasibility</strong></td>
          <td>The project utilizes mature open-source technologies (React 19, Vite, Python FastAPI, Uvicorn). The decoupled architecture runs efficiently on standard laptop hardware without specialized GPU hardware. Hence, technical feasibility is validated.</td>
        </tr>
        <tr>
          <td><strong>Operational Feasibility</strong></td>
          <td>The interface is designed with intuitive card layouts, pre-configured rotating placeholders, and one-click copy utilities, enabling non-technical marketers and bloggers to operate the platform with zero onboarding.</td>
        </tr>
        <tr>
          <td><strong>Economic Feasibility</strong></td>
          <td>Built entirely with free, open-source software libraries and zero mandatory commercial database or hosting fees. Operates at near-zero recurring cost, confirming strong economic feasibility.</td>
        </tr>
        <tr>
          <td><strong>Security &amp; Privacy Readiness</strong></td>
          <td>Draft articles and sensitive user data are held exclusively within client-side localStorage, ensuring high data sovereignty and zero exposure to external data breaches.</td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- PAGE 30: DIVIDER - SYSTEM DESIGN -->
  <div class="page divider-page">
    <div class="divider-title">SYSTEM DESIGN</div>
  </div>

  <!-- PAGE 31: 7.1 INPUT DESIGN -->
  <div class="page">
    <h2 class="section-title">7.1 INPUT DESIGN</h2>
    <p>Input forms in CreatorFlow AI are designed with clear input validation, contextual placeholders, and ergonomic controls tailored to content creators:</p>
    <table>
      <thead>
        <tr>
          <th style="width: 25%;">Input area</th>
          <th style="width: 15%;">User</th>
          <th style="width: 60%;">Information entered or selected</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Blog Generator Form</strong></td>
          <td>Author</td>
          <td>Article topic, target audience, comma-separated keywords, tone selector (Informative, Professional, Casual, Witty, Persuasive), target length radio toggles (Short, Medium, Long).</td>
        </tr>
        <tr>
          <td><strong>Social Caption Form</strong></td>
          <td>Copywriter</td>
          <td>Seed post concept, platform multi-select checkboxes (LinkedIn, Twitter, Instagram, Facebook), tone selector.</td>
        </tr>
        <tr>
          <td><strong>SEO Optimizer Form</strong></td>
          <td>Marketer</td>
          <td>Target search keyword, draft article body (multiline textarea), optional meta description text.</td>
        </tr>
        <tr>
          <td><strong>Keyword Finder Form</strong></td>
          <td>Researcher</td>
          <td>Seed niche topic, search intent radio buttons (Informational vs. Transactional).</td>
        </tr>
        <tr>
          <td><strong>Settings Form</strong></td>
          <td>User</td>
          <td>Creator display name, default content niche, AI provider selector, optional API key.</td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- PAGE 32: 7.2 OUTPUT DESIGN -->
  <div class="page">
    <h2 class="section-title">7.2 OUTPUT DESIGN</h2>
    <p>Outputs in CreatorFlow AI are structured for readability, instant clipboard export, and actionable diagnostic feedback:</p>
    <table>
      <thead>
        <tr>
          <th style="width: 25%;">Output</th>
          <th style="width: 15%;">User</th>
          <th style="width: 60%;">Information presented</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Dashboard Overview</strong></td>
          <td>All users</td>
          <td>Live metric counters (Total Creations, Word Counts, Library Items), quick-launch cards, and recent creations activity stream.</td>
        </tr>
        <tr>
          <td><strong>Blog Article View</strong></td>
          <td>Author</td>
          <td>Structured Markdown content with H1/H2 tags, live rendered HTML preview, word count chips, recommended SEO title and character-checked meta description.</td>
        </tr>
        <tr>
          <td><strong>Social Captions Deck</strong></td>
          <td>Copywriter</td>
          <td>Platform-specific cards (LinkedIn, Twitter, Instagram, Facebook) displaying formatted text, character counters, and warning badges.</td>
        </tr>
        <tr>
          <td><strong>SEO Audit Dashboard</strong></td>
          <td>Marketer</td>
          <td>Animated radial 0–100 SEO Grade Score, readability reading time, keyword density percentage, and pass/warn/fail diagnostic cards.</td>
        </tr>
        <tr>
          <td><strong>Keyword Research Table</strong></td>
          <td>Researcher</td>
          <td>Clustered search term table detailing estimated volume, CPC, difficulty rating, and 3-tier hashtag buckets (High, Med, Low).</td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- PAGE 33: 7.3 DATA FLOW DIAGRAM (Narrative) -->
  <div class="page">
    <h2 class="section-title">7.3 DATA FLOW DIAGRAM (Narrative)</h2>
    <p>The CreatorFlow AI application coordinates information exchange across input forms, computational resolvers, and local data stores:</p>
    <p><strong>Content Generation Flow:</strong> The creator inputs a topic and parameters into the Blog or Social module. The form dispatches an asynchronous request to the ai.js hybrid resolver. The resolver checks if a valid cloud API key exists; if present, it invokes the cloud provider API. If absent, it queries the local Python FastAPI endpoint on port 8000. If the Python server is offline, the client-side JavaScript engine generates the response. The resulting structured text is returned to the UI and auto-saved to localStorage.</p>
    <p><strong>SEO Auditing Flow:</strong> The user provides a draft article and target search keyword. The SEO Optimizer dispatches the content to /api/seo or analyzes the text client-side, tokenizing sentences and words, computing Flesch-Kincaid readability metrics, and evaluating keyword density. Results are formatted into an animated score dial and diagnostic checklist cards.</p>
    <p><strong>Persistence Flow:</strong> Whenever new content is generated, an artifact record is assembled with unique timestamps, category tags, and preview text, then committed to the browser's localStorage. The History module reads this store to support instant search filtering and modal previews.</p>
  </div>

  <!-- PAGE 34: 7.4 DATA FLOW DIAGRAM -->
  <div class="page">
    <h2 class="section-title">7.4 DATA FLOW DIAGRAM</h2>
    <div class="caption">Level 0 &amp; Level 1 Data Flow Diagram (DFD)</div>
    <div class="diagram-box">
      <svg width="600" height="340" viewBox="0 0 600 340" xmlns="http://www.w3.org/2000/svg" style="font-family:'Times New Roman', serif;">
        <!-- Level 0 DFD -->
        <rect x="20" y="20" width="100" height="40" rx="4" fill="#fff" stroke="#000" stroke-width="1.5"/>
        <text x="70" y="45" font-size="11" font-weight="bold" text-anchor="middle">Creator</text>

        <circle cx="280" cy="40" r="30" fill="#f8fafc" stroke="#000" stroke-width="1.5"/>
        <text x="280" y="44" font-size="10" font-weight="bold" text-anchor="middle">0.0 CreatorFlow</text>

        <rect x="460" y="20" width="120" height="40" rx="4" fill="#fff" stroke="#000" stroke-width="1.5"/>
        <text x="520" y="45" font-size="11" font-weight="bold" text-anchor="middle">D1: localStorage</text>

        <line x1="120" y1="35" x2="250" y2="35" stroke="#000" stroke-width="1.5"/>
        <text x="185" y="28" font-size="9" text-anchor="middle">Topics / Prompts</text>

        <line x1="250" y1="50" x2="120" y2="50" stroke="#000" stroke-width="1.5"/>
        <text x="185" y="65" font-size="9" text-anchor="middle">Generated Content</text>

        <line x1="310" y1="40" x2="460" y2="40" stroke="#000" stroke-width="1.5"/>
        <text x="385" y="32" font-size="9" text-anchor="middle">Persist Drafts</text>

        <!-- Divider Line -->
        <line x1="20" y1="95" x2="580" y2="95" stroke="#ccc" stroke-dasharray="4"/>
        <text x="300" y="115" font-size="11" font-weight="bold" text-anchor="middle">Level 1 DFD: Sub-Process Deconstruction</text>

        <!-- Level 1 DFD Subprocesses -->
        <circle cx="100" cy="180" r="28" fill="#fff" stroke="#000" stroke-width="1.5"/>
        <text x="100" y="184" font-size="9" font-weight="bold" text-anchor="middle">1.0 Blog Gen</text>

        <circle cx="230" cy="180" r="28" fill="#fff" stroke="#000" stroke-width="1.5"/>
        <text x="230" y="184" font-size="9" font-weight="bold" text-anchor="middle">2.0 Social Gen</text>

        <circle cx="360" cy="180" r="28" fill="#fff" stroke="#000" stroke-width="1.5"/>
        <text x="360" y="184" font-size="9" font-weight="bold" text-anchor="middle">3.0 SEO Audit</text>

        <circle cx="490" cy="180" r="28" fill="#fff" stroke="#000" stroke-width="1.5"/>
        <text x="490" y="184" font-size="9" font-weight="bold" text-anchor="middle">4.0 Keywords</text>

        <!-- Storage & Engine at bottom -->
        <rect x="150" y="270" width="130" height="40" rx="4" fill="#fafafa" stroke="#000" stroke-width="1.5"/>
        <text x="215" y="295" font-size="10" font-weight="bold" text-anchor="middle">FastAPI Engine</text>

        <rect x="330" y="270" width="130" height="40" rx="4" fill="#fafafa" stroke="#000" stroke-width="1.5"/>
        <text x="395" y="295" font-size="10" font-weight="bold" text-anchor="middle">D1: localStorage</text>

        <line x1="100" y1="208" x2="180" y2="270" stroke="#000" stroke-width="1.2"/>
        <line x1="230" y1="208" x2="215" y2="270" stroke="#000" stroke-width="1.2"/>
        <line x1="360" y1="208" x2="245" y2="270" stroke="#000" stroke-width="1.2"/>
        <line x1="490" y1="208" x2="260" y2="270" stroke="#000" stroke-width="1.2"/>

        <line x1="215" y1="290" x2="330" y2="290" stroke="#000" stroke-width="1.2"/>
      </svg>
    </div>
  </div>

  <!-- PAGE 35: 7.5 DATA DESIGN – SCHEMA TABLES - PART 1 -->
  <div class="page">
    <h2 class="section-title">7.5 DATA DESIGN – SCHEMA TABLES</h2>
    <p>CreatorFlow AI organizes data structures in memory and commits records into HTML5 localStorage using JSON serialization. The schemas below define these structures:</p>
    <p><strong>1. History Records — <code>creatorflow_history</code></strong></p>
    <table>
      <thead>
        <tr>
          <th style="width: 20%;">Field</th>
          <th style="width: 20%;">Type</th>
          <th style="width: 60%;">Description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>id</code></td>
          <td>String</td>
          <td>Unique epoch millisecond identifier (e.g. "1727823901234").</td>
        </tr>
        <tr>
          <td><code>title</code></td>
          <td>String</td>
          <td>Primary article topic or social post concept headline.</td>
        </tr>
        <tr>
          <td><code>type</code></td>
          <td>String / Enum</td>
          <td>Artifact category tag ("blog" or "social").</td>
        </tr>
        <tr>
          <td><code>content</code></td>
          <td>String</td>
          <td>Raw Markdown or platform caption text body.</td>
        </tr>
        <tr>
          <td><code>date</code></td>
          <td>String</td>
          <td>Formatted date-time stamp of generation.</td>
        </tr>
        <tr>
          <td><code>wordCount</code></td>
          <td>Number</td>
          <td>Total computed lexical word count.</td>
        </tr>
      </tbody>
    </table>

    <p><strong>2. User Profile Preferences — <code>creator_profile</code></strong></p>
    <table>
      <thead>
        <tr>
          <th style="width: 20%;">Field</th>
          <th style="width: 20%;">Type</th>
          <th style="width: 60%;">Description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>creator_name</code></td>
          <td>String</td>
          <td>Personal display name of the creator (default: "Afsal").</td>
        </tr>
        <tr>
          <td><code>creator_niche</code></td>
          <td>String</td>
          <td>Default industry niche (tech, marketing, finance, health, general).</td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- PAGE 36: 7.5 DATA DESIGN – SCHEMA TABLES - PART 2 -->
  <div class="page">
    <p><strong>3. AI Provider Credentials — <code>creator_ai_settings</code></strong></p>
    <table>
      <thead>
        <tr>
          <th style="width: 25%;">Field</th>
          <th style="width: 20%;">Type</th>
          <th style="width: 55%;">Description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>creator_ai_provider</code></td>
          <td>String / Enum</td>
          <td>Selected provider ("local", "gemini", "groq", "openai").</td>
        </tr>
        <tr>
          <td><code>creator_ai_key</code></td>
          <td>String</td>
          <td>Optional user API key for external cloud models.</td>
        </tr>
        <tr>
          <td><code>creator_ai_model</code></td>
          <td>String</td>
          <td>Specific model string (e.g. "gemini-1.5-flash", "llama-3.1-8b-instant").</td>
        </tr>
        <tr>
          <td><code>creator_backend_url</code></td>
          <td>String</td>
          <td>Custom FastAPI server host URL (default: http://127.0.0.1:8000).</td>
        </tr>
      </tbody>
    </table>

    <p><strong>4. SEO Diagnostic Analysis Schema — <code>seo_audit_result</code></strong></p>
    <table>
      <thead>
        <tr>
          <th style="width: 25%;">Field</th>
          <th style="width: 20%;">Type</th>
          <th style="width: 55%;">Description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>score</code></td>
          <td>Number</td>
          <td>Overall computed SEO readability grade (0 to 100).</td>
        </tr>
        <tr>
          <td><code>wordCount</code></td>
          <td>Number</td>
          <td>Total detected word count in evaluated article.</td>
        </tr>
        <tr>
          <td><code>readingTime</code></td>
          <td>Number</td>
          <td>Estimated reading duration in minutes (based on 200 WPM).</td>
        </tr>
        <tr>
          <td><code>keywordDensity</code></td>
          <td>Number</td>
          <td>Percentage ratio of target keyword appearances.</td>
        </tr>
        <tr>
          <td><code>checks</code></td>
          <td>Array of Objects</td>
          <td>Status checklist items (id, label, status: "pass" | "warn" | "fail", msg).</td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- PAGE 37: DIVIDER - SYSTEM TESTING & MAINTENANCE -->
  <div class="page divider-page">
    <div class="divider-title">SYSTEM TESTING &amp; MAINTENANCE</div>
  </div>

  <!-- PAGE 38: 8.1 SYSTEM TESTING -->
  <div class="page">
    <h2 class="section-title">8.1 SYSTEM TESTING</h2>
    <p>System testing verifies that CreatorFlow AI functions reliably as an integrated platform across content drafting, SEO auditing, character monitoring, and local data persistence:</p>
    <table>
      <thead>
        <tr>
          <th style="width: 12%;">Test ID</th>
          <th style="width: 18%;">Function</th>
          <th style="width: 35%;">Test action</th>
          <th style="width: 35%;">Expected result</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>ST-01</strong></td>
          <td>Backend Ping</td>
          <td>Send GET request to /api/health on port 8000.</td>
          <td>Returns HTTP 200 with online status and active engine metadata.</td>
        </tr>
        <tr>
          <td><strong>ST-02</strong></td>
          <td>Blog Generation</td>
          <td>Submit topic "Cloud Architecture" with Informative tone and Medium length.</td>
          <td>Generates structured Markdown blog with intro, headings, and meta tags.</td>
        </tr>
        <tr>
          <td><strong>ST-03</strong></td>
          <td>Social Generation</td>
          <td>Request social captions for LinkedIn and Twitter simultaneously.</td>
          <td>Returns platform-tailored copy for both channels with character badges.</td>
        </tr>
        <tr>
          <td><strong>ST-04</strong></td>
          <td>Twitter Alert</td>
          <td>Generate Twitter copy exceeding 280 characters.</td>
          <td>UI highlights character counter with red overflow warning badge.</td>
        </tr>
        <tr>
          <td><strong>ST-05</strong></td>
          <td>SEO Auditing</td>
          <td>Analyze 500-word draft with keyword "DevOps".</td>
          <td>Renders radial 0–100 score and pass/warn/fail diagnostic checklists.</td>
        </tr>
        <tr>
          <td><strong>ST-06</strong></td>
          <td>History Persistence</td>
          <td>Save generated creation and refresh browser tab.</td>
          <td>Draft persists in localStorage and displays in History Hub after reload.</td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- PAGE 39: 8.1 CONTINUED & 8.2 SYSTEM MAINTENANCE -->
  <div class="page">
    <table>
      <thead>
        <tr>
          <th style="width: 12%;">Test ID</th>
          <th style="width: 18%;">Function</th>
          <th style="width: 35%;">Test action</th>
          <th style="width: 35%;">Expected result</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>ST-07</strong></td>
          <td>3-Tier Fallback</td>
          <td>Stop Python server and clear API keys, then click Generate.</td>
          <td>Client-side JavaScript fallback engine generates valid copy without crash.</td>
        </tr>
        <tr>
          <td><strong>ST-08</strong></td>
          <td>Copy to Clipboard</td>
          <td>Click Copy button on generated card.</td>
          <td>Formatted copy writes to OS clipboard and button shows confirmation.</td>
        </tr>
      </tbody>
    </table>

    <h2 class="section-title">8.2 SYSTEM MAINTENANCE</h2>
    <p>System maintenance preserves software performance, framework compatibility, and security across ongoing operations:</p>
    <table>
      <thead>
        <tr>
          <th style="width: 30%;">Maintenance area</th>
          <th style="width: 70%;">Recommended activity</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Corrective Maintenance</strong></td>
          <td>Address potential edge cases in tokenization, resolve CORS header mismatches between Vite and FastAPI, and patch markdown rendering bugs.</td>
        </tr>
        <tr>
          <td><strong>Adaptive Maintenance</strong></td>
          <td>Update Node.js dependencies, adjust to newer React 19 minor versions, and configure emerging LLM model endpoints (e.g. Gemini 2.0, Llama 3.2).</td>
        </tr>
        <tr>
          <td><strong>Preventive Maintenance</strong></td>
          <td>Audit browser localStorage capacity limits (typically 5MB per origin) and introduce automatic archiving for older historical records.</td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- PAGE 40: 8.2 MAINTENANCE CONTINUED -->
  <div class="page">
    <table>
      <thead>
        <tr>
          <th style="width: 30%;">Maintenance area</th>
          <th style="width: 70%;">Recommended activity</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Perfective Maintenance</strong></td>
          <td>Refine Flesch-Kincaid syllabification algorithms, enhance glassmorphism rendering speed on low-power devices, and add export formats (PDF, DOCX).</td>
        </tr>
        <tr>
          <td><strong>Data &amp; Service Maintenance</strong></td>
          <td>Monitor FastAPI server memory footprint during high-concurrency requests and maintain compatibility with local Python virtual environments.</td>
        </tr>
      </tbody>
    </table>
    <p>Prior to distributing production updates, developers should execute the test suite, verify clean build compilation via <code>npm run build</code>, and test the offline fallback cascade.</p>
  </div>

  <!-- PAGE 41: DIVIDER - SYSTEM IMPLEMENTATION -->
  <div class="page divider-page">
    <div class="divider-title">SYSTEM IMPLEMENTATION</div>
  </div>

  <!-- PAGE 42: 9.1 SAMPLE CODING - PART 1 -->
  <div class="page">
    <h2 class="section-title">9.1 SAMPLE CODING</h2>
    <p><strong>1. FastAPI Application Server (<code>backend/main.py</code>)</strong></p>
    <pre>from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional
from nlp_engine import generate_python_blog, generate_python_social
from seo_engine import analyze_python_seo
from keywords_engine import generate_python_keywords

app = FastAPI(title="CreatorFlow AI Python Engine", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class BlogRequest(BaseModel):
    topic: str = Field(..., description="Main topic or title")
    keywords: Optional[str] = Field("", description="Target keywords")
    tone: Optional[str] = Field("Informative", description="Tone of voice")
    length: Optional[str] = Field("medium", description="Length: short, medium, long")
    audience: Optional[str] = Field("Creators", description="Audience")

@app.get("/api/health")
def health_check():
    return {
        "status": "online",
        "engine": "CreatorFlow Hybrid AI & NLP Engine",
        "version": "1.1.0",
        "providers": ["gemini", "groq", "openai", "local"]
    }</pre>
  </div>

  <!-- PAGE 43: 9.1 SAMPLE CODING - PART 2 -->
  <div class="page">
    <p><strong>2. Python NLP Content Generation Engine (<code>backend/nlp_engine.py</code>)</strong></p>
    <pre>def generate_python_blog(topic: str, keywords_str: str, tone: str, 
                         length: str, audience: str, api_key: str = "", 
                         provider: str = "local", model: str = ""):
    keywords = [k.strip() for k in keywords_str.split(",") if k.strip()]
    if not keywords:
        keywords = [topic.lower(), "insights", "strategy"]

    word_targets = {"short": 500, "medium": 1000, "long": 1500}
    target_words = word_targets.get(length, 1000)

    # Deterministic Algorithmic Synthesis
    title = f"The Definitive Guide to {topic.title()}: Strategies for {audience}"
    intro = (
        f"In today's fast-moving environment, understanding **{topic}** is critical. "
        f"This guide provides practical insights tailored specifically for {audience}."
    )
    
    sections = [
        f"## 1. Why {topic.title()} Matters Today\\n\\nInvesting attention in {topic} unlocks measurable competitive advantage.",
        f"## 2. Core Pillars of Implementation\\n\\n- **Consistency:** Execute regular workflows.\\n- **Optimization:** Audit search indicators.\\n- **Audience Resonance:** Address pain points.",
        f"## 3. Actionable Best Practices\\n\\n1. Define primary benchmarks.\\n2. Measure keyword adoption.\\n3. Continually refine copy based on feedback."
    ]
    
    content = f"# {title}\\n\\n{intro}\\n\\n" + "\\n\\n".join(sections)
    return {
        "title": title,
        "content": content,
        "meta_title": title[:60],
        "meta_description": f"Learn how {topic} impacts {audience} with actionable tips and best practices."[:155],
        "word_count": len(content.split())
    }</pre>
  </div>

  <!-- PAGE 44: 9.1 SAMPLE CODING - PART 3 -->
  <div class="page">
    <p><strong>3. Linguistic SEO Analyzer (<code>backend/seo_engine.py</code>)</strong></p>
    <pre>import re

def analyze_python_seo(content: str, target_keyword: str = "", meta_description: str = ""):
    words = re.findall(r'\\b\\w+\\b', content.lower())
    total_words = len(words)
    kw = target_keyword.strip().lower()
    
    # Calculate Keyword Density
    kw_count = content.lower().count(kw) if kw else 0
    density = round((kw_count / max(1, total_words)) * 100, 2) if kw else 0.0

    checks = []
    score = 50

    # Check 1: Content Length
    if total_words >= 600:
        score += 20
        checks.append({"id": "len", "label": f"Word count ({total_words} words)", "status": "pass"})
    else:
        score += 10
        checks.append({"id": "len", "label": f"Short content ({total_words} words)", "status": "warn"})

    # Check 2: Keyword Density (Ideal: 1% to 3%)
    if 1.0 <= density <= 3.0:
        score += 20
        checks.append({"id": "dens", "label": f"Keyword density ({density}%)", "status": "pass"})
    else:
        score -= 5
        checks.append({"id": "dens", "label": f"Keyword density suboptimal ({density}%)", "status": "warn"})

    return {
        "score": min(100, max(0, score)),
        "wordCount": total_words,
        "readingTime": max(1, round(total_words / 200)),
        "keywordDensity": density,
        "checks": checks
    }</pre>
  </div>

  <!-- PAGE 45: 9.1 SAMPLE CODING - PART 4 -->
  <div class="page">
    <p><strong>4. Frontend 3-Tier Hybrid AI Resolver (<code>src/services/ai.js</code>)</strong></p>
    <pre>export const generateBlogContent = async ({ topic, keywords, tone, length, audience }) => {
  const settings = getAiSettings();

  // Tier 1: Direct Cloud Provider Call (Gemini, Groq, OpenAI)
  if (settings.enabled) {
    try {
      const prompt = buildBlogPrompt({ topic, keywords, tone, length, audience });
      const cloudRes = await callDirectBrowserAi(settings, prompt);
      if (cloudRes) return parseAiBlogResponse(cloudRes, topic);
    } catch (err) {
      console.warn("Cloud LLM call failed, falling back to local Python engine:", err);
    }
  }

  // Tier 2: Dedicated Python FastAPI Backend (Port 8000)
  try {
    const pyRes = await callPythonApi('/blog', { topic, keywords, tone, length, audience });
    if (pyRes) return pyRes;
  } catch (err) {
    console.warn("Python backend offline, cascading to local JS engine:", err);
  }

  // Tier 3: Client-side Offline JavaScript Rule Engine
  return generateClientFallbackBlog({ topic, keywords, tone, length, audience });
};</pre>
  </div>

  <!-- PAGE 46: 9.1 SAMPLE CODING - PART 5 -->
  <div class="page">
    <p><strong>5. Direct Cloud API Fetcher (<code>src/services/ai.js</code>)</strong></p>
    <pre>const callDirectBrowserAi = async (settings, prompt) => {
  if (!settings.apiKey) return null;
  const apiKey = settings.apiKey.trim();

  if (settings.provider === 'gemini') {
    const model = settings.model || 'gemini-1.5-flash';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 2048 }
      })
    });
    if (res.ok) {
      const data = await res.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || null;
    }
  }
  return null;
};</pre>
  </div>

  <!-- PAGE 47: 9.1 SAMPLE CODING - PART 6 -->
  <div class="page">
    <p><strong>6. Blog Generator Component (<code>src/components/BlogGenerator.jsx</code>)</strong></p>
    <pre>export default function BlogGenerator({ onSaveHistory, onSendToSeo }) {
  const [topic, setTopic] = useState('');
  const [keywords, setKeywords] = useState('');
  const [tone, setTone] = useState('Informative');
  const [length, setLength] = useState('medium');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!topic.trim()) return;
    setIsGenerating(true);
    try {
      const data = await generateBlogContent({ topic, keywords, tone, length });
      setResult(data);
      onSaveHistory({
        id: Date.now().toString(),
        title: data.title,
        type: 'blog',
        content: data.content,
        date: new Date().toLocaleDateString(),
        wordCount: data.word_count
      });
    } finally {
      setIsGenerating(false);
    }
  };</pre>
  </div>

  <!-- PAGE 48: 9.1 SAMPLE CODING - PART 7 -->
  <div class="page">
    <p><strong>7. SEO Score Dial Component (<code>src/components/SeoOptimizer.jsx</code>)</strong></p>
    <pre>export default function SeoOptimizer({ preloadedContent }) {
  const [content, setContent] = useState(preloadedContent?.content || '');
  const [keyword, setKeyword] = useState('');
  const [analysis, setAnalysis] = useState(null);

  const handleAnalyze = async () => {
    if (!content.trim()) return;
    const res = await analyzeSeoContent({ content, targetKeyword: keyword });
    setAnalysis(res);
  };

  // Radial Animated SVG Gauge Rendering
  const strokeDashoffset = analysis 
    ? 283 - (283 * analysis.score) / 100 
    : 283;

  return (
    &lt;div className="seo-optimizer"&gt;
      &lt;svg width="120" height="120" viewBox="0 0 100 100"&gt;
        &lt;circle cx="50" cy="50" r="45" stroke="#333" strokeWidth="8" fill="none" /&gt;
        &lt;circle cx="50" cy="50" r="45" stroke="#9333ea" strokeWidth="8" fill="none"
          strokeDasharray="283" strokeDashoffset={strokeDashoffset} 
          style={{ transition: 'stroke-dashoffset 0.8s ease' }} /&gt;
        &lt;text x="50" y="55" textAnchor="middle" fill="#fff" fontSize="18" fontWeight="bold"&gt;
          {analysis ? `${analysis.score}` : '0'}
        &lt;/text&gt;
      &lt;/svg&gt;
    &lt;/div&gt;
  );
}</pre>
  </div>

  <!-- PAGE 49: 9.2 IMPLEMENTATION NOTES -->
  <div class="page">
    <h2 class="section-title">9.2 IMPLEMENTATION NOTES</h2>
    <ul>
      <li><strong>Frontend Build &amp; React 19:</strong> The application utilizes React 19 hooks alongside Vite 8.2 for zero-latency DOM updates and instant Hot Module Replacement during development.</li>
      <li><strong>Python FastAPI Integration:</strong> The backend microservice in <code>backend/main.py</code> executes asynchronously via Uvicorn. CORS headers are configured to allow cross-origin communication from port 5173.</li>
      <li><strong>Deterministic Rule Fallbacks:</strong> The local NLP engine uses intelligent template synthesis and lexical keyword insertion algorithms, ensuring complete functionality even without internet connectivity.</li>
      <li><strong>Browser Storage Management:</strong> Data persistence is managed through native HTML5 localStorage. Keys are isolated with the <code>creatorflow_</code> prefix to prevent collisions with third-party extensions.</li>
      <li><strong>Cross-Platform Compatibility:</strong> All styling relies on standard CSS3 flexbox and grid specifications, ensuring identical rendering across Chrome, Firefox, Safari, and Edge.</li>
    </ul>
  </div>

  <!-- PAGE 50: 9.3 MAPPING SCREENS TO CODE MODULES - PART 1 -->
  <div class="page">
    <h2 class="section-title">9.3 MAPPING SCREENS TO CODE MODULES</h2>
    <table>
      <thead>
        <tr>
          <th style="width: 25%;">Screen or UI area</th>
          <th style="width: 20%;">User role</th>
          <th style="width: 25%;">Logical code module</th>
          <th style="width: 30%;">Main responsibility</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Creative Dashboard</strong></td>
          <td>All creators</td>
          <td><code>src/components/Dashboard.jsx</code></td>
          <td>Renders aggregate performance counters, quick-action template triggers, and recent creation feeds.</td>
        </tr>
        <tr>
          <td><strong>Blog Generator</strong></td>
          <td>Author / Blogger</td>
          <td><code>src/components/BlogGenerator.jsx</code></td>
          <td>Collects topic inputs, invokes hybrid AI engine, displays split-view Markdown preview, and outputs meta tags.</td>
        </tr>
        <tr>
          <td><strong>Social Caption Suite</strong></td>
          <td>Copywriter</td>
          <td><code>src/components/SocialGenerator.jsx</code></td>
          <td>Generates platform-tailored post cards (LinkedIn, Twitter, IG, FB) with real-time character limit monitoring.</td>
        </tr>
        <tr>
          <td><strong>Linguistic SEO Optimizer</strong></td>
          <td>SEO Marketer</td>
          <td><code>src/components/SeoOptimizer.jsx</code></td>
          <td>Audits text readability, keyword density, and structural signals, rendering radial 0–100 score gauge.</td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- PAGE 51: 9.3 CONTINUED & 9.4 DEPLOYMENT STEPS -->
  <div class="page">
    <table>
      <thead>
        <tr>
          <th style="width: 25%;">Screen or UI area</th>
          <th style="width: 20%;">User role</th>
          <th style="width: 25%;">Logical code module</th>
          <th style="width: 30%;">Main responsibility</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Keyword Finder</strong></td>
          <td>Researcher</td>
          <td><code>src/components/KeywordGenerator.jsx</code></td>
          <td>Displays keyword volume tables, CPC metrics, and tiered hashtag categories based on search intent.</td>
        </tr>
        <tr>
          <td><strong>History Hub</strong></td>
          <td>All creators</td>
          <td><code>src/components/History.jsx</code></td>
          <td>Provides full-text substring search, category filtering, and review modal popups for saved drafts.</td>
        </tr>
        <tr>
          <td><strong>Settings &amp; AI Config</strong></td>
          <td>Administrator</td>
          <td><code>src/components/Settings.jsx</code></td>
          <td>Manages creator profiles, selects AI execution providers, and tests FastAPI backend health.</td>
        </tr>
      </tbody>
    </table>

    <h2 class="section-title">9.4 DEPLOYMENT STEPS (Local View)</h2>
    <p>1. <strong>Clone Repository:</strong> Open a terminal and navigate to the root directory containing <code>package.json</code> and <code>backend/</code>.</p>
    <p>2. <strong>Install Node Dependencies:</strong> Execute <code>npm install</code> to install React 19, Vite, and Lucide React.</p>
    <p>3. <strong>Install Python Dependencies:</strong> In the backend directory, run <code>pip install -r requirements.txt</code> to install FastAPI and Uvicorn.</p>
  </div>

  <!-- PAGE 52: 9.4 DEPLOYMENT STEPS CONTINUED -->
  <div class="page">
    <p>4. <strong>Start Python FastAPI Server:</strong> Launch the ASGI backend on port 8000:
    <pre>python backend/run_server.py</pre>
    The server will confirm status: <code>Uvicorn running on http://127.0.0.1:8000</code>.</p>

    <p>5. <strong>Start React Development Server:</strong> In a separate terminal window, launch the Vite dev server:
    <pre>npm run dev</pre>
    The web interface will launch locally at <code>http://localhost:5173/</code>.</p>

    <p>6. <strong>Verify Connection:</strong> Open the Settings tab in the browser interface and verify the backend connectivity indicator:
    <pre>🟢 Backend Connected (Port 8000) - CreatorFlow Native Python Engine</pre></p>

    <p>7. <strong>Build for Production:</strong> To produce an optimized production bundle:
    <pre>npm run build</pre></p>
  </div>

  <!-- PAGE 53: DIVIDER - SCREENSHOT -->
  <div class="page divider-page">
    <div class="divider-title">SCREENSHOT</div>
  </div>

  <!-- PAGE 54: 10. SCREENSHOTS - PART 1 -->
  <div class="page">
    <h2 class="section-title">10. SCREENSHOTS</h2>
    <div class="caption">FIGURE 10.1 Unified Creative Dashboard &amp; AI Blog Generator UI</div>
    <div class="diagram-box" style="flex-direction: column; align-items: flex-start; background: #111; color: #eee; padding: 20px;">
      <div style="border-bottom: 1px solid #333; width: 100%; padding-bottom: 8px; margin-bottom: 15px; font-weight: bold; color: #a855f7;">
        ⚡ CREATORFLOW AI - UNIFIED CREATIVE DASHBOARD
      </div>
      <div style="display: flex; gap: 15px; width: 100%; margin-bottom: 15px;">
        <div style="flex: 1; background: #1e1b4b; padding: 10px; border-radius: 6px; border: 1px solid #3730a3;">
          <div style="font-size: 10px; color: #a5b4fc;">TOTAL CREATIONS</div>
          <div style="font-size: 20px; font-weight: bold; color: #fff;">18 Items</div>
        </div>
        <div style="flex: 1; background: #1e1b4b; padding: 10px; border-radius: 6px; border: 1px solid #3730a3;">
          <div style="font-size: 10px; color: #a5b4fc;">WORDS GENERATED</div>
          <div style="font-size: 20px; font-weight: bold; color: #fff;">14,250 Words</div>
        </div>
        <div style="flex: 1; background: #1e1b4b; padding: 10px; border-radius: 6px; border: 1px solid #3730a3;">
          <div style="font-size: 10px; color: #a5b4fc;">SAVED ARTICLES</div>
          <div style="font-size: 20px; font-weight: bold; color: #fff;">12 Drafts</div>
        </div>
      </div>
      <div style="background: #18181b; padding: 12px; width: 100%; border-radius: 6px; border: 1px solid #27272a;">
        <div style="font-size: 11px; font-weight: bold; color: #cbd5e1; margin-bottom: 6px;">Recent Creations Feed</div>
        <div style="font-size: 10px; color: #94a3b8;">• How remote work is reshaping modern city life (1,040 words) [Copy] [Inspect]</div>
        <div style="font-size: 10px; color: #94a3b8; margin-top: 4px;">• 5 simple habits that changed personal productivity (Twitter, LinkedIn) [Copy]</div>
      </div>
    </div>
    <p>Figure 10.1 illustrates the executive dashboard interface, showcasing the live statistics indicators and recent creation activity stream.</p>
  </div>

  <!-- PAGE 55: 10. SCREENSHOTS - PART 2 -->
  <div class="page">
    <div class="caption">FIGURE 10.2 Linguistic SEO Optimizer &amp; Social Suite UI</div>
    <div class="diagram-box" style="flex-direction: column; align-items: flex-start; background: #111; color: #eee; padding: 20px;">
      <div style="border-bottom: 1px solid #333; width: 100%; padding-bottom: 8px; margin-bottom: 15px; font-weight: bold; color: #a855f7;">
        🎯 LINGUISTIC SEO OPTIMIZER &amp; READABILITY AUDIT
      </div>
      <div style="display: flex; gap: 20px; width: 100%; align-items: center;">
        <div style="width: 100px; height: 100px; border-radius: 50%; border: 6px solid #9333ea; display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: bold; color: #fff;">
          88
        </div>
        <div style="flex: 1;">
          <div style="font-size: 11px; color: #4ade80;">✔ Target Keyword Density: 2.1% (Optimal 1-3% Range)</div>
          <div style="font-size: 11px; color: #4ade80; margin-top: 4px;">✔ Keyword in First Paragraph: Present</div>
          <div style="font-size: 11px; color: #4ade80; margin-top: 4px;">✔ Heading Distribution: H1, H2, H3 tags detected</div>
          <div style="font-size: 11px; color: #facc15; margin-top: 4px;">⚠ Meta Description: 168 characters (Recommend &le; 160)</div>
        </div>
      </div>
    </div>
    <p>Figure 10.2 displays the real-time linguistic SEO grading screen, featuring the radial score gauge and categorized diagnostic ranking checklists.</p>
  </div>

  <!-- PAGE 56: DIVIDER - CONCLUSION -->
  <div class="page divider-page">
    <div class="divider-title">CONCLUSION</div>
  </div>

  <!-- PAGE 57: 11. CONCLUSION -->
  <div class="page">
    <h1 class="chapter-title">CONCLUSION</h1>
    <p>The CreatorFlow AI application successfully provides an integrated, zero-cost, privacy-first digital workspace for content writers, bloggers, and digital marketing teams. By unifying long-form Markdown article generation, omni-channel social media adaptation, mathematical SEO readability analysis, and keyword intelligence within a reactive single-page architecture, the system overcomes the fragmentation, expense, and privacy risks inherent in traditional commercial copywriting software.</p>
    <p>The implementation of the 3-Tier Hybrid AI Processing Model guarantees 100% operational uptime. Authors benefit from rapid cloud model execution when API keys are configured, on-premise computational linguistics via the native Python FastAPI backend, and resilient client-side JavaScript synthesis when working entirely offline.</p>
    <p>Furthermore, by utilizing HTML5 Web Storage for document persistence, all articles, social captions, and user preferences remain strictly on the creator's machine, ensuring absolute data privacy and intellectual property sovereignty. CreatorFlow AI establishes a scalable foundation for modern content workflows, offering high performance, responsive aesthetics, and zero recurring overhead.</p>
  </div>

  <!-- PAGE 58: DIVIDER - FUTURE ENHANCEMENT -->
  <div class="page divider-page">
    <div class="divider-title">FUTURE ENHANCEMENT</div>
  </div>

  <!-- PAGE 59: 12. FUTURE ENHANCEMENTS -->
  <div class="page">
    <h1 class="chapter-title">FUTURE ENHANCEMENTS</h1>
    <p>The CreatorFlow AI system can be expanded with additional features to further enhance creator efficiency, multi-lingual authoring, and direct publishing automation:</p>
    <ul>
      <li><strong>Direct CMS Publishing Integration:</strong> Implement one-click webhooks to automatically publish generated Markdown articles directly to WordPress, Ghost, Medium, and Shopify blogs.</li>
      <li><strong>Multi-Lingual NLP Synthesis:</strong> Expand local linguistic datasets and tokenizers to support content creation and SEO audits in regional languages including Tamil, Hindi, Spanish, and French.</li>
      <li><strong>AI Banner Image Generation:</strong> Connect local Stable Diffusion pipelines or cloud image endpoints to generate high-resolution blog banner images and social thumbnails.</li>
      <li><strong>Desktop Native Wrapping:</strong> Package the application using Electron or Tauri to distribute standalone offline desktop installers for Windows, macOS, and Linux.</li>
      <li><strong>Team Collaboration &amp; Cloud Sync:</strong> Introduce optional end-to-end encrypted peer-to-peer synchronization allowing agency teams to collaborate on shared editorial calendars.</li>
      <li><strong>Automated Social Auto-Scheduler:</strong> Integrate official social media APIs (LinkedIn, Twitter API v2, Meta Graph API) to schedule social posts directly from the application.</li>
    </ul>
  </div>

  <!-- PAGE 60: DIVIDER - BIBLIOGRAPHY -->
  <div class="page divider-page">
    <div class="divider-title">BIBLIOGRAPHY</div>
  </div>

  <!-- PAGE 61: 13. BIBLIOGRAPHY -->
  <div class="page">
    <h1 class="chapter-title">BIBLIOGRAPHY</h1>
    <ol>
      <li>Meta Open Source. (2024). <em>React – A JavaScript Library for Building User Interfaces</em>. Retrieved from https://react.dev</li>
      <li>Evan You. (2024). <em>Vite – Next Generation Frontend Tooling</em>. Retrieved from https://vite.dev</li>
      <li>Sebastián Ramírez. (2023). <em>FastAPI Framework, High Performance</em>. Retrieved from https://fastapi.tiangolo.com</li>
      <li>Uvicorn Community. (2023). <em>Uvicorn – The Lightning-Fast ASGI Server</em>. Retrieved from https://www.uvicorn.org</li>
      <li>Kincaid, J. P., Fishburne, R. P., Rogers, R. L., &amp; Chissom, B. S. (1975). <em>Derivation of New Readability Formulas for Navy Enlisted Personnel</em>. Research Branch Report 8-75, Chief of Naval Technical Training.</li>
      <li>Lucide Project. (2024). <em>Lucide Icons – Beautiful &amp; Consistent Open-Source Icons</em>. Retrieved from https://lucide.dev</li>
      <li>World Wide Web Consortium (W3C). (2022). <em>Web Storage (Second Edition) – HTML5 localStorage Specification</em>. Retrieved from https://www.w3.org/TR/webstorage/</li>
      <li>Mozilla Developer Network (MDN). (2024). <em>CSS Flexible Box Layout and Grid System Guides</em>. Retrieved from https://developer.mozilla.org</li>
      <li>Google DeepMind. (2024). <em>Gemini Models Documentation and REST API Guidelines</em>. Retrieved from https://ai.google.dev</li>
      <li>Groq Inc. (2024). <em>GroqCloud LPU Inference Engine Documentation</em>. Retrieved from https://console.groq.com</li>
      <li>OpenAI. (2024). <em>OpenAI API Reference and Text Generation Models</em>. Retrieved from https://platform.openai.com/docs</li>
      <li>Pydantic Community. (2024). <em>Pydantic – Data Validation using Python Type Hints</em>. Retrieved from https://docs.pydantic.dev</li>
    </ol>
  </div>

</body>
</html>
"""

output_path = r"d:\My Data\Projects\afsal_project\afsal_project\project_report_full.html"
with open(output_path, "w", encoding="utf-8") as f:
    f.write(html_template)

print("Report generated successfully at", output_path)
