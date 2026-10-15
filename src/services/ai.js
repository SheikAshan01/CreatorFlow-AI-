// Hybrid content engine. It tries OpenAI first when an API key is configured,
// then falls back to the curated local dataset when the key is missing, quota is
// exhausted, or the network request fails.

// Helper: Normalize inputs
const normalizeTopic = (topic) => topic.trim().toLowerCase();
const wordCount = (text = '') => text.split(/\s+/).filter(Boolean).length;
const readingTime = (text = '') => Math.max(1, Math.ceil(wordCount(text) / 200));
const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Dedicated Backend Connectors (Supports Local, Render, Vercel Env, or User Custom URL)
export const getBackendUrls = () => {
  const custom = (localStorage.getItem('creator_backend_url') || import.meta.env?.VITE_BACKEND_URL || '').trim().replace(/\/+$/, '');
  const list = [];
  if (custom) {
    if (custom.endsWith('/api')) {
      list.push(custom);
    } else {
      list.push(`${custom}/api`);
      list.push(custom);
    }
  }
  list.push('https://creatorflow-backend-api.onrender.com/api');
  list.push('/py-api');
  list.push('http://127.0.0.1:8000/api');
  list.push('http://localhost:8000/api');
  return list;
};

export const checkPythonBackend = async () => {
  const candidateUrls = getBackendUrls();
  for (const base of candidateUrls) {
    try {
      const res = await fetch(`${base}/health`, { method: 'GET', signal: AbortSignal.timeout(2500) });
      if (res.ok) {
        const data = await res.json();
        return { online: true, ...data, url: base };
      }
    } catch {
      // Continue to fallback check
    }
  }
  return { online: false };
};

export const callPythonApi = async (endpoint, body) => {
  const candidateUrls = getBackendUrls();
  for (const base of candidateUrls) {
    try {
      const res = await fetch(`${base}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(10000)
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Try next candidate
    }
  }
  return null;
};

const getAiSettings = () => {
  const apiKey = (localStorage.getItem('creator_ai_key') || localStorage.getItem('creator_openai_key') || '').trim();
  const provider = localStorage.getItem('creator_ai_provider') || (apiKey.startsWith('AIza') ? 'gemini' : apiKey.startsWith('gsk_') ? 'groq' : 'gemini');
  const defaultModel = provider === 'gemini' ? 'gemini-1.5-flash' : provider === 'groq' ? 'llama-3.1-8b-instant' : 'gpt-4o-mini';
  const model = localStorage.getItem('creator_ai_model') || defaultModel;
  const enabled = apiKey.length > 5;
  return {
    enabled,
    provider,
    apiKey,
    model,
  };
};

const shouldFallback = (status) => [400, 401, 403, 404, 408, 409, 429, 500, 502, 503, 504].includes(status);

// Direct browser API caller for Vercel production deployment without backend dependency
const callDirectBrowserAi = async (settings, prompt) => {
  if (!settings.apiKey) return null;
  const apiKey = settings.apiKey.trim();

  if (settings.provider === 'gemini') {
    const candidateModels = [
      settings.model || 'gemini-1.5-flash',
      'gemini-1.5-flash',
      'gemini-2.0-flash',
      'gemini-1.5-pro'
    ];
    const models = [...new Set(candidateModels.filter(m => m !== 'gemini-2.5-flash'))];

    for (const m of models) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${encodeURIComponent(apiKey)}`;
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: prompt }] }]
          }),
          signal: AbortSignal.timeout(15000)
        });
        if (res.ok) {
          const data = await res.json();
          const text = data.candidates?.[0]?.content?.parts?.map((p) => p.text || '').join('\n').trim();
          if (text) return text;
        }
      } catch (err) {
        console.warn(`Browser Gemini ${m} call failed:`, err);
      }
    }
  } else if (settings.provider === 'groq') {
    try {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: settings.model || 'llama-3.1-8b-instant',
          messages: [{ role: 'user', content: prompt }]
        }),
        signal: AbortSignal.timeout(15000)
      });
      if (res.ok) {
        const data = await res.json();
        return data.choices?.[0]?.message?.content?.trim();
      }
    } catch (err) {
      console.warn('Browser Groq call failed:', err);
    }
  }
  return null;
};

const callOpenAI = async (prompt) => {
  const settings = getAiSettings();
  if (!settings.enabled || !settings.apiKey.trim()) {
    throw new Error('AI provider is not configured.');
  }

  // 1. Try direct browser call (works seamlessly on Vercel without any proxy)
  try {
    const directText = await callDirectBrowserAi(settings, prompt);
    if (directText) return directText;
  } catch (err) {
    console.warn('Direct browser AI error, trying fallback:', err);
  }

  // 2. Try Vite development server middleware (/api/ai)
  const response = await fetch('/api/ai', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      provider: settings.provider,
      apiKey: settings.apiKey.trim(),
      model: settings.model,
      input: prompt,
    }),
  });

  if (!response.ok) {
    if (shouldFallback(response.status)) {
      throw new Error(`AI request failed with ${response.status}; using local fallback.`);
    }
    throw new Error(`AI request failed with ${response.status}.`);
  }

  const data = await response.json();
  const text = data.output_text || data.output?.flatMap((item) => item.content || [])
    .map((content) => content.text || '')
    .join('\n')
    .trim();

  if (!text) throw new Error('AI returned empty content; using local fallback.');
  return text;
};

const tryAiText = async (prompt) => {
  try {
    return { text: await callOpenAI(prompt), source: 'ai' };
  } catch (error) {
    console.warn(error.message);
    return { text: null, source: 'local' };
  }
};

