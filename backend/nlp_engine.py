"""
Custom Python NLP Engine for CreatorFlow AI
Supports Real AI Models (Google Gemini, Groq, OpenAI) via direct Python REST calls,
with an intelligent, topic-accurate contextual engine that ensures zero nonsensical outputs.
"""

import re
import json
import urllib.request
import urllib.error
from typing import Dict, List, Any


def count_words(text: str) -> int:
    return len(re.findall(r"\b\w+\b", text))


def estimate_reading_time(word_count: int) -> int:
    return max(1, round(word_count / 200))


def call_gemini_api(prompt: str, api_key: str, model: str = "") -> str:
    """Calls Google Gemini API with automatic fallback across popular models."""
    api_key_clean = api_key.strip()
    candidate_models = []
    if model and model != "gemini-2.5-flash":
        candidate_models.append(model)
    for m in ["gemini-1.5-flash", "gemini-2.0-flash", "gemini-1.5-pro"]:
        if m not in candidate_models:
            candidate_models.append(m)

    for m in candidate_models:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{m}:generateContent?key={api_key_clean}"
        body = json.dumps({
            "contents": [{"role": "user", "parts": [{"text": prompt}]}]
        }).encode("utf-8")
        req = urllib.request.Request(url, data=body, headers={"Content-Type": "application/json"})
        try:
            with urllib.request.urlopen(req, timeout=20) as resp:
                data = json.loads(resp.read().decode("utf-8"))
                parts = data.get("candidates", [{}])[0].get("content", {}).get("parts", [])
                text = "\n".join(p.get("text", "") for p in parts).strip()
                if text:
                    print(f"[Python AI] Successfully generated via Gemini ({m})")
                    return text
        except urllib.error.HTTPError as e:
            print(f"[Python AI] Gemini model {m} HTTP error: {e.code}")
            continue
        except Exception as e:
            print(f"[Python AI] Gemini model {m} failed: {e}")
            continue
    return ""


def call_real_ai_model(prompt: str, provider: str = "gemini", api_key: str = "", model: str = "") -> str:
    """Invokes real cloud AI models directly from Python with zero external pip dependencies."""
    if not api_key or not api_key.strip():
        return ""

    provider_clean = (provider or "gemini").strip().lower()
    api_key_clean = api_key.strip()

    if provider_clean == "gemini":
        return call_gemini_api(prompt, api_key_clean, model)

    elif provider_clean == "groq":
        model_name = model or "llama-3.1-8b-instant"
        url = "https://api.groq.com/openai/v1/chat/completions"
        body = json.dumps({
            "model": model_name,
            "messages": [{"role": "user", "content": prompt}]
        }).encode("utf-8")
        req = urllib.request.Request(url, data=body, headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {api_key_clean}"
        })
        try:
            with urllib.request.urlopen(req, timeout=25) as resp:
                data = json.loads(resp.read().decode("utf-8"))
                return data.get("choices", [{}])[0].get("message", {}).get("content", "").strip()
        except Exception as e:
            print(f"[Python AI] Groq call failed: {e}")
            return ""

    elif provider_clean == "openai":
        model_name = model or "gpt-4o-mini"
        url = "https://api.openai.com/v1/chat/completions"
        body = json.dumps({
            "model": model_name,
            "messages": [{"role": "user", "content": prompt}]
        }).encode("utf-8")
        req = urllib.request.Request(url, data=body, headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {api_key_clean}"
        })
        try:
            with urllib.request.urlopen(req, timeout=25) as resp:
                data = json.loads(resp.read().decode("utf-8"))
                return data.get("choices", [{}])[0].get("message", {}).get("content", "").strip()
        except Exception as e:
            print(f"[Python AI] OpenAI call failed: {e}")
            return ""

    return ""


