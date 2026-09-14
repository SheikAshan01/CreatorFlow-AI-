# CreatorFlow AI - Blog & Social Media Content Writer

CreatorFlow AI is a modern, high-performance, and serverless client-side content suite designed for bloggers, marketers, copywriters, and social media managers. 

Built with a premium glassmorphic UI design, the application runs entirely locally in your browser. It provides zero-latency content generation, platform-optimized captions, keyword metrics research, and real-time SEO audits without requiring external database integrations or paid third-party API keys.

---

## 🌟 Key Modules & Features

### 1. Unified Creative Dashboard
- **Quick Statistics:** Monitors total generated items, word counts, and saved copy history items.
- **Quick Toolkit:** Launch templates instantly for blog writing, social posts, SEO checks, or keyword research.
- **Creations feed:** Direct quick-copy actions and one-click preview buttons for recent items.

### 2. AI Blog Article Generator
- **Multi-Input Controls:** Customize topic focus, target audience description, primary/secondary keywords, and target length (Short ~500 words, Medium ~1000 words, Long ~1500+ words).
- **Brand Tone Settings:** Configure voice filters including Informative, Professional, Casual, Witty, or Persuasive.
- **Integrated Markdown Editor:** Switch between a rendered HTML preview and a raw editable Markdown textbox.
- **Meta tags summaries:** Automatic suggestions for SEO-friendly title tags, character-checked meta descriptions, and keyword categories.

### 3. Social Caption Generator
- **Multi-Platform Outputs:** Draft ready-to-publish posts for LinkedIn, X (Twitter), Instagram, and Facebook simultaneously.
- **Character Count Auditing:** Highlights character length limits with colored warning tags (e.g., alert triggers if X/Twitter post exceeds 280 characters).
- **Formatting Hooks:** Dynamic integration of platform-relevant layouts, bullet structures, call-to-actions, and emoji styles.

### 4. Linguistic SEO Content Optimizer
- **SEO Grade Score:** Animated radial SVG dial computing a score from 0-100 based on search signals.
- **Auditing Signals Checklist:** Evaluates copy content lengths, target keyword densities, keyword placements (first paragraph, headers), and meta tag counts, showing pass/warn/fail alerts.

### 5. Keyword & Hashtag Finder
- **Keyword Research Tables:** Inspect secondary search terms, estimated search volumes, CPC cost metrics, and competition difficulty ratings.
- **Search Intent Selector:** Filters keyword output variations for Informational vs. Transactional intents.
- **Hashtag Bucket tiers:** Separates relevant hashtags into High-Volume, Medium-Volume, and Low-Volume/Niche categories.

### 6. Local Saved History Hub
- **Database Persistence:** Synchronizes generated items locally using the browser's `localStorage` (keeps your files secure, private, and offline-accessible).
- **Filter Controls:** Fast text search and category buttons (Blogs vs. Social Captions).
- **Review Modal Overlay:** Inspect full text structures, copy details, or delete items instantly.

---

## 🛠️ Technology Stack & Languages Used

- **HTML5:** Structures the DOM layout.
- **JavaScript (ES6+):** Orchestrates React component lifecycle, handles state routing, local storage synchronization, and hosts the custom local Content Synthesis & SEO grading engines.
- **React (v18):** Powering the reactive component hierarchy, tab management, and DOM bindings.
- **Vite:** High-speed dev server and production compiler bundler.
- **Vanilla CSS:** Styled entirely without external UI frameworks. Uses custom CSS variables (Obsidian backgrounds, blur backdrop filters, glowing violet gradients), keyframes animations (pulse loaders, fade-ins), and responsive flex grids.
- **Lucide Icons:** Integrated as SVG path renderers for modern sidebar indicators.
- **Python Backend (FastAPI + Uvicorn):** Powers local, zero-external-API content generation, tone styling, and Flesch-Kincaid linguistic SEO analysis.

---

## 🚀 Getting Started (How to Run)

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [Python](https://www.python.org/) (v3.10+) with `fastapi` and `uvicorn`

### Step-by-Step Instructions

1. **Start the Python Local AI Backend Server:**
   Open a terminal window and run:
   ```bash
   python backend/run_server.py
   ```
   *The Python FastAPI server will boot at `http://127.0.0.1:8000` with Swagger docs at `http://127.0.0.1:8000/docs`.*

2. **Start the React Frontend (Vite):**
   Open a second terminal window and run:
   ```bash
   npm run dev
   ```
   *The web app will open at `http://localhost:5173/`.*

3. **Verify Connection:**
   Navigate to the **Settings** tab in the web app. You will see:
   > 🟢 **Backend Connected (Port 8000)** - *CreatorFlow Native Python NLP / ML Engine*

4. **Build for Production:**
   To compile and compress the frontend for deployment:
   ```bash
   npm run build
   ```
# CreatorFlow-AI-