// =========================================================================
// INTELLIGENT MULTI-DOMAIN TOPIC CLASSIFIER & KNOWLEDGE ENGINE
// =========================================================================
export const detectDomain = (topic) => {
  const t = (topic || '').toLowerCase().trim();
  const words = t.split(/[^a-zA-Z0-9]+/).filter(w => w.length > 2);
  const tag = words.slice(0, 2).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('') || 'Topic';

  // 1. Food & Culinary
  if (/\b(biryani|recipe|cooking|cook|dish|food|cake|bake|baking|kitchen|restaurant|chef|coffee|tea|breakfast|dinner|lunch|curry|masala|spices?|snack|dessert|paneer|chicken|mutton|pasta|pizza|bread)\b/.test(t)) {
    return {
      domain: 'food',
      tag,
      emojis: ['🍳', '🥘', '🍽️', '😋', '👨‍🍳'],
      hashtags: [`#${tag}`, '#Foodie', '#RecipeOfTheDay', '#CookingTips', '#DeliciousEats', '#HomeCooking']
    };
  }

  // 2. Sports, Games & Athletics
  if (/\b(cricket|ipl|football|soccer|tennis|basketball|badminton|match|tournament|player|batting|bowling|goal|stadium|championship|athlete|marathon|fifa|olympics)\b/.test(t)) {
    return {
      domain: 'sports',
      tag,
      emojis: ['🏏', '⚽', '🏆', '🔥', '🥇'],
      hashtags: [`#${tag}`, '#MatchDay', '#SportsNews', '#GameHighlights', '#AthleteLife', '#Champions']
    };
  }

  // 3. Healthcare, Medicine & Dental
  if (/\b(dental|teeth|tooth|clinic|doctor|hospital|patient|medicine|medical|surgery|hygiene|dentist|appointment|treatment|prescription|allergy|disease|health care|nursing)\b/.test(t)) {
    return {
      domain: 'medical',
      tag,
      emojis: ['🩺', '🦷', '🏥', '💊', '✨'],
      hashtags: [`#${tag}`, '#Healthcare', '#DoctorAdvice', '#PatientCare', '#HealthyHabits', '#MedicalTips']
    };
  }

  // 4. Fitness, Gym & Wellness
  if (/\b(fitness|gym|workout|weight loss|fat loss|muscle|exercise|yoga|calisthenics|diet plan|protein|sleep hygiene|meditation|mental health|stretching|cardio|running)\b/.test(t)) {
    return {
      domain: 'fitness',
      tag,
      emojis: ['💪', '🏃‍♂️', '🥗', '🧘‍♀️', '🔥'],
      hashtags: [`#${tag}`, '#FitnessGoals', '#GymMotivation', '#HealthyLiving', '#WorkoutRoutine', '#WellnessJourney']
    };
  }

  // 5. Travel & Tourism
  if (/\b(travel|tour|trip|vacation|hotel|resort|flight|beach|mountain|destination|city|itinerary|backpacking|sightseeing|places to visit|tourism|passport|adventure)\b/.test(t)) {
    return {
      domain: 'travel',
      tag,
      emojis: ['✈️', '🏖️', '🗺️', '🧳', '📸'],
      hashtags: [`#${tag}`, '#TravelDiaries', '#Wanderlust', '#ExploreTheWorld', '#VacationVibes', '#TravelTips']
    };
  }

  // 6. Automotive & Vehicles
  if (/\b(car|cars|bike|bikes|motorcycle|ev|electric vehicle|tesla|driving|engine|mileage|automotive|scooter|suv|sedan|speed|petrol|diesel|ride|tata|hyundai|bmw)\b/.test(t)) {
    return {
      domain: 'automotive',
      tag,
      emojis: ['🚗', '⚡', '🏍️', '💨', '🔧'],
      hashtags: [`#${tag}`, '#CarLovers', '#Automotive', '#EVRevolution', '#BikeLife', '#DriveSafe']
    };
  }

  // 7. Education, Study & Career
  if (/\b(study|exam|exams|college|school|university|student|career|interview|resume|syllabus|degree|learning|maths|science|physics|test preparation|upsc|jee|neet)\b/.test(t)) {
    return {
      domain: 'education',
      tag,
      emojis: ['📚', '✏️', '🎓', '💡', '🎯'],
      hashtags: [`#${tag}`, '#StudyTips', '#StudentLife', '#CareerAdvice', '#ExamPreparation', '#LearnDaily']
    };
  }

  // 8. Real Estate, Homes & Property
  if (/\b(real estate|property|house|home|apartment|flat|villa|land|rent|buying house|interior design|builder|construction|mortgage|architecture)\b/.test(t)) {
    return {
      domain: 'real_estate',
      tag,
      emojis: ['🏡', '🏢', '🔑', '✨', '📐'],
      hashtags: [`#${tag}`, '#RealEstate', '#DreamHome', '#PropertyInvestment', '#InteriorDesign', '#HouseHunting']
    };
  }

  // 9. Fashion, Beauty & Skincare
  if (/\b(fashion|beauty|makeup|skincare|dress|outfit|clothing|style|grooming|hair care|cosmetics|wedding dress|jewelry|trend|glam)\b/.test(t)) {
    return {
      domain: 'fashion',
      tag,
      emojis: ['👗', '💄', '✨', '🌸', '👠'],
      hashtags: [`#${tag}`, '#FashionTrends', '#BeautyTips', '#SkincareRoutine', '#OOTD', '#StyleInspo']
    };
  }

  // 10. Entertainment, Movies & Gaming
  if (/\b(movie|film|cinema|actor|actress|box office|song|music|gaming|video game|ps5|xbox|gta|streamer|series|netflix|anime|trailer)\b/.test(t)) {
    return {
      domain: 'entertainment',
      tag,
      emojis: ['🎬', '🎮', '🍿', '🎧', '⭐'],
      hashtags: [`#${tag}`, '#MovieReview', '#GamingCommunity', '#CinemaLovers', '#Entertainment', '#GameOn']
    };
  }

  // 11. Coding, Software & Web Development
  if (/\b(code|coding|python|javascript|react|developer|api|backend|frontend|programming|web dev|github|database|bug|sql|docker|node|typescript)\b/.test(t)) {
    return {
      domain: 'coding',
      tag,
      emojis: ['💻', '🚀', '⚡', '👨‍💻', '🛠️'],
      hashtags: [`#${tag}`, '#WebDevelopment', '#CodingLife', '#SoftwareEngineer', '#DevCommunity', '#CodeNewbie']
    };
  }

  // 12. Artificial Intelligence & Data Science
  if (/\b(ai|artificial intelligence|machine learning|deep learning|data science|chatgpt|automation|llm|neural|robotics|generative ai)\b/.test(t)) {
    return {
      domain: 'ai',
      tag,
      emojis: ['🤖', '🧠', '⚡', '🔮', '💡'],
      hashtags: [`#${tag}`, '#ArtificialIntelligence', '#MachineLearning', '#TechTrends', '#FutureOfWork', '#AIDevelopment']
    };
  }

  // 13. Gadgets & Hardware (Smartphones, Laptops, PCs)
  if (/\b(laptop|macbook|pc|desktop|computer|phone|smartphone|iphone|samsung|galaxy|pixel|tablet|gadget|camera|hardware|processor|specs)\b/.test(t)) {
    return {
      domain: 'gadgets',
      tag,
      emojis: ['📱', '💻', '⚡', '🔍', '🔋'],
      hashtags: [`#${tag}`, '#TechReview', '#GadgetGeek', '#SmartphoneNews', '#WorkstationSetup', '#TechUpgrade']
    };
  }

  // 14. Finance, Money & Investing
  if (/\b(money|finance|invest|investing|stock|stocks|crypto|bitcoin|budget|wealth|savings|mutual fund|trading|passive income|portfolio)\b/.test(t)) {
    return {
      domain: 'finance',
      tag,
      emojis: ['💰', '📈', '💵', '📊', '🏦'],
      hashtags: [`#${tag}`, '#PersonalFinance', '#InvestingTips', '#FinancialFreedom', '#WealthCreation', '#MoneyMatters']
    };
  }

  // 15. Marketing & SEO
  if (/\b(marketing|seo|search engine|ranking|brand|branding|sales|lead gen|traffic|funnel|copywriting|b2b|advertising|social media growth)\b/.test(t)) {
    return {
      domain: 'marketing',
      tag,
      emojis: ['📈', '🎯', '🚀', '📢', '💡'],
      hashtags: [`#${tag}`, '#DigitalMarketing', '#SEOTips', '#BrandGrowth', '#ContentStrategy', '#OrganicTraffic']
    };
  }

  // 16. Pets & Animals
  if (/\b(dog|dogs|cat|cats|pet|pets|puppy|veterinary|animal|kitten|training dog|pet care)\b/.test(t)) {
    return {
      domain: 'pets',
      tag,
      emojis: ['🐾', '🐶', '🐱', '❤️', '🦴'],
      hashtags: [`#${tag}`, '#PetLovers', '#DogLife', '#CatLovers', '#PetCareTips', '#CutePets']
    };
  }

  // Default: Knowledge & Insights
  return {
    domain: 'general',
    tag,
    emojis: ['✨', '💡', '📌', '🔍', '🎯'],
    hashtags: [`#${tag}`, '#Insights', '#ProTips', '#BestPractices', '#Guide', '#KnowledgeSharing']
  };
};