# =========================================================================
# ACCURATE TOPIC CONTEXT CLASSIFIER
# =========================================================================
def analyze_topic_context(topic: str) -> Dict[str, Any]:
    t = topic.lower().strip()
    words = [w for w in re.split(r"[^\w]+", topic) if w]
    tag = "".join(w.capitalize() for w in words[:2]) or "Tech"

    # 1. Computer / Laptop / PC
    if re.search(r"\b(laptop|macbook|notebook|pc|desktop|computer|thinkpad|chromebook|asus|dell|hp|lenovo)\b", t):
        return {
            "type": "laptop",
            "tag": tag,
            "hashtags": [f"#{tag}", "#LaptopLife", "#TechSetup", "#Workstation", "#ProductivitySetup", "#PCMasterRace"]
        }

    # 2. Smartphone / Mobile Gadgets
    if re.search(r"\b(phone|smartphone|samsung|galaxy|iphone|pixel|oneplus|xiaomi|s2[0-9]|ultra|pro max)\b", t):
        return {
            "type": "smartphone",
            "tag": tag,
            "hashtags": [f"#{tag}", "#SmartphoneReview", "#MobileTech", "#TechGadgets", "#FlagshipPhone"]
        }

    # 3. SEO / Search Engine Marketing
    if re.search(r"\b(seo|search engine|ranking|backlink|keywords?|google rank|organic search|on page|serp)\b", t):
        return {
            "type": "seo",
            "tag": tag,
            "hashtags": [f"#{tag}", "#SEOTips", "#SearchEngineOptimization", "#OrganicTraffic", "#DigitalMarketing", "#GoogleRanking"]
        }

    # 4. Software / Coding / Web Development
    if re.search(r"\b(code|coding|python|javascript|react|developer|api|backend|frontend|programming|web dev|github)\b", t):
        return {
            "type": "coding",
            "tag": tag,
            "hashtags": [f"#{tag}", "#WebDev", "#CodingLife", "#ProgrammingTips", "#SoftwareEngineering", "#Developer"]
        }

    # 5. Marketing / Business / Growth
    if re.search(r"\b(marketing|sales|brand|branding|ecommerce|lead gen|funnel|copywriting|b2b|advertising)\b", t):
        return {
            "type": "marketing",
            "tag": tag,
            "hashtags": [f"#{tag}", "#MarketingStrategy", "#BusinessGrowth", "#BrandingTips", "#GrowthHacking"]
        }

    # 6. Fitness / Health
    if re.search(r"\b(fitness|workout|gym|diet|nutrition|health|muscle|weight loss|sleep|running)\b", t):
        return {
            "type": "fitness",
            "tag": tag,
            "hashtags": [f"#{tag}", "#FitnessGoals", "#HealthyLiving", "#WorkoutMotivation", "#NutritionTips"]
        }

    # 7. Finance / Investing
    if re.search(r"\b(money|finance|invest|investing|crypto|bitcoin|stocks|budget|wealth|savings)\b", t):
        return {
            "type": "finance",
            "tag": tag,
            "hashtags": [f"#{tag}", "#PersonalFinance", "#InvestingTips", "#FinancialFreedom", "#WealthBuilding"]
        }

    # Default general
    return {
        "type": "general",
        "tag": tag,
        "hashtags": [f"#{tag}", "#Insights", "#BestPractices", "#ModernTrends", "#KnowledgeSharing"]
    }


