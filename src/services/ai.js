// Hybrid content engine. It tries OpenAI first when an API key is configured,
// then falls back to the curated local dataset when the key is missing, quota is
// exhausted, or the network request fails.

// Helper: Normalize inputs
const normalizeTopic = (topic) => topic.trim().toLowerCase();
const wordCount = (text = '') => text.split(/\s+/).filter(Boolean).length;
const readingTime = (text = '') => Math.max(1, Math.ceil(wordCount(text) / 200));
const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Dedicated Local Python Backend Connectors
const PYTHON_BACKEND_URLS = ['/py-api', 'http://127.0.0.1:8000/api'];

export const checkPythonBackend = async () => {
  for (const base of PYTHON_BACKEND_URLS) {
    try {
      const res = await fetch(`${base}/health`, { method: 'GET', signal: AbortSignal.timeout(1200) });
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
  for (const base of PYTHON_BACKEND_URLS) {
    try {
      const res = await fetch(`${base}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(6000)
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Try next
    }
  }
  return null;
};

const getAiSettings = () => {
  const apiKey = (localStorage.getItem('creator_ai_key') || localStorage.getItem('creator_openai_key') || '').trim();
  const provider = localStorage.getItem('creator_ai_provider') || (apiKey.startsWith('AIza') ? 'gemini' : apiKey.startsWith('gsk_') ? 'groq' : 'gemini');
  const defaultModel = provider === 'gemini' ? 'gemini-2.5-flash' : provider === 'groq' ? 'llama-3.1-8b-instant' : 'gpt-4o-mini';
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

const callOpenAI = async (prompt) => {
  const settings = getAiSettings();
  if (!settings.enabled || !settings.apiKey.trim()) {
    throw new Error('AI provider is not configured.');
  }

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

// Database of Industry-specific templates to build realistic articles
const industryData = {
  tech: {
    headings: [
      'The Shift Toward Modern Technical Architectures',
      'Overcoming Integration and Deployment Obstacles',
      'Industry Best Practices for Engineering Teams',
      'The Next Phase: Looking Towards Future Innovations'
    ],
    paragraphs: [
      'In today\'s digital landscape, setting up scalable systems is no longer a luxury. Modern tech environments demand robust development practices, clean data pipelines, and strong infrastructure choices to ensure smooth operations and prevent future failures.',
      'One of the most persistent bottlenecks is managing integration complexity. As software grows, retaining code readability and deployment speeds becomes a major balance. Modern engineering teams solve this by adopting modular designs, clean tests, and automation frameworks.',
      'Ultimately, engineering success requires aligning product capabilities with real-world problems. It is not just about writing clean lines of logic; it is about addressing system bottlenecks and building user-centric technical solutions that compound in value over time.'
    ]
  },
  marketing: {
    headings: [
      'Identifying and Reaching Your Ideal Target Demographic',
      'Crafting Content Strategies that Convert Readers',
      'Utilizing Multi-Channel Promotion flywheels',
      'Key Growth Metrics to Track and Measure Success'
    ],
    paragraphs: [
      'Successful marketing is built on data-driven customer insights. Before launching any promotional campaigns, marketers must map out customer journeys to identify key touchpoints, understand user intent, and clear potential friction points.',
      'With digital fatigue at an all-time high, generic advertisements no longer deliver high conversions. Brands must pivot to authority-building, educational content. Providing authentic value creates trust and positions you as a leading expert in the niche.',
      'True business growth requires multi-channel coordination. Combining search engine optimization (SEO) with direct outreach and active communities generates a self-sustaining marketing loop that multiplies organic brand exposure.'
    ]
  },
  finance: {
    headings: [
      'Foundations of Wealth Building and Resource Planning',
      'Understanding Risk Factors and Asset Distribution Models',
      'The Compounding Power of Smart Financial Habits',
      'Developing Sustainable Cash Flow Streams'
    ],
    paragraphs: [
      'Achieving long-term wealth begins with clear cash flow management. Whether organizing startup budgets or personal funds, minimizing high-interest liabilities and maintaining a stable liquidity cushion are critical first steps.',
      'Diversified allocation models form the bedrock of risk management. Balancing capital across index funds, secure sectors, and alternative assets mitigates losses during market corrections. Focus on long-term compound growth rather than short-term market speculation.',
      'Ultimately, financial freedom is about generating passive cash flow. Building income sources that require minimal active oversight provides the flexibility and stability to seize new ventures and protect purchasing power against inflation.'
    ]
  },
  health: {
    headings: [
      'Integrating Body and Mind for Longevity',
      'Designing a Nutritional Framework that Sustains Vitality',
      'Managing Daily Stress Through Sleep and Recovery Systems',
      'Forming Functional Movement Routines that Last'
    ],
    paragraphs: [
      'Optimal physical wellness is a holistic achievement. Vitality requires aligning balanced nutrition, consistent conditioning, and quality mental recovery. Addressing symptoms in isolation rarely yields long-term health improvements.',
      'Nutritional plans should focus on fresh, nutrient-dense whole foods that support digestive health, steady energy, and stable blood sugar. Developing simple, repeatable meal prep habits is far more effective than chasing transient diet trends.',
      'Consistent movement and regular recovery schedules are non-negotiable. Building muscle strength, supporting cardiovascular efficiency, and obtaining deep circadian sleep keep the body resilient against physical stress and aging.'
    ]
  },
  general: {
    headings: [
      'Essential Foundations and Basic Principles',
      'Identifying Obstacles and Strategic Workarounds',
      'Building Daily habits to Maintain Steady Progress',
      'Summary Guidelines and Future Recommendations'
    ],
    paragraphs: [
      'Embarking on any new goal requires a clear vision and organized execution. Setting achievable milestones early prevents overwhelm and maintains steady momentum, ensuring you stay focused on target actions.',
      'Inevitably, obstacles will arise along the journey. Adapting to challenges, reviewing feedback, and editing your methods are the keys to long-term success. Focus on minor iterations and treat mistakes as learning opportunities.',
      'Consistency is far more powerful than sporadic bursts of effort. By dedicating focused time daily to your objectives, you establish positive habits that compound over time, leading to major progress.'
    ]
  }
};

const detectIndustry = (topic) => {
  const normTopic = normalizeTopic(topic);
  if (/iphone|android|samsung|mobile|phone|smartphone|laptop|camera|gadget|device|wearable|tablet|tech|software|ai|programming|code|web|app|developer|cloud|data|automation|api/.test(normTopic)) return 'tech';
  if (/marketing|seo|brand|sales|growth|traffic|social|content|campaign/.test(normTopic)) return 'marketing';
  if (/finance|money|invest|crypto|budget|stocks|wealth|saving|income/.test(normTopic)) return 'finance';
  if (/health|fitness|diet|wellness|nutrition|workout|sleep|stress/.test(normTopic)) return 'health';
  return 'general';
};

const detectTopicType = (topic) => {
  const normalized = normalizeTopic(topic);
  if (/iphone|android|samsung|mobile|phone|smartphone|laptop|camera|gadget|device|wearable|tablet/.test(normalized)) return 'device';
  if (/course|class|training|workshop|webinar|bootcamp/.test(normalized)) return 'course';
  if (/sale|offer|discount|deal|launch|new arrival|product|service/.test(normalized)) return 'offer';
  return 'general';
};

const cleanHashtagToken = (topic) => topic
  .replace(/[^a-z0-9 ]/gi, '')
  .trim()
  .split(/\s+/)
  .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
  .join('');

const getTopicHashtags = (topic, industry) => {
  const topicTag = cleanHashtagToken(topic);
  const pools = {
    tech: ['#TechReview', '#Smartphone', '#GadgetLovers', '#MobileTech'],
    marketing: ['#MarketingTips', '#BrandGrowth', '#ContentStrategy', '#DigitalMarketing'],
    finance: ['#FinanceTips', '#MoneyMindset', '#Investing', '#WealthBuilding'],
    health: ['#HealthyLifestyle', '#WellnessTips', '#FitnessGoals', '#SelfCare'],
    general: ['#Tips', '#DailyValue', '#SmartChoice', '#NewPost'],
  };

  return [`#${topicTag}`, ...(pools[industry] || pools.general)].filter((tag) => tag.length > 1);
};

const platformLineBreak = (platform) => platform === 'twitter' ? ' ' : '\n\n';

const buildLocalSocialCaption = (topic, platform, tone, variant, tags) => {
  const topicType = detectTopicType(topic);
  const tagText = platform === 'instagram' ? tags.join('\n') : tags.slice(0, 4).join(' ');
  const gap = platformLineBreak(platform);
  const isShort = platform === 'twitter';

  const deviceCaptions = [
    `Thinking about **${topic}**? Start with what matters most: camera quality, battery life, display brightness, storage, and long-term software support.${gap}${isShort ? 'Quick pick: compare real needs before upgrading.' : 'Before upgrading, compare your current phone with the features you will actually use every day.'}${gap}${tagText}`,
    `**${topic}** is a strong choice if you want a premium phone experience without overcomplicating the decision.${gap}Check these before buying: camera performance, battery backup, storage size, warranty, and final price after offers.${gap}${tagText}`,
    `Buying **${topic}**? Do not choose only by hype.${gap}Pick it if you need smoother performance, better photos/videos, reliable updates, and a phone that can stay useful for years.${gap}${tagText}`,
  ];

  const generalCaptions = [
    `Here is a practical look at **${topic}**.${gap}The real value comes from understanding who it is for, what problem it solves, and why now is the right time to care.${gap}${tagText}`,
    `If **${topic}** is on your mind, focus on benefits instead of noise.${gap}Look at the use case, the outcome, and the next step you can take today.${gap}${tagText}`,
    `Let us keep **${topic}** simple.${gap}Know the goal, compare the options, and choose the path that gives the most useful result for your situation.${gap}${tagText}`,
  ];

  const offerCaptions = [
    `New update on **${topic}**.${gap}If you have been waiting for the right moment, compare the value, check the details, and make a confident decision.${gap}${tagText}`,
    `Looking at **${topic}**?${gap}This is a good time to review the features, pricing, and fit before you decide.${gap}${tagText}`,
    `Do not miss the details on **${topic}**.${gap}Check what you get, who it helps, and whether the offer matches your need.${gap}${tagText}`,
  ];

  const courseCaptions = [
    `Want to learn **${topic}**?${gap}Start with the fundamentals, practice consistently, and build one small project or result at a time.${gap}${tagText}`,
    `**${topic}** becomes easier when you follow a clear path.${gap}Learn the basics, apply them quickly, and review your progress every week.${gap}${tagText}`,
    `If you are starting **${topic}**, keep it practical.${gap}Focus on real examples, daily practice, and measurable improvement.${gap}${tagText}`,
  ];

  const captionGroups = {
    device: deviceCaptions,
    offer: offerCaptions,
    course: courseCaptions,
    general: generalCaptions,
  };

  const caption = captionGroups[topicType][variant % captionGroups[topicType].length];

  if (tone.toLowerCase() === 'bold') {
    return caption.replace('Thinking about', 'Stop guessing about').replace('Here is', 'Here is the no-fluff take on');
  }

  if (tone.toLowerCase() === 'professional') {
    return caption.replace('Do not', 'Avoid').replace('Let us', 'Let us');
  }

  return applyToneModifications(caption, tone);
};

const localDataset = {
  tech: {
    angles: ['implementation roadmap', 'automation plan', 'security checklist', 'performance improvement'],
    actions: ['audit current workflows', 'standardize reusable modules', 'measure latency and failure points', 'document rollback steps'],
  },
  marketing: {
    angles: ['audience research', 'conversion copy', 'channel strategy', 'retention loop'],
    actions: ['define buyer intent', 'map content to funnel stages', 'test CTAs weekly', 'repurpose winning posts'],
  },
  finance: {
    angles: ['risk control', 'cash-flow planning', 'long-term compounding', 'portfolio discipline'],
    actions: ['separate emergency funds', 'review recurring expenses', 'avoid concentrated bets', 'rebalance on schedule'],
  },
  health: {
    angles: ['habit design', 'recovery planning', 'nutrition basics', 'progress tracking'],
    actions: ['set realistic routines', 'prioritize sleep quality', 'track energy levels', 'adjust slowly'],
  },
  general: {
    angles: ['clear goals', 'practical execution', 'habit building', 'review system'],
    actions: ['break the work into milestones', 'remove avoidable friction', 'track weekly progress', 'keep improving the process'],
  },
};

// Tone modifications vocabulary helper
const applyToneModifications = (text, tone) => {
  const modifications = {
    professional: {
      replace: { 'get': 'acquire', 'make': 'construct', 'use': 'utilize', 'bad': 'suboptimal', 'good': 'advantageous', 'start': 'commence' }
    },
    casual: {
      replace: { 'utilize': 'use', 'suboptimal': 'rough', 'therefore': 'so', 'however': 'but', 'furthermore': 'plus', 'acquire': 'get' }
    },
    witty: {
      replace: { 'important': 'vital (unlike the extra plastic wrap on cereal boxes)', 'process': 'routine dance', 'success': 'world domination' }
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

// 1. BLOG GENERATOR
export const generateLocalBlog = (topic, keywordsString, tone, length, audience) => {
  const keywords = keywordsString
    ? keywordsString.split(',').map(k => k.trim()).filter(k => k.length > 0)
    : [];
  
  const industry = detectIndustry(topic);

  const selectedIndustry = industryData[industry];
  const dataset = localDataset[industry];
  const capitalizedTopic = topic.charAt(0).toUpperCase() + topic.slice(1);

  // Generate Title related directly to user topic
  const titleTemplates = [
    `The Ultimate Guide to ${capitalizedTopic}`,
    `Why ${capitalizedTopic} is the Key to Success`,
    `How to Master ${capitalizedTopic}: A Practical Approach`,
    `Demystifying ${capitalizedTopic}: What You Need to Know`,
    `5 Strategic Ways to Optimize ${capitalizedTopic} for Better Results`
  ];
  const title = titleTemplates[Math.floor(Math.random() * titleTemplates.length)];

  // Define sections based on length
  let numSections = 3;
  if (length === 'medium') numSections = 3;
  else if (length === 'long') numSections = 4;

  let blogMarkdown = `# ${title}\n\n`;
  
  // 1. Intro Paragraph (Dynamically weave the topic)
  let intro = `When it comes to **${topic}**, many ${audience || 'readers'} find themselves searching for a clear, actionable roadmap. `;
  intro += `Developing a successful process around **${topic}** requires a combination of strategic planning, structural execution, and constant evaluation. `;
  if (keywords.length > 0) {
    intro += `To achieve optimal results, you must pay close attention to core factors like **${keywords[0]}** and how they feed into your wider goals. `;
  }
  intro += `In this article, we will break down the essential guidelines to help you navigate this space and succeed.`;
  blogMarkdown += `${applyToneModifications(intro, tone)}\n\n`;

  // 2. Body Sections (Dynamically customized to match the user's topic)
  for (let i = 0; i < numSections; i++) {
    const datasetAngle = dataset.angles[i % dataset.angles.length];
    const datasetAction = dataset.actions[i % dataset.actions.length];
    const headingsByNiche = [
      `Understanding the Fundamentals of ${capitalizedTopic}`,
      `Key Challenges in Implementing ${capitalizedTopic}`,
      `Actionable Best Practices for ${capitalizedTopic}`,
      `The Future Scope and Evolution of ${capitalizedTopic}`
    ];
    const headingText = headingsByNiche[i % headingsByNiche.length];
    
    blogMarkdown += `## ${i + 1}. ${headingText}\n\n`;

    // Compose custom related paragraphs
    let bodyPara1 = selectedIndustry.paragraphs[i % selectedIndustry.paragraphs.length];
    // Ingress the user topic dynamically
    bodyPara1 = `To build a solid approach for **${topic}**, start with a focused ${datasetAngle}. ` + bodyPara1;
    
    if (keywords.length > 0) {
      const kw = keywords[(i + 1) % keywords.length] || keywords[0];
      bodyPara1 += ` Furthermore, integrating **${kw}** within your **${topic}** system ensures better reliability and performance.`;
    }

    let bodyPara2 = `Consistency is the main multiplier here. Managing **${topic}** is never a one-time setup; it is a recurring workflow. A useful next step is to ${datasetAction}, then refine your strategy based on evidence instead of guesswork.`;
    if (length === 'long') {
      bodyPara2 += ` Always analyze metrics weekly. Focus on long-term values, document your lessons, and share these insights with your team to stay aligned.`;
    }

    blogMarkdown += `${applyToneModifications(bodyPara1, tone)}\n\n`;
    blogMarkdown += `${applyToneModifications(bodyPara2, tone)}\n\n`;
  }

  // 3. Conclusion Paragraph (Dynamically weave the topic)
  blogMarkdown += `## Conclusion\n\n`;
  let concl = `Ultimately, mastering **${topic}** is a progressive journey that requires persistent work. By focusing on the strategies detailed above${keywords.length > 0 ? `, particularly **${keywords.join(', ')}**,` : ''} you will be well-equipped to achieve your goals. Start small, review feedback regularly, and watch your metrics compound.`;
  blogMarkdown += `${applyToneModifications(concl, tone)}\n`;

  const words = wordCount(blogMarkdown);

  // Generate Meta Description directly related to user topic
  const metaDesc = `Discover the ultimate guide on ${topic}. Learn how to optimize results, overcome key challenges, and integrate ${keywords[0] || 'proven strategies'} into your workflow.`;

  return {
    title,
    content: blogMarkdown,
    metaDescription: metaDesc,
    wordCount: words,
    readingTime: readingTime(blogMarkdown),
    keywordsSuggested: keywords.length > 0 ? keywords : [topic, dataset.angles[0], 'strategy', 'guide'],
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

  // Detect industry dynamically from topic
  const industry = detectIndustry(topic);
  const tags = getTopicHashtags(topic, industry);

  platforms.forEach(platform => {
    const list = [];
    for (let i = 0; i < count; i++) {
      list.push(buildLocalSocialCaption(topic, platform.toLowerCase(), tone, i, tags));
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
export const generateKeywords = async (topic, intent) => {
  const preferPython = localStorage.getItem('creator_prefer_python') !== 'false';
  if (preferPython) {
    const pyResult = await callPythonApi('/keywords', { topic, intent });
    if (pyResult) {
      const primary = pyResult.primary || (pyResult.keywords && pyResult.keywords[0]) || { kw: topic, vol: '1.2K - 5.5K (Est.)', diff: 'Medium', cpc: '$1.45' };
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

  const normTopic = normalizeTopic(topic);
  
  // Custom keyword databases grouped by industry dynamically
  const nicheDb = {
    tech: [
      { kw: 'latest software trends', vol: '12K', diff: 'Medium', cpc: '$2.50' },
      { kw: 'ai automation tools', vol: '8.4K', diff: 'High', cpc: '$4.10' },
      { kw: 'how to learn coding online', vol: '22K', diff: 'Low', cpc: '$0.80' },
      { kw: 'best cloud infrastructure', vol: '5.2K', diff: 'High', cpc: '$6.50' },
      { kw: 'digital transformation strategy', vol: '4.1K', diff: 'Medium', cpc: '$5.20' }
    ],
    marketing: [
      { kw: 'content marketing strategy', vol: '18K', diff: 'High', cpc: '$3.80' },
      { kw: 'seo tools for beginners', vol: '14K', diff: 'Medium', cpc: '$1.90' },
      { kw: 'social media growth hacks', vol: '9.6K', diff: 'Low', cpc: '$1.20' },
      { kw: 'email campaign optimization', vol: '4.8K', diff: 'Medium', cpc: '$3.40' },
      { kw: 'b2b lead generation tips', vol: '6.5K', diff: 'High', cpc: '$5.80' }
    ],
    finance: [
      { kw: 'how to start investing', vol: '45K', diff: 'High', cpc: '$2.10' },
      { kw: 'budget planning template', vol: '33K', diff: 'Medium', cpc: '$1.10' },
      { kw: 'passive income ideas 2026', vol: '28K', diff: 'High', cpc: '$1.60' },
      { kw: 'safe stocks to buy', vol: '19K', diff: 'Medium', cpc: '$2.40' },
      { kw: 'cryptocurrency trading guide', vol: '54K', diff: 'High', cpc: '$1.80' }
    ],
    health: [
      { kw: 'home workout no equipment', vol: '60K', diff: 'Low', cpc: '$0.40' },
      { kw: 'healthy meal prep ideas', vol: '40K', diff: 'Medium', cpc: '$0.90' },
      { kw: 'how to reduce stress fast', vol: '18K', diff: 'Low', cpc: '$0.75' },
      { kw: 'benefits of intermittent fasting', vol: '27K', diff: 'Medium', cpc: '$1.10' },
      { kw: 'improving sleep quality naturally', vol: '8.8K', diff: 'Low', cpc: '$1.30' }
    ]
  };

  // Find matches
  let selectedNiche = 'marketing';
  if (/tech|software|ai|programming|code|web|app|developer|cloud|data/.test(normTopic)) selectedNiche = 'tech';
  else if (/marketing|seo|brand|sales|growth|traffic|social/.test(normTopic)) selectedNiche = 'marketing';
  else if (/finance|money|invest|crypto|budget|stocks|wealth/.test(normTopic)) selectedNiche = 'finance';
  else if (/health|fitness|diet|wellness|nutrition|workout|sleep/.test(normTopic)) selectedNiche = 'health';

  // Primary Keyword
  const primary = {
    kw: topic.trim().toLowerCase(),
    vol: '1.2K - 5.5K (Est.)',
    diff: 'Medium',
    cpc: '$1.45'
  };

  // Secondary Keywords based on niche and search intent
  const preDefinedList = nicheDb[selectedNiche] || nicheDb.marketing;
  const secondary = preDefinedList.map(item => {
    let modifiedKw = item.kw;
    if (intent === 'transactional' && !modifiedKw.startsWith('buy') && !modifiedKw.includes('best')) {
      modifiedKw = 'best ' + modifiedKw;
    } else if (intent === 'informational' && !modifiedKw.startsWith('how') && !modifiedKw.startsWith('what')) {
      modifiedKw = 'understanding ' + modifiedKw;
    }
    return {
      kw: modifiedKw,
      vol: item.vol,
      diff: item.diff,
      cpc: item.cpc
    };
  });

  // Hashtags
  const hashtags = {
    highVolume: [`#${topic.replace(/\s+/g, '')}`, '#trending', '#success', '#growth'],
    mediumVolume: [`#${topic.replace(/\s+/g, '')}Strategy`, '#businessgoals', '#expertadvice', '#dailyinsights'],
    lowVolume: [`#learn${topic.replace(/\s+/g, '')}`, '#nichemarketing', '#worksmart', '#stepbystep']
  };

  return {
    primary,
    secondary,
    hashtags
  };
};