const cleanHashtagToken = (topic) => topic
  .replace(/[^a-z0-9 ]/gi, '')
  .trim()
  .split(/\s+/)
  .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
  .join('');

const getTopicHashtags = (topic) => {
  const ctx = detectDomain(topic);
  return ctx.hashtags;
};

const applyToneModifications = (text, tone = 'Informative') => {
  const modifications = {
    professional: {
      replace: { 'get': 'acquire', 'make': 'construct', 'use': 'utilize', 'bad': 'suboptimal', 'good': 'advantageous', 'start': 'commence' }
    },
    casual: {
      replace: { 'utilize': 'use', 'suboptimal': 'rough', 'therefore': 'so', 'however': 'but', 'furthermore': 'plus', 'acquire': 'get' }
    },
    witty: {
      replace: { 'important': 'vital (unlike the extra plastic wrap on cereal boxes)', 'process': 'routine dance' }
    },
    persuasive: {
      replace: { 'helpful': 'transformative', 'useful': 'indispensable', 'change': 'revolutionize', 'important': 'absolutely vital' }
    },
    informative: {
      replace: {}
    }
  };

  const mod = modifications[tone.toLowerCase()] || modifications.informative;
  let result = text;
  Object.entries(mod.replace).forEach(([key, val]) => {
    const regex = new RegExp(`\\b${key}\\b`, 'gi');
    result = result.replace(regex, val);
  });
  return result;
};