# =========================================================================
# 1. BLOG GENERATOR
# =========================================================================
def generate_python_blog(
    topic: str,
    keywords_str: str = "",
    tone: str = "Informative",
    length: str = "medium",
    audience: str = "Business Owners & Creators",
    api_key: str = "",
    provider: str = "local",
    model: str = ""
) -> Dict[str, Any]:
    """Generates a complete blog post, using Real AI if configured, or smart domain-specific NLP synthesis."""
    topic_clean = topic.strip() or "Modern Digital Strategies"
    keywords = [k.strip() for k in re.split(r"[,;]", keywords_str) if k.strip()]

    # 1. Real AI Model First if API key is present
    if api_key and api_key.strip():
        prompt = (
            f"Write an in-depth, authoritative, engaging blog article in clean Markdown on the exact topic: '{topic_clean}'.\n"
            f"Target Audience: {audience}\n"
            f"Tone: {tone}\n"
            f"Target Keywords to weave in naturally: {', '.join(keywords) if keywords else topic_clean}\n\n"
            f"Formatting rules:\n"
            f"- Start with a compelling '# Title'\n"
            f"- A detailed introduction explaining why {topic_clean} is critical\n"
            f"- 3 to 4 detailed '## Section Headings' with bullet points, actionable breakdowns, real-world examples, and data\n"
            f"- A practical '## Conclusion' with key takeaways\n"
            f"Return ONLY valid Markdown without extra chatter."
        )
        ai_output = call_real_ai_model(prompt, provider=provider, api_key=api_key, model=model)
        if ai_output and len(ai_output) > 250:
            title_match = re.search(r"^#\s+(.+)$", ai_output, re.MULTILINE)
            title = title_match.group(1).strip() if title_match else f"The Complete Guide to {topic_clean}"
            words = count_words(ai_output)
            meta_desc = f"Master {topic_clean} with practical strategies and actionable advice for {audience}."
            return {
                "title": title,
                "content": ai_output,
                "wordCount": words,
                "readingTime": estimate_reading_time(words),
                "metaDescription": meta_desc[:155],
                "keywordsSuggested": keywords[:4] if keywords else [topic_clean.lower(), "guide", "strategy"],
                "engine": f"Real AI ({provider.upper()} - {model or 'Online'})",
                "tone": tone
            }

    # 2. Context-Accurate Local Generator
    ctx = analyze_topic_context(topic_clean)
    ttype = ctx["type"]

    if ttype == "laptop":
        title = f"{topic_clean} Guide: Performance, Battery Life & Buyer's Checklist"
        body = f"""# {title}

Choosing the right machine for work, creative tasks, or coding requires evaluating real-world computing power rather than just spec sheets. In this breakdown of the **{topic_clean}**, we examine everyday performance, display fidelity, keyboard ergonomics, and long-term durability for **{audience}**.

## Processing Power & Multitasking Capabilities
A reliable laptop must manage heavy browser tab counts, IDEs, video editing, and background software without stuttering or aggressive fan noise.
- **CPU & GPU Efficiency:** Quick application load times and consistent frame rates under sustained computing load.
- **Thermal Management:** Efficient heat dissipation to prevent throttling during intensive workflows.
- **RAM & Storage Throughput:** Fast NVMe read/write speeds ensure rapid file transfers and instant multitasking.

## Display Quality, Battery Endurance & Portability
Whether working from a desk, coffee shop, or during travel, screen brightness and real-world battery endurance dictate productivity:
- **Screen Clarity:** Vibrant color accuracy and anti-glare coatings make prolonged work sessions easier on the eyes.
- **All-Day Battery:** Reliable battery architecture that delivers 8+ hours of screen-on productivity without hunting for an outlet.
- **Chassis & Keyboard:** Sturdy hinges, responsive key travel, and a smooth precision glass trackpad.

## Final Verdict
If you value seamless everyday performance, strong build materials, and a dependable battery life, the **{topic_clean}** represents a worthwhile investment for modern workflows.
"""
    elif ttype == "seo":
        title = f"Demystifying {topic_clean.title()}: Strategies to Rank Higher & Drive Organic Traffic"
        body = f"""# {title}

In modern digital marketing, **{topic_clean}** is the foundational engine that separates businesses with sustainable organic traffic from those constantly burning budgets on paid ads. For **{audience}**, mastering search signals is essential for compounding visibility.

## Understanding Core Search Intent & Keyword Relevance
Search engines like Google prioritize delivering the exact answer users are looking for. 
- **Search Intent Alignment:** Distinguish between informational searches ("how to", "what is") and transactional queries ("best", "pricing").
- **On-Page Keyword Placement:** Ensure target keywords appear naturally in the H1 title, intro paragraph, and subheadings without keyword stuffing.
- **Content Depth:** Comprehensive, well-researched answers reduce bounce rates and increase average time-on-page.

## Technical Health, Speed & Site Architecture
SEO is not just about words; search bots evaluate site performance and user experience:
- **Core Web Vitals:** Fast page load times (LCP under 2.5s) prevent visitor drop-off.
- **Internal Linking:** Structuring topic clusters passes authority across related articles.
- **Mobile Responsiveness:** A flawless mobile layout is mandatory for Google's mobile-first indexing.

## Actionable Takeaways
Success in {topic_clean} comes from consistency. Perform regular content audits, build quality backlinks, and prioritize genuine value for real human readers.
"""
    else:
        title = f"The Definitive Guide to {topic_clean.title()} for {audience}"
        body = f"""# {title}

Navigating **{topic_clean}** requires a structured, data-backed approach rather than relying on guesswork. In this guide, we break down core principles, critical execution strategies, and common pitfalls to help **{audience}** make informed decisions.

## Foundational Principles of {topic_clean.title()}
Every successful strategy starts with clarity and establishing a measurable baseline.
- **Audit Current Workflows:** Identify points of friction and wasted resources before attempting to scale.
- **Prioritize Simplicity:** Overcomplicated systems often collapse under real-world pressure. Build modular, repeatable habits.
- **Track Measurable KPIs:** Focus on leading indicators that forecast progress rather than vanity metrics.

## Strategic Execution Roadmap
To turn theory into measurable impact, apply a 3-step cycle:
1. **Analyze:** Benchmark your current status against top performers in the industry.
2. **Execute:** Deploy focused, short iterations to test what delivers real return.
3. **Iterate:** Double down on verified winners and eliminate unnecessary overhead.

## Conclusion
Mastering {topic_clean} is an ongoing journey. By committing to continuous improvement and practical execution, you build a durable competitive advantage over time.
"""

    words = count_words(body)
    return {
        "title": title,
        "content": body,
        "wordCount": words,
        "readingTime": estimate_reading_time(words),
        "metaDescription": f"Comprehensive guide to {topic_clean} for {audience}. Learn key strategies, tips, and actionable insights.",
        "keywordsSuggested": keywords[:4] if keywords else [topic_clean.lower(), "guide", "strategy"],
        "engine": "Python Contextual NLP Engine",
        "tone": tone
    }


