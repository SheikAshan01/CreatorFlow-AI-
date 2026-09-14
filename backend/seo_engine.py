"""
Python Linguistic & SEO Auditing Engine
Computes readability metrics, keyword density, semantic heading inspection,
and search ranking signals directly in Python.
"""

import re
from typing import Dict, List, Any


def count_syllables(word: str) -> int:
    """Heuristic syllable counter for Flesch-Kincaid calculations."""
    word = word.lower().strip()
    if len(word) <= 3:
        return 1
    word = re.sub(r'(?:[^laeiouy]|ed|es|e)$', '', word)
    word = re.sub(r'^y', '', word)
    matches = re.findall(r'[aeiouy]{1,2}', word)
    return max(1, len(matches))


def compute_flesch_reading_ease(text: str) -> Dict[str, Any]:
    """Calculates Flesch Reading Ease score and grade level."""
    sentences = re.split(r'[.!?]+', text)
    sentences = [s.strip() for s in sentences if s.strip()]
    total_sentences = max(1, len(sentences))

    words = re.findall(r'\b[A-Za-z0-9\'-]+\b', text)
    total_words = max(1, len(words))

    total_syllables = sum(count_syllables(w) for w in words)

    # Flesch Reading Ease formula
    fre = 206.835 - (1.015 * (total_words / total_sentences)) - (84.6 * (total_syllables / total_words))
    fre = max(0, min(100, round(fre, 1)))

    if fre >= 80:
        difficulty = "Very Easy (Clear & conversational)"
    elif fre >= 60:
        difficulty = "Standard / Moderate (Accessible to general readers)"
    elif fre >= 40:
        difficulty = "Fairly Difficult (Technical / Business grade)"
    else:
        difficulty = "Dense / Complex (Academic audience)"

    return {
        "fleschScore": fre,
        "difficulty": difficulty,
        "totalSentences": total_sentences,
        "totalWords": total_words,
        "avgWordsPerSentence": round(total_words / total_sentences, 1)
    }


def analyze_python_seo(content: str, target_keyword: str = "", meta_description: str = "") -> Dict[str, Any]:
    """Evaluates content against 7 core search engine signals and linguistic standards."""
    if not content or not content.strip():
        return {
            "score": 0,
            "checklist": [{"id": "empty", "status": "fail", "label": "No content provided to analyze."}],
            "metrics": {}
        }

    checklist: List[Dict[str, str]] = []
    score = 30  # Base score for providing content

    words = re.findall(r'\b\w+\b', content)
    word_count = len(words)
    kw = target_keyword.strip().lower()

    # Readability computation
    readability = compute_flesch_reading_ease(content)

    # 1. Content Length Audit
    if word_count >= 1000:
        score += 15
        checklist.append({"id": "len", "status": "pass", "label": f"Content length is comprehensive ({word_count} words)"})
    elif word_count >= 500:
        score += 10
        checklist.append({"id": "len", "status": "pass", "label": f"Good content length ({word_count} words). Aim for 1000+ words for competitive topics."})
    else:
        checklist.append({"id": "len", "status": "warn", "label": f"Content is short ({word_count} words). Add more details to reach at least 500 words."})

    # 2. Keyword Audits
    if kw:
        pattern = r'\b' + re.escape(kw) + r'\b'
        matches = re.findall(pattern, content, re.IGNORECASE)
        count = len(matches)
        kw_word_count = max(1, len(kw.split()))
        density = (count * kw_word_count / max(1, word_count)) * 100

        if 1.0 <= density <= 3.0:
            score += 15
            checklist.append({"id": "dens", "status": "pass", "label": f"Target keyword density is ideal ({density:.2f}% - found {count} times)"})
        elif density > 3.0:
            score += 5
            checklist.append({"id": "dens", "status": "warn", "label": f"Keyword density is high ({density:.2f}%). Risk of keyword stuffing."})
        elif count > 0:
            score += 8
            checklist.append({"id": "dens", "status": "warn", "label": f"Keyword density is low ({density:.2f}%). Mention the keyword a few more times."})
        else:
            checklist.append({"id": "dens", "status": "fail", "label": f"Target keyword '{target_keyword}' was not detected in the content."})

        # 3. Intro Prominence (First 100 words)
        first_100 = " ".join(words[:100]).lower()
        if kw in first_100:
            score += 10
            checklist.append({"id": "intro", "status": "pass", "label": "Keyword is present in the introduction (first 100 words)"})
        else:
            checklist.append({"id": "intro", "status": "fail", "label": "Keyword is missing from the introduction. Add it in the first paragraph."})

        # 4. Heading Prominence (H1, H2, H3)
        headings = re.findall(r'^(?:#|##|###)\s+(.*)$', content, re.MULTILINE)
        keyword_in_heading = any(kw in h.lower() for h in headings)
        if keyword_in_heading:
            score += 10
            checklist.append({"id": "headings", "status": "pass", "label": "Keyword found in structural subheadings (H2 or H3)"})
        else:
            checklist.append({"id": "headings", "status": "warn", "label": "Keyword not found in subheadings. Include it in at least one H2 title."})

        # 5. Keyword in Meta Description
        if meta_description and meta_description.strip():
            if kw in meta_description.lower():
                score += 10
                checklist.append({"id": "meta_kw", "status": "pass", "label": "Keyword is present in the meta description"})
            else:
                checklist.append({"id": "meta_kw", "status": "fail", "label": "Keyword is missing in the meta description."})
    else:
        checklist.append({"id": "kw_missing", "status": "warn", "label": "Add a target keyword to unlock full keyword optimization scoring."})

    # 6. Meta Description Length Audit
    if meta_description and meta_description.strip():
        meta_len = len(meta_description.strip())
        if 120 <= meta_len <= 160:
            score += 10
            checklist.append({"id": "meta_len", "status": "pass", "label": f"Meta description length is ideal ({meta_len} characters)"})
        else:
            checklist.append({"id": "meta_len", "status": "warn", "label": f"Meta description length ({meta_len} chars) should ideally be between 120 and 160 characters."})
    else:
        checklist.append({"id": "meta_missing", "status": "warn", "label": "Meta description is missing. Add one to improve search snippet visibility."})

    # 7. Structural Diversity
    header_count = len(re.findall(r'^#+\s+', content, re.MULTILINE))
    if header_count >= 3:
        score += 10
        checklist.append({"id": "struct", "status": "pass", "label": f"Good use of structural headers ({header_count} headings found)"})
    else:
        checklist.append({"id": "struct", "status": "warn", "label": "Add more headings (H2/H3) to break up the copy and improve readability."})

    # 8. Python Linguistic Readability Audit
    if readability["fleschScore"] >= 50:
        checklist.append({"id": "readability", "status": "pass", "label": f"Linguistic Readability is healthy: Flesch Index {readability['fleschScore']}/100 ({readability['difficulty']})"})
    else:
        checklist.append({"id": "readability", "status": "warn", "label": f"Sentences are complex: Flesch Index {readability['fleschScore']}/100 ({readability['difficulty']}). Shorten sentences."})

    score = max(10, min(100, score))

    return {
        "score": score,
        "checklist": checklist,
        "metrics": {
            "wordCount": word_count,
            "readability": readability,
            "engine": "Python Linguistic Engine (Flesch-Kincaid & Regex)"
        }
    }