const buildDomainSpecificBlog = (topic, domain, audience, keywords) => {
  const tCap = topic.charAt(0).toUpperCase() + topic.slice(1);
  const kwStr = keywords.length > 0 ? keywords.join(', ') : topic;

  if (domain === 'food') {
    const title = `The Ultimate Guide to ${tCap}: Ingredients, Recipe & Cooking Tips`;
    const body = `# ${title}

There is nothing quite as satisfying as a masterfully prepared serving of **${topic}**. Whether you are cooking for family, entertaining guests, or perfecting your culinary skills as ${audience || 'food lovers'}, getting the taste, texture, and aroma right requires attention to authentic ingredients and timing.

## 1. Essential Ingredients & Flavor Pairing for ${tCap}
Every delicious batch of ${topic} begins with fresh, high-quality ingredients.
- **Base Components & Fresh Produce:** Quality ingredients form the backbone of your dish. Choose fresh produce and premium pantry essentials.
- **Aromatic Spices & Seasoning:** Balanced seasoning transforms standard cooking into restaurant-grade flavor. Incorporate **${kwStr}** to elevate the aroma.
- **Texture Balance:** Pay close attention to moisture levels so the final dish is neither too dry nor overly saturated.

## 2. Step-by-Step Preparation & Temperature Control
Mastering ${topic} requires precise cooking stages:
1. **Prep Work & Marination:** Allow flavors sufficient time to infuse before applying heat.
2. **Heat Management:** Start with controlled medium heat to develop rich caramelization, then adjust to simmer to lock in tenderness and juices.
3. **Layering Flavors:** Add delicate herbs and final seasonings in the last minutes of cooking to preserve their fresh notes.

## 3. Pro Tips to Avoid Common Culinary Mistakes
- **Do not rush the resting period:** Allowing ${topic} to rest for 5 to 10 minutes before serving lets juices redistribute evenly.
- **Taste as you cook:** Adjust salt and acidity right before plating for the best balance.
- **Presentation:** Garnish with fresh herbs or a touch of roasted spices to make the dish visually irresistible.

## Conclusion
Cooking authentic **${topic}** is a rewarding craft. With the right foundation and patience, you can consistently prepare a dish that delights everyone at the table.
`;
    return { title, body };
  }

  if (domain === 'sports') {
    const title = `${tCap} Complete Guide: Tactics, Player Performance & Winning Strategies`;
    const body = `# ${title}

In the competitive arena of modern sports, understanding the dynamics of **${topic}** requires breaking down tactical execution, physical conditioning, and game-day psychology. Whether you are an avid follower, aspiring player, or team analyst, mastering these core principles is essential for **${audience || 'athletes and fans'}**.

## 1. Key Fundamentals & Tactical Blueprint of ${tCap}
Success on the field or court starts with strong structural discipline:
- **Positional Awareness:** Players must anticipate plays and maintain solid team coordination under pressure.
- **Skill Execution:** Consistent execution of core techniques, including **${kwStr}**, separates good performers from elite champions.
- **Physical Conditioning:** Stamina, agility, and recovery protocols directly dictate performance in the closing minutes of a match.

## 2. Strategic Adaptations Under High-Pressure Moments
No game plan survives contact without in-game adjustments:
1. **Reading the Opponent:** Identify defensive weaknesses and exploit momentum shifts early.
2. **Set Pieces & Tactical Drills:** High-efficiency conversion on scoring opportunities often decides close contests.
3. **Mental Toughness:** Staying calm during referee calls, crowd noise, and high-stakes phases is the trademark of winning teams.

## 3. Analysis, Technology & Future Evolution in ${tCap}
From video review analysis to biomechanical tracking, modern preparation has evolved. Teams that analyze opponent data while safeguarding player fitness gain a decisive competitive advantage.

## Conclusion
Whether on the practice field or on the championship stage, **${topic}** rewards preparation, teamwork, and resilience. Focus on mastering the basics, adapt quickly, and play with purpose.
`;
    return { title, body };
  }

  if (domain === 'medical') {
    const title = `Everything You Need to Know About ${tCap}: Care, Prevention & Advice`;
    const body = `# ${title}

Navigating **${topic}** effectively is vital for safeguarding your long-term health and wellbeing. When addressing medical and clinical concerns, having transparent, reliable information enables **${audience || 'patients and families'}** to take timely preventive action and make educated healthcare decisions.

## 1. Understanding the Core Causes & Early Indicators of ${tCap}
Recognizing early warning signs prevents minor discomfort from escalating into severe complications:
- **Common Symptoms to Watch:** Be vigilant for chronic discomfort, visible changes, or unusual fatigue related to ${topic}.
- **Underlying Risk Factors:** Lifestyle choices, genetic predisposition, and environmental triggers can contribute to the condition.
- **Preventive Protocols:** Integrating **${kwStr}** into your daily routine supports overall resilience and health maintenance.

## 2. Professional Diagnosis & Treatment Options
Accurate clinical evaluation is the cornerstone of effective care:
1. **Clinical Consultation:** Always consult a qualified specialist rather than relying on unverified online advice.
2. **Diagnostic Assessment:** Comprehensive examinations or imaging provide an objective baseline for tailored care plans.
3. **Structured Care Plan:** Adhere strictly to prescribed medications, follow-up schedules, and therapeutic guidelines.

## 3. Practical Daily Hygiene & Preventive Habits
- **Maintain Regular Checkups:** Routine evaluations detect emerging concerns before they require invasive interventions.
- **Holistic Care:** Support clinical treatments with balanced nutrition, hydration, and adequate restorative sleep.
- **Avoid Self-Medication:** Only use clinically tested remedies and follow your doctor's exact instructions.

## Conclusion
Taking proactive charge of **${topic}** ensures better peace of mind and long-term health. Prioritize professional consultations and consistent daily care for optimal wellness.
`;
    return { title, body };
  }

  if (domain === 'fitness') {
    const title = `Mastering ${tCap}: Proven Workouts, Nutrition & Lifestyle Roadmap`;
    const body = `# ${title}

Transforming your body and elevating your physical fitness through **${topic}** requires a science-backed methodology rather than extreme shortcuts. For **${audience || 'fitness enthusiasts'}**, sustainable health and peak stamina come from balancing progressive training, sound nutrition, and active recovery.

## 1. Foundations of ${tCap}: Setting Up for Long-Term Progress
Every fitness journey succeeds when built on repeatable fundamentals:
- **Progressive Overload:** Gradually challenge your strength and endurance over time to stimulate muscle adaptation.
- **Form & Biomechanics:** Prioritize clean movement patterns over heavy ego-lifting to prevent injury.
- **Targeted Integration:** Weaving **${kwStr}** into your routine keeps workouts engaging and goal-oriented.

## 2. Fueling Your Body: Nutrition & Meal Strategy
Workouts break muscle down; nutrition builds it back stronger:
1. **Macronutrient Balance:** Ensure adequate dietary protein, complex carbohydrates for energy, and healthy fats.
2. **Hydration & Electrolytes:** Maintaining optimal hydration sustains workout intensity and prevents cramping.
3. **Pre & Post-Workout Fuel:** Eat a balanced nutrient-dense meal within 2 hours of training to accelerate glycogen replenishment.

## 3. Recovery: The Underrated Key to Fitness Results
- **Sleep Quality:** Aim for 7 to 8 hours of deep restorative sleep to optimize growth hormone release and nervous system recovery.
- **Active Rest Days:** Gentle walks, mobility drills, and stretching reduce soreness and preserve joint mobility.

## Conclusion
Real progress in **${topic}** is a marathon, not a sprint. Celebrate small daily wins, track your workouts, and trust the compounding power of consistency.
`;
    return { title, body };
  }

  if (domain === 'travel') {
    const title = `The Complete Travel Guide to ${tCap}: Itinerary, Budget & Hidden Gems`;
    const body = `# ${title}

Planning a trip centered around **${topic}** is one of the most exciting adventures a traveler can undertake. Whether you are traveling solo, with family, or as part of an adventure group of **${audience || 'explorers'}**, having a smart travel roadmap ensures a memorable, hassle-free journey.

## 1. Best Time to Visit & Planning Your Travel Budget
Timing and logistics can make or break your trip experience:
- **Optimal Travel Season:** Plan around seasonal weather and festival windows to balance pleasant temperatures with reasonable crowds.
- **Budgeting & Accommodations:** Research flight options early and book centrally located stays to minimize daily commuting costs.
- **Essential Focus:** Include **${kwStr}** in your destination research to unlock authentic cultural highlights.

## 2. Top Attractions, Sightseeing & Local Experiences
Make the most of every day with a balanced itinerary:
1. **Must-See Landmarks:** Visit iconic heritage spots and natural viewpoints during early morning hours to beat tour bus traffic.
2. **Authentic Local Cuisine:** Skip tourist traps and explore street markets, traditional eateries, and regional specialties.
3. **Off-the-Beaten-Path Secrets:** Ask local guides or residents for lesser-known scenic routes and serene escapes.

## 3. Practical Travel Tips, Safety & Packing Essentials
- **Pack Light & Smart:** Comfortable walking shoes, versatile layers, and essential charging gear are mandatory.
- **Local Customs & Etiquette:** Respect regional traditions and dress codes to foster welcoming interactions with locals.
- **Digital Backup:** Keep digital copies of your passport, booking reservations, and offline maps on your smartphone.

## Conclusion
Exploring **${topic}** will give you stories that last a lifetime. Keep an open mind, savor the local flavors, and travel with curiosity.
`;
    return { title, body };
  }

  if (domain === 'automotive') {
    const title = `${tCap} In-Depth Review: Performance, Mileage & Buyer's Guide`;
    const body = `# ${title}

Choosing the right vehicle or evaluating **${topic}** requires looking beyond glossy brochures and understanding real-world driving dynamics, fuel/energy efficiency, safety ratings, and ongoing maintenance costs for **${audience || 'drivers'}**.

## 1. Engine Performance, Driving Dynamics & Handling
How a vehicle behaves on city roads and highways is the true measure of engineering quality:
- **Power Delivery & Acceleration:** Responsive throttle response and smooth gear transitions deliver effortless overtaking confidence.
- **Suspension & Ride Comfort:** A well-tuned suspension filters out road undulations while preventing excessive body roll around corners.
- **Key Specifications:** Incorporating **${kwStr}** into your evaluation ensures the vehicle aligns with your performance expectations.

## 2. Fuel Economy, Range & Real-World Efficiency
Running costs dictate long-term vehicle satisfaction:
1. **City vs. Highway Efficiency:** Check verified owner mileage figures rather than relying solely on test-track claims.
2. **Maintenance & Spare Parts:** Opt for manufacturers with extensive service networks, affordable service intervals, and accessible replacement parts.
3. **Safety Architecture:** Verify crash safety ratings, ABS with EBD, traction control, and advanced airbag coverage.

## 3. Buyer's Checklist & Final Verdict
- **Schedule an Extended Test Drive:** Test the vehicle across broken roads, traffic bottlenecks, and highway stretches before booking.
- **Cabin Ergonomics:** Ensure generous legroom, responsive infotainment with Apple CarPlay / Android Auto, and practical boot storage.

## Conclusion
If you value reliability, refined driving manners, and solid build quality, **${topic}** stands out as a compelling contender in its category.
`;
    return { title, body };
  }

  if (domain === 'education') {
    const title = `The Comprehensive Guide to ${tCap}: Roadmap, Study Tips & Success`;
    const body = `# ${title}

Excelling in **${topic}** is not about studying around the clock; it is about studying with strategic focus, efficient recall techniques, and a structured syllabus roadmap. For **${audience || 'students and learners'}**, mastering this domain opens doors to academic excellence and rewarding career opportunities.

## 1. Core Concepts & Syllabus Breakdown for ${tCap}
Establish a rock-solid foundation before diving into advanced topics:
- **Master the Fundamentals:** Build deep conceptual clarity rather than relying on rote memorization.
- **Structured Study Schedule:** Divide the curriculum into weekly modules and assign dedicated review blocks.
- **Targeted Integration:** Focus on core benchmarks including **${kwStr}** to streamline revision.

## 2. Proven Learning Techniques for Maximum Retention
Work smarter with evidence-based cognitive strategies:
1. **Active Recall & Spaced Repetition:** Test yourself regularly with flashcards and mock exams rather than passively re-reading notes.
2. **The Feynman Technique:** Explain difficult topics in simple, plain language to immediately expose knowledge gaps.
3. **Timed Practice Mock Tests:** Simulate real exam conditions to build speed, composure, and time-management discipline.

## 3. Overcoming Exam Stress & Staying Motivated
- **Avoid Procrastination:** Use the Pomodoro technique (25 minutes of deep focus followed by a 5-minute break) to maintain energy.
- **Healthy Lifestyle:** Prioritize consistent sleep and healthy meals; an exhausted brain cannot synthesize complex problem-solving.

## Conclusion
Success in **${topic}** is the product of disciplined daily habits. Trust your preparation, remain patient with difficult concepts, and keep striving forward.
`;
    return { title, body };
  }

  // Default: Custom Semantic Grounding
  const title = `The Definitive Guide to ${tCap}: Principles, Strategies & Key Insights`;
  const body = `# ${title}

Exploring and mastering **${topic}** requires a clear, structured framework that breaks down complex aspects into practical, actionable insights. Whether you are conducting research, planning an implementation, or building expertise as **${audience || 'readers'}**, having an organized overview enables you to achieve tangible results.

## 1. Understanding the Core Foundations of ${tCap}
Every successful exploration begins with clarity around fundamental principles:
- **Defining the Scope:** Understand what drives **{topic}** and why it matters in today's context.
- **Key Drivers of Success:** Identify the core variables, including **${kwStr}**, that directly influence outcomes.
- **Setting Benchmarks:** Establish clear metrics to measure progress and avoid common misconceptions early on.

## 2. Step-by-Step Strategic Framework & Execution
Moving from conceptual theory to real-world impact:
1. **Preparation & Planning:** Gather reliable data, align key resources, and identify potential bottlenecks before taking action.
2. **Practical Execution:** Deploy structured, disciplined steps and test your methods against real-world feedback.
3. **Refinement & Scaling:** Review results regularly, double down on what works, and eliminate unnecessary friction.

## 3. Common Roadblocks & How to Overcome Them
- **Avoid Overcomplication:** The most sustainable approaches are built on simple, repeatable habits rather than overly complex systems.
- **Embrace Continuous Learning:** Stay adaptable as modern methodologies and industry standards continue to evolve.

## Conclusion
Success with **${topic}** is an ongoing journey of deliberate practice and refinement. Apply these principles consistently, stay curious, and keep compounding your knowledge.
`;
  return { title, body };
};