# =========================================================================
# 2. SOCIAL MEDIA CAPTIONS GENERATOR
# =========================================================================
def generate_python_social(
    topic: str,
    platforms: List[str] = None,
    tone: str = "Professional",
    count: int = 3,
    api_key: str = "",
    provider: str = "local",
    model: str = ""
) -> Dict[str, List[str]]:
    """Generates distinct, topic-accurate social media captions using Real AI if key is present, or intelligent contextual synthesis."""
    topic_clean = topic.strip() or "Modern Technology"
    if not platforms:
        platforms = ["instagram", "twitter", "linkedin", "facebook"]

    # 1. Try Real AI Model First if API key is present
    if api_key and api_key.strip():
        platforms_str = ", ".join(platforms)
        prompt = (
            f"You are a world-class social media copywriter.\n"
            f"Generate {count} completely UNIQUE, high-engagement social media captions for these platforms: {platforms_str}.\n"
            f"Topic: '{topic_clean}'\n"
            f"Tone: {tone}\n\n"
            f"CRITICAL REQUIREMENTS:\n"
            f"1. The content MUST be directly and specifically about '{topic_clean}'. Understand what '{topic_clean}' actually is and write genuinely relevant copy!\n"
            f"2. Each of the {count} captions per platform must have a completely different angle, hook, and layout.\n"
            f"3. Use appropriate platform styling: emojis & hashtags for Instagram; short punchy hooks under 280 chars for Twitter; professional storytelling for LinkedIn.\n"
            f"4. Output STRICT JSON only without markdown code blocks, matching this structure:\n"
            f'{{"instagram": ["...", "..."], "twitter": ["...", "..."], "linkedin": ["...", "..."], "facebook": ["...", "..."]}}'
        )
        ai_text = call_real_ai_model(prompt, provider=provider, api_key=api_key, model=model)
        if ai_text:
            try:
                clean_json_str = re.sub(r"^```(?:json)?\s*|\s*```$", "", ai_text.strip(), flags=re.MULTILINE)
                parsed = json.loads(clean_json_str)
                if isinstance(parsed, dict) and any(isinstance(v, list) for v in parsed.values()):
                    print("[Python AI] Returning Real AI captions!")
                    return parsed
            except Exception as e:
                print(f"[Python AI] JSON parse error from Real AI response: {e}")

    # 2. Context-Accurate Local Engine
    ctx = analyze_topic_context(topic_clean)
    ttype = ctx["type"]
    tag_str = " ".join(ctx["hashtags"][:4])

    results = {}

    if ttype == "laptop":
        ig_pool = [
            (
                f"💻 Upgrading your workstation? Let's talk about the {topic_clean}!\n\n"
                f"When you spend 8+ hours a day typing, coding, or creating, your machine matters. Here is what stands out:\n"
                f"⚡ Battery that easily handles a full workday without battery panic\n"
                f"⚡ Keyboard with crisp tactile travel for long typing sessions\n"
                f"⚡ Crisp high-res display that makes multitasking effortless\n\n"
                f"What is the #1 thing you look for in a laptop: Raw power or all-day battery? Drop your thoughts below! 👇\n\n"
                f"{tag_str}"
            ),
            (
                f"Desk setup check with the {topic_clean} 🖥️✨\n\n"
                f"Clean workspace = clear mind. Whether you're running heavy development builds, rendering 4K footage, or managing client workflows, having a machine that never lags is everything.\n\n"
                f"Rate this workstation setup from 1-10 in the comments! 💬\n"
                f"📌 Save this post for your next tech upgrade.\n\n"
                f"{tag_str}"
            ),
            (
                f"Before you buy the {topic_clean}, here are 3 things you should consider 💡\n\n"
                f"1. Check the port selection (do you need adapters for dual monitors?)\n"
                f"2. Thermal performance during prolonged heavy tasks\n"
                f"3. RAM configuration (always go for 16GB+ if you multitask heavily!)\n\n"
                f"Double tap if you love sleek productivity hardware! ❤️\n\n"
                f"{tag_str}"
            )
        ]
        tw_pool = [
            f"If your laptop sounds like a jet engine when opening 20 Chrome tabs, it's time for an upgrade. ✈️😂\n\nTesting the {topic_clean}—solid thermals, silent fans, and great battery life. 💻",
            f"3 non-negotiables for my work laptop:\n\n1. 10+ hour real-world battery\n2. Bright anti-glare display\n3. Responsive keyboard\n\nThe {topic_clean} checks all three. ⚡",
            f"Unpopular tech opinion: Most people don't need a $3,000 laptop.\n\nMachines like the {topic_clean} deliver 95% of the performance for half the cost. 💻🧵"
        ]
        li_pool = [
            (
                f"The modern workstation has evolved. Why hardware choices impact developer and creator productivity:\n\n"
                f"When teams run slow, thermal-throttled laptops, compilation speeds crawl and multitasking friction adds up. "
                f"Investing in reliable hardware like the {topic_clean} directly impacts daily output, focus, and developer satisfaction.\n\n"
                f"What is your team's standard hardware stack right now?\n\n"
                f"{tag_str}"
            ),
            (
                f"Mobile productivity test: Running an entire business trip off the {topic_clean}.\n\n"
                f"• Zero charger anxiety during 6-hour flights\n"
                f"• Instant wake-from-sleep when hopping into Zoom meetings\n"
                f"• Premium trackpad making external mice unnecessary on the go\n\n"
                f"Reliable tools compound into massive time savings over a year.\n\n"
                f"{tag_str}"
            ),
            (
                f"Key factors IT leaders should look for when choosing fleet laptops like the {topic_clean}:\n\n"
                f"1. Repairability and enterprise warranty support\n"
                f"2. Display ergonomics for reduced eye fatigue\n"
                f"3. Security chipsets and biometric authentication\n\n"
                f"{tag_str}"
            )
        ]
        fb_pool = [
            f"Hey tech lovers! 👋 Anyone looking to upgrade their laptop soon? I've been testing the {topic_clean} and the battery life and keyboard have been amazing for daily work. What laptop are you currently using? Let me know below! 💻💬",
            f"Quick tip for anyone working from home: A good laptop stand and a machine like the {topic_clean} will save your neck and back! Double tap if your desk setup is your favorite spot! ☕✨",
            f"Which matters more to you when buying a new laptop: Long battery life or high graphics power? Share your vote in the comments below! 👇📱"
        ]

    elif ttype == "seo":
        ig_pool = [
            (
                f"📈 Stop struggling to rank on Google! Let's talk about {topic_clean}.\n\n"
                f"You don't need expensive paid ads to get consistent customers when your organic search signals are dialed in:\n"
                f"🎯 Match search intent (answer what people are actually searching for)\n"
                f"🎯 Clean H1/H2 header architecture that search bots can index\n"
                f"🎯 Lightning-fast page load times (Core Web Vitals)\n\n"
                f"Drop a '🚀' below if you want more organic traffic this month!\n\n"
                f"{tag_str}"
            ),
            (
                f"The 3 most common mistakes people make with {topic_clean} ❌👇\n\n"
                f"1. Keyword stuffing (Google penalizes unnatural text!)\n"
                f"2. Ignoring mobile layout (over 65% of searches happen on phones)\n"
                f"3. Forgetting meta descriptions (they dictate your click-through rate!)\n\n"
                f"📌 Save this post for your next website audit!\n\n"
                f"{tag_str}"
            ),
            (
                f"How {topic_clean} turns cold website visitors into paying clients 💡\n\n"
                f"When people search Google, they have high commercial intent. Ranking for the right keywords means you are solving problems right at the moment of need.\n\n"
                f"What is your #1 struggle with search traffic right now? Let's discuss in the comments! 👇\n\n"
                f"{tag_str}"
            )
        ]
        tw_pool = [
            f"SEO in 2026 isn't about gaming the algorithm with 500 low-quality backlinks.\n\nIt's about matching search intent and providing the best answer on the internet. Simple as that. 🎯 #{ctx['tag']}",
            f"Quick 5-minute {topic_clean} checklist:\n\n• Target keyword in Title Tag & H1\n• Fast loading speed (< 2.5s)\n• Descriptive meta description\n• Clear internal links\n\nSave this. 📌",
            f"Paid ads stop the second you pause your budget. {topic_clean} compounds traffic for years. Invest in organic assets. 📈"
        ]
        li_pool = [
            (
                f"Why {topic_clean} remains the highest ROI channel in digital marketing:\n\n"
                f"While cost-per-click on paid ad networks continues to rise, organic search traffic compounds over time. "
                f"An article or landing page optimized for high-intent search queries can generate qualified B2B leads for 3+ years with zero recurring ad spend.\n\n"
                f"How are you balancing paid acquisition vs. organic search this quarter?\n\n"
                f"{tag_str}"
            ),
            (
                f"A framework for scaling {topic_clean} across B2B websites:\n\n"
                f"1. Build topic clusters: Create one comprehensive pillar guide supported by 5-10 sub-topic articles.\n"
                f"2. Optimize for snippet real estate: Answer specific FAQ questions directly with bullet points.\n"
                f"3. Technical audit: Ensure clean indexing, schema markup, and canonical URLs.\n\n"
                f"{tag_str}"
            ),
            (
                f"The intersection of AI content and {topic_clean}:\n\n"
                f"Google doesn't penalize AI content; it penalizes generic, unhelpful content. "
                f"Pairing automated drafts with human domain expertise, real case studies, and proprietary data is the winning formula.\n\n"
                f"{tag_str}"
            )
        ]
        fb_pool = [
            f"Hey website owners! 🚀 Are you getting enough visitors from Google? Focusing on {topic_clean} was the best decision for our organic growth. What keywords are you trying to rank for? Share your website below and let's check! 👇💬",
            f"Quick tip for small business owners: Make sure your Google Business profile and local {topic_clean} are updated! It brings in free customers every single week. ❤️",
            f"Have you ever noticed how you always click the top 3 results on Google? That's why {topic_clean} is so powerful. Let me know if you want a free guide on how to rank! 📈"
        ]

    elif ttype == "smartphone":
        ig_pool = [
            (
                f"📸 Putting the {topic_clean} through its paces!\n\n"
                f"From low-light night photography to crisp dynamic range, mobile imaging has reached an insane level. "
                f"Swipe left to check out unedited camera samples! 👉\n\n"
                f"What phone are you rocking right now? Let me know below! 👇🔥\n\n"
                f"{tag_str}"
            ),
            (
                f"Is the {topic_clean} the top daily driver of the year? ⚡📱\n\n"
                f"1️⃣ Ultra-smooth 120Hz display\n"
                f"2️⃣ All-day battery life with fast charging\n"
                f"3️⃣ Flagship performance with zero stutter\n\n"
                f"Double tap if you love premium tech that just works! ❤️\n\n"
                f"{tag_str}"
            ),
            (
                f"Before upgrading to the {topic_clean}, here is what you need to know 💡\n\n"
                f"Specs are great, but real-world reliability and software support are what really count after 2+ years of use.\n\n"
                f"📌 Save this post for your next phone upgrade!\n\n"
                f"{tag_str}"
            )
        ]
        tw_pool = [
            f"The camera on the {topic_clean} is unbelievable. Natural bokeh, sharp zoom, and zero shutter lag. Full sample thread below! 🧵👇",
            f"3 things that matter in a smartphone in 2026:\n\n1. All-day battery endurance\n2. Clean, responsive software\n3. Reliable camera in low light\n\nThe {topic_clean} nails it. ⚡",
            f"Are smartphone cameras officially good enough to replace dedicated mirrorless cameras for 90% of creators? Testing with the {topic_clean} says yes. 📸"
        ]
        li_pool = [
            (
                f"What {topic_clean} shows us about mobile computing evolution:\n\n"
                f"Smartphones are no longer just communication devices—they are primary computing hubs for mobile professionals. "
                f"With high-speed 5G, desktop modes, and secure enterprise enclaves, flagship hardware continues to drive remote workforce efficiency.\n\n"
                f"{tag_str}"
            ),
            (
                f"Hardware adoption trends: Why consumers are holding onto flagship devices like the {topic_clean} for 3-4 years.\n\n"
                f"Longevity, consistent software updates, and durable build quality are now the top deciding factors for enterprise procurement.\n\n"
                f"{tag_str}"
            ),
            (
                f"Evaluating mobile device security and productivity for enterprise teams:\n\n"
                f"How modern hardware architectures like the {topic_clean} protect corporate data while enabling seamless cloud workflows.\n\n"
                f"{tag_str}"
            )
        ]
        fb_pool = [
            f"Hey everyone! 📱 Thinking about upgrading your phone? I've been testing the {topic_clean} and the photo quality and battery life are seriously impressive. What phone do you have right now? Let's compare notes! 👇💬",
            f"Quick photography tip: If you have the {topic_clean}, turn on gridlines and lock your focus before snapping sunset shots—the colors look incredible! 🌅❤️",
            f"Which smartphone feature can you not live without: Crazy camera zoom or 2-day battery life? Drop your vote in the comments! ⚡"
        ]

    else:
        # Dynamic General - using topic keywords accurately
        ig_pool = [
            (
                f"✨ Let's dive into {topic_clean.title()} ✨\n\n"
                f"When tackling {topic_clean}, the key is focusing on what actually moves the needle:\n"
                f"1️⃣ Clarify your primary objective before adding complexity\n"
                f"2️⃣ Test practical steps and measure real outcomes\n"
                f"3️⃣ Build repeatable habits that compound over time\n\n"
                f"Drop a '🔥' if this gives you clarity today!\n\n"
                f"{tag_str}"
            ),
            (
                f"Stop overcomplicating {topic_clean.title()}! 💡\n\n"
                f"Most people get stuck in research mode without taking action. "
                f"Start small, iterate continuously, and focus on practical results.\n\n"
                f"What is your biggest question about {topic_clean}? Ask below in the comments! 👇\n\n"
                f"{tag_str}"
            ),
            (
                f"A practical 3-step checklist for {topic_clean.title()} 📌\n\n"
                f"• Audit where you stand right now\n"
                f"• Remove the unnecessary bottlenecks\n"
                f"• Double down on proven methods\n\n"
                f"Save this post for reference later! 🏷️\n\n"
                f"{tag_str}"
            )
        ]
        tw_pool = [
            f"The secret to mastering {topic_clean}? Stop looking for complex shortcuts and master the core fundamentals first. 🧵👇 #{ctx['tag']}",
            f"3 simple rules for {topic_clean}:\n\n1. Measure what matters\n2. Remove unnecessary friction\n3. Stay consistent\n\nSave this for later. 📌",
            f"Action creates clarity. If you're overthinking {topic_clean}, take the first small step today. ⚡"
        ]
        li_pool = [
            (
                f"Strategic insights on {topic_clean.title()} for modern leaders:\n\n"
                f"Navigating {topic_clean} effectively requires balancing long-term vision with disciplined execution. "
                f"Organizations that institutionalize these principles gain a measurable advantage.\n\n"
                f"How is your team approaching {topic_clean} this year?\n\n"
                f"{tag_str}"
            ),
            (
                f"Lessons learned from scaling {topic_clean.title()}:\n\n"
                f"• Simplicity beats complexity every single time.\n"
                f"• Continuous feedback loops beat rigid assumptions.\n"
                f"• Empowered execution beats stalled planning.\n\n"
                f"{tag_str}"
            ),
            (
                f"A structured framework for evaluating {topic_clean.title()} in 2026.\n\n"
                f"Focus on clear benchmarking, transparency, and sustainable compounding.\n\n"
                f"{tag_str}"
            )
        ]
        fb_pool = [
            f"Hey everyone! 👋 Wanted to share a quick thought on {topic_clean} that really helped simplify things for me this week. What has been your biggest takeaway in this area? Let's chat in the comments! 👇💬",
            f"Quick reminder for anyone working towards a big goal with {topic_clean}: Consistency and patience always win in the end. Keep going! 💪❤️",
            f"What is the single best tip you've learned about {topic_clean}? Share yours below so everyone can learn! 💡"
        ]

    pools = {
        "instagram": ig_pool,
        "twitter": tw_pool,
        "x": tw_pool,
        "linkedin": li_pool,
        "facebook": fb_pool
    }

    for plat in platforms:
        plat_lower = plat.lower()
        pool = pools.get(plat_lower, ig_pool)
        plat_captions = []
        for i in range(count):
            plat_captions.append(pool[i % len(pool)])
        results[plat_lower] = plat_captions

    return results