const buildDomainSocialCaptions = (topic, platform, tone, variant) => {
  const ctx = detectDomain(topic);
  const { domain, emojis, hashtags } = ctx;
  const tCap = topic.charAt(0).toUpperCase() + topic.slice(1);
  const tagText = hashtags.slice(0, 4).join(' ');

  if (domain === 'food') {
    if (platform === 'twitter') {
      const tweets = [
        `Nothing cures a long day faster than a steaming plate of ${topic}. ${emojis[0]} What's your comfort food? ${tagText}`,
        `Cooking tip for ${topic}: Low flame and patience make all the difference for spices! 🥘✨`,
        `Homemade ${topic} easily beats most takeout restaurants if you nail the seasoning balance. 🍽️`
      ];
      return tweets[variant % tweets.length];
    }
    if (platform === 'instagram') {
      return `${emojis[0]} Craving authentic ${tCap}? ${emojis[1]}\n\nNothing beats freshly prepared ${topic} made with real spices and slow cooking!\n\n👨‍🍳 Secret tip: Let it rest for 5 minutes before serving to let flavors lock in!\n\nDouble tap if you love great food! ❤️\n\n${hashtags.join('\n')}`;
    }
    if (platform === 'linkedin') {
      return `What cooking ${topic} taught me about leadership and patience:\n\nIn both culinary arts and professional execution, you cannot skip stages. Rushing ingredients produces mediocre results; respecting timing, preparation, and patience creates excellence.\n\nWhat is an outside-of-work passion that sharpens your professional focus?\n\n${tagText}`;
    }
    return `Hey food lovers! ${emojis[0]} Who else loves ${topic}? Made a fresh batch and the aroma is filling the whole kitchen! How do you like yours prepared? Tell me in the comments! 👇😋`;
  }

  if (domain === 'sports') {
    if (platform === 'twitter') {
      const tweets = [
        `The intensity in ${topic} right now is on another level! What a match! 🏏🔥 ${tagText}`,
        `Key takeaway from ${topic}: Tactical discipline under high pressure separates champions from runners-up. 🏆`,
        `Who was your MVP in ${topic} this week? Let's settle the debate in the replies! 👇⚡`
      ];
      return tweets[variant % tweets.length];
    }
    if (platform === 'instagram') {
      return `${emojis[0]} Game day energy! Let's talk about ${tCap}! ${emojis[1]}\n\nWhen the stakes are high, it all comes down to mindset, tactical positioning, and trusting your preparation.\n\nDrop your match predictions below! 👇🔥\n\n${hashtags.join('\n')}`;
    }
    if (platform === 'linkedin') {
      return `Leadership lessons from ${tCap}:\n\nHigh-performance teams mirror championship athletic squads:\n• Clear role clarity\n• Unwavering trust under pressure\n• Quick recovery from tactical setbacks\n\nHow does your team foster resilience when stakes are high?\n\n${tagText}`;
    }
    return `What a game! ${emojis[0]} Watching ${topic} had me on the edge of my seat! What was your favorite moment? Share your thoughts below! 👇🏆`;
  }

  if (domain === 'medical') {
    if (platform === 'twitter') {
      const tweets = [
        `Friendly health reminder: Preventive care for ${topic} is always easier and cheaper than emergency treatment. 🩺✨`,
        `Don't ignore subtle warning signs in ${topic}. When in doubt, always consult a qualified professional. 💡`,
        `Consistency in daily hygiene and routine checkups: the two best investments for ${topic}. 🦷🏥`
      ];
      return tweets[variant % tweets.length];
    }
    if (platform === 'instagram') {
      return `${emojis[0]} Prioritizing your health: Let's talk about ${tCap} ${emojis[1]}\n\nTaking proactive care of your health today prevents painful and costly treatments tomorrow. Daily hygiene and timely doctor checkups are key!\n\n💡 Reminder: Don't wait for symptoms to worsen before seeking professional advice.\n\nDouble tap to share this health reminder with someone you care about! ❤️\n\n${hashtags.join('\n')}`;
    }
    if (platform === 'linkedin') {
      return `Innovations in modern healthcare and patient care around ${tCap}:\n\nDigital record keeping, streamlined appointment workflows, and patient-first clinical communication are elevating healthcare delivery standards.\n\nHow is your organization advancing patient experience this year?\n\n${tagText}`;
    }
    return `Health tip of the day! ${emojis[0]} Taking care of ${topic} is so important for you and your family. Have you scheduled your routine checkup this year? Let's discuss below! 👇🏥`;
  }

  // General Topic Social Captions
  if (platform === 'twitter') {
    const tweets = [
      `The secret to mastering ${topic}? Stop searching for shortcuts and execute the core fundamentals consistently. 🧵👇 ${tagText}`,
      `3 simple rules for ${topic}:\n\n1. Start with clear goals\n2. Focus on actionable steps\n3. Measure real progress\n\nSave this. 📌`,
      `Action creates clarity. If you've been putting off ${topic}, take the first small step today. ⚡`
    ];
    return tweets[variant % tweets.length];
  }
  if (platform === 'instagram') {
    return `${emojis[0]} Deep dive into ${tCap} ${emojis[1]}\n\nWhen exploring ${topic}, focusing on proven fundamentals and practical execution is what creates lasting results:\n\n1️⃣ Clarify your primary goal\n2️⃣ Break down the process into actionable steps\n3️⃣ Stay consistent and evaluate progress\n\nDouble tap if this resonates with your journey! ❤️\n\n${hashtags.join('\n')}`;
  }
  if (platform === 'linkedin') {
    return `Strategic insights on ${tCap} for modern professionals:\n\nSuccess with ${topic} requires balancing visionary planning with disciplined day-to-day execution. Teams and individuals who institutionalize these methods achieve measurable compounding advantages.\n\nHow are you approaching ${topic} in your workflows?\n\n${tagText}`;
  }
  return `Hey everyone! 👋 Wanted to share a quick insight on ${topic} that really helped simplify things for me. What has been your experience with this? Let's chat in the comments! 👇💬`;
};

// 1. LOCAL BLOG GENERATOR
export const generateLocalBlog = (topic, keywordsString, tone, length, audience) => {
  const keywords = keywordsString
    ? keywordsString.split(',').map(k => k.trim()).filter(k => k.length > 0)
    : [];

  const ctx = detectDomain(topic);
  const article = buildDomainSpecificBlog(topic, ctx.domain, audience, keywords);

  const finalBody = applyToneModifications(article.body, tone);
  const words = wordCount(finalBody);
  const metaDesc = `Discover the ultimate guide on ${topic}. Learn key strategies, practical tips, and actionable advice for ${audience || 'readers'}.`;

  return {
    title: article.title,
    content: finalBody,
    metaDescription: metaDesc.slice(0, 155),
    wordCount: words,
    readingTime: readingTime(finalBody),
    keywordsSuggested: keywords.length > 0 ? keywords : [topic.toLowerCase(), ctx.domain, 'guide'],
    source: 'local'
  };
};

export const generateBlog = async (topic, keywordsString, tone, length, audience) => {
  // Check if Python local engine is active
  const preferPython = localStorage.getItem('creator_prefer_python') !== 'false';
  if (preferPython) {
    const aiSettings = getAiSettings();
    const pyData = await callPythonApi('/blog', {
      topic,
      keywords: keywordsString,
      tone,
      length,
      audience,
      api_key: aiSettings.apiKey,
      provider: aiSettings.enabled ? aiSettings.provider : 'local',
      model: aiSettings.model
    });
    if (pyData && pyData.content) {
      return {
        ...pyData,
        source: 'python'
      };
    }
  }

  const keywords = keywordsString
    ? keywordsString.split(',').map(k => k.trim()).filter(Boolean)
    : [];
  const prompt = `Write a useful, original blog article in markdown.
Topic: ${topic}
Audience: ${audience || 'general readers'}
Tone: ${tone}
Length preference: ${length}
Required keywords: ${keywords.join(', ') || 'none'}
Return only the article markdown with a clear H1, H2 sections, practical details, and a conclusion.`;

  const ai = await tryAiText(prompt);
  if (ai.text) {
    const title = ai.text.match(/^#\s+(.+)$/m)?.[1] || `Guide to ${topic}`;
    return {
      title,
      content: ai.text,
      metaDescription: `Learn ${topic} with practical guidance for ${audience || 'readers'}. Includes key steps, useful examples, and an actionable summary.`,
      wordCount: wordCount(ai.text),
      readingTime: readingTime(ai.text),
      keywordsSuggested: keywords.length > 0 ? keywords : [topic, 'strategy', 'guide'],
      source: 'ai',
    };
  }

  return generateLocalBlog(topic, keywordsString, tone, length, audience);
};

// 2. SOCIAL MEDIA CAPTION GENERATOR
export const generateLocalSocialCaptions = (topic, platforms, tone, count = 3) => {
  const results = {};

  platforms.forEach(platform => {
    const list = [];
    for (let i = 0; i < count; i++) {
      list.push(buildDomainSocialCaptions(topic, platform.toLowerCase(), tone, i));
    }
    results[platform] = list;
  });

  return results;
};

export const generateSocialCaptions = async (topic, platforms, tone, count = 3) => {
  const preferPython = localStorage.getItem('creator_prefer_python') !== 'false';
  if (preferPython) {
    const aiSettings = getAiSettings();
    const pyData = await callPythonApi('/social', {
      topic,
      platforms,
      tone,
      count,
      api_key: aiSettings.apiKey,
      provider: aiSettings.enabled ? aiSettings.provider : 'local',
      model: aiSettings.model
    });
    if (pyData && Object.keys(pyData).length > 0) {
      return pyData;
    }
  }

  const prompt = `Generate ${count} social media captions for each platform: ${platforms.join(', ')}.
Topic: ${topic}
Tone: ${tone}
Return strict JSON only. Shape: {"linkedin":["..."],"twitter":["..."],"instagram":["..."],"facebook":["..."]}. Include only selected platform keys.`;

  const ai = await tryAiText(prompt);
  if (ai.text) {
    try {
      return JSON.parse(ai.text.replace(/^```json\s*|\s*```$/g, ''));
    } catch (error) {
      console.warn('AI social JSON parse failed; using local fallback.', error);
    }
  }
  return generateLocalSocialCaptions(topic, platforms, tone, count);
};

// 3. SEO OPTIMIZER (Linguistic text analysis)
export const analyzeSEO = async (content, targetKeyword, metaDescription = '') => {
  if (!content) return { score: 0, checklist: [] };

  const preferPython = localStorage.getItem('creator_prefer_python') !== 'false';
  if (preferPython) {
    const pyResult = await callPythonApi('/seo', {
      content,
      target_keyword: targetKeyword,
      meta_description: metaDescription
    });
    if (pyResult && pyResult.score !== undefined) {
      return pyResult;
    }
  }

  const checklist = [];
  let score = 30; // base score for having content

  const wordCount = content.split(/\s+/).filter(w => w.length > 0).length;
  const kw = targetKeyword.trim().toLowerCase();

  // 1. Content Length Audit
  if (wordCount >= 1000) {
    score += 15;
    checklist.push({ id: 'len', status: 'pass', label: `Content length is excellent (${wordCount} words)` });
  } else if (wordCount >= 500) {
    score += 10;
    checklist.push({ id: 'len', status: 'pass', label: `Good content length (${wordCount} words). Aim for 1000+ words for competitive topics.` });
  } else {
    checklist.push({ id: 'len', status: 'warn', label: `Content is too short (${wordCount} words). Add more details to reach at least 500 words.` });
  }

  if (kw) {
    const regex = new RegExp(`\\b${escapeRegExp(kw)}\\b`, 'gi');
    const matches = content.match(regex) || [];
    const count = matches.length;
    const density = wordCount > 0 ? (count / wordCount) * 100 : 0;

    // 2. Keyword Density Audit
    if (density >= 1 && density <= 3) {
      score += 15;
      checklist.push({ id: 'dens', status: 'pass', label: `Target keyword density is ideal (${density.toFixed(2)}% - ${count} times)` });
    } else if (density > 3) {
      score += 5;
      checklist.push({ id: 'dens', status: 'warn', label: `Keyword density is high (${density.toFixed(2)}%). Risk of keyword stuffing. Reduce keyword usage.` });
    } else if (count > 0) {
      score += 8;
      checklist.push({ id: 'dens', status: 'warn', label: `Keyword density is low (${density.toFixed(2)}%). Include the keyword a few more times.` });
    } else {
      checklist.push({ id: 'dens', status: 'fail', label: `Target keyword "${targetKeyword}" not found in content.` });
    }

    // 3. Keyword in first 100 words (Introduction)
    const first100 = content.split(/\s+/).slice(0, 100).join(' ').toLowerCase();
    if (first100.includes(kw)) {
      score += 10;
      checklist.push({ id: 'intro', status: 'pass', label: 'Keyword is present in the introduction (first 100 words)' });
    } else {
      checklist.push({ id: 'intro', status: 'fail', label: 'Keyword is missing in the introduction. Add it in the first paragraph.' });
    }

    // 4. Keyword in Headings (H2/H3)
    const h2h3Regex = /^(##|###)\s+(.*)$/gm;
    let headingMatch;
    let keywordInHeading = false;
    while ((headingMatch = h2h3Regex.exec(content)) !== null) {
      if (headingMatch[2].toLowerCase().includes(kw)) {
        keywordInHeading = true;
        break;
      }
    }
    if (keywordInHeading) {
      score += 10;
      checklist.push({ id: 'headings', status: 'pass', label: 'Keyword found in subheadings (H2 or H3)' });
    } else {
      checklist.push({ id: 'headings', status: 'warn', label: 'Keyword not found in subheadings. Include it in at least one H2 title.' });
    }

    // 5. Keyword in Meta Description
    if (metaDescription) {
      const descLower = metaDescription.toLowerCase();
      if (descLower.includes(kw)) {
        score += 10;
        checklist.push({ id: 'meta_kw', status: 'pass', label: 'Keyword is present in the meta description' });
      } else {
        checklist.push({ id: 'meta_kw', status: 'fail', label: 'Keyword is missing in the meta description.' });
      }
    }
  } else {
    checklist.push({ id: 'kw_missing', status: 'warn', label: 'Add a target keyword to enable full keyword-optimization scoring.' });
  }

  // 6. Meta Description Length Audit
  if (metaDescription) {
    const metaLen = metaDescription.length;
    if (metaLen >= 120 && metaLen <= 160) {
      score += 10;
      checklist.push({ id: 'meta_len', status: 'pass', label: `Meta description length is ideal (${metaLen} characters)` });
    } else {
      checklist.push({ id: 'meta_len', status: 'warn', label: `Meta description length (${metaLen} chars) should be between 120 and 160 characters.` });
    }
  } else {
    checklist.push({ id: 'meta_missing', status: 'warn', label: 'Meta description is missing. Add one to improve search snippet visibility.' });
  }

  // 7. Structural Diversity (Headers presence)
  const headerCount = (content.match(/^#+\s+/gm) || []).length;
  if (headerCount >= 3) {
    score += 10;
    checklist.push({ id: 'struct', status: 'pass', label: `Good use of structural headers (${headerCount} headings)` });
  } else {
    checklist.push({ id: 'struct', status: 'warn', label: `Add more headings (H2/H3) to break up the text and improve readability.` });
  }

  // Cap score at 100, min 0
  score = Math.min(100, Math.max(0, score));

  return {
    score,
    checklist
  };
};

// 4. KEYWORDS & HASHTAGS GENERATOR
export const generateKeywords = async (topic, intent = 'informational') => {
  const preferPython = localStorage.getItem('creator_prefer_python') !== 'false';
  if (preferPython) {
    const pyResult = await callPythonApi('/keywords', { topic, intent });
    if (pyResult) {
      const primary = pyResult.primary || (pyResult.keywords && pyResult.keywords[0]) || { kw: topic, vol: '14.5K - 45.2K', diff: 'Medium', cpc: '$1.85' };
      const secondary = pyResult.secondary || (pyResult.keywords && pyResult.keywords.slice(1)) || [];
      const hashtags = pyResult.hashtags || { highVolume: [], mediumVolume: [], lowVolume: [] };
      return {
        ...pyResult,
        primary,
        secondary,
        hashtags
      };
    }
  }

  const topicClean = (topic || '').trim().toLowerCase();
  const tTitle = topic.charAt(0).toUpperCase() + topic.slice(1);
  const words = topicClean.split(/[^a-zA-Z0-9]+/).filter(w => w.length > 2);
  const mainWord = words[0] || 'Guide';

  // Primary Keyword
  const primary = {
    kw: topicClean,
    vol: '14.5K - 45.2K',
    diff: 'Medium',
    cpc: '$1.85'
  };

  // Intent-based dynamic secondary keywords
  let secondaryTemplates = [];
  let vols = [];
  let diffs = [];
  let cpcs = [];

  if (intent === 'transactional') {
    secondaryTemplates = [
      `best ${topicClean} services`,
      `buy ${topicClean} online`,
      `top rated ${topicClean} deals`,
      `affordable ${topicClean} packages`,
      `${topicClean} price and comparison`,
      `hire ${topicClean} experts`
    ];
    diffs = ['High', 'Medium', 'High', 'Low', 'Medium', 'Low'];
    vols = ['18.2K', '29.5K', '12.0K', '34.1K', '22.8K', '8.5K'];
    cpcs = ['$3.40', '$4.20', '$2.80', '$1.90', '$2.50', '$3.80'];
  } else {
    secondaryTemplates = [
      `how to master ${topicClean}`,
      `${topicClean} step by step guide`,
      `best tips for ${topicClean}`,
      `${topicClean} for beginners`,
      `common mistakes in ${topicClean}`,
      `future trends in ${topicClean}`
    ];
    diffs = ['Low', 'Medium', 'Low', 'Medium', 'High', 'Medium'];
    vols = ['42.0K', '31.5K', '55.0K', '68.2K', '19.4K', '25.0K'];
    cpcs = ['$0.95', '$1.40', '$1.10', '$0.85', '$1.60', '$2.10'];
  }

  const secondary = secondaryTemplates.map((kw, i) => ({
    kw,
    vol: vols[i % vols.length],
    diff: diffs[i % diffs.length],
    cpc: cpcs[i % cpcs.length]
  }));

  const tagRoot = topicClean.replace(/[^a-zA-Z0-9]/g, '');
  const hashtags = {
    highVolume: [`#${tTitle.replace(/\s+/g, '')}`, `#${mainWord}Daily`, '#TrendingNow', '#ExplorePage', '#ViralPost'],
    mediumVolume: [`#${tTitle.replace(/\s+/g, '')}Tips`, `#${tTitle.replace(/\s+/g, '')}Guide`, `#${mainWord}Lovers`, '#BestPractices', '#ProTips'],
    lowVolume: [`#${tTitle.replace(/\s+/g, '')}ForBeginners`, `#Learn${mainWord}`, `#${tTitle.replace(/\s+/g, '')}Community`, '#ActionableAdvice']
  };

  return {
    primary,
    secondary,
    keywords: [primary, ...secondary],
    hashtags
  };
};
