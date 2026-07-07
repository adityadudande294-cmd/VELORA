import re
import os
import json
import hashlib
from typing import Dict, Any, List
from app.config.settings import settings

# Initialize Google Generative AI SDK
try:
    import google.generativeai as genai
    HAS_GEMINI = True
except ImportError:
    HAS_GEMINI = False

if HAS_GEMINI and settings.GEMINI_API_KEY:
    genai.configure(api_key=settings.GEMINI_API_KEY)
else:
    print("WARNING: Gemini API key is missing or google-generativeai is not installed. AI services running in OFFLINE mock mode.")

# --- IN-MEMORY RESPONSE CACHING ---
_ai_cache: Dict[str, Any] = {}

def get_cache_key(func_name: str, *args, **kwargs) -> str:
    # Generate unique MD5 signature of arguments
    serialized = json.dumps({"func": func_name, "args": args, "kwargs": kwargs}, sort_keys=True, default=str)
    return hashlib.md5(serialized.encode("utf-8")).hexdigest()

def get_cached_response(key: str) -> Any:
    return _ai_cache.get(key)

def set_cached_response(key: str, val: Any):
    # Prevent cache overflow memory leak
    if len(_ai_cache) > 250:
        _ai_cache.clear()
    _ai_cache[key] = val

# --- HELPER UTILITIES ---
def detect_category(topic: str) -> str:
    t = topic.lower()
    if any(w in t for w in ["temple", "architecture", "carv", "stone", "sculpture"]):
        return "Temple Architecture"
    if any(w in t for w in ["space", "star", "planet", "hole", "astronomy", "physics", "galaxy"]):
        return "Space & Science"
    if any(w in t for w in ["myst", "haunted", "ghost", "curse", "lake", "unsolved"]):
        return "Indian Mysteries"
    if any(w in t for w in ["legend", "myth", "god", "folklore", "mahabharata", "ramayana"]):
        return "Legends & Folklore"
    if any(w in t for w in ["civilization", "ancient", "rome", "egypt", "indus"]):
        return "Ancient Civilizations"
    if any(w in t for w in ["discover", "science", "invention", "physics", "biology"]):
        return "Scientific Discoveries"
    if any(w in t for w in ["dig", "exca", "ruin", "fossil", "archaeology"]):
        return "Archaeology"
    return "History"

def detect_image(category: str) -> str:
    if category == "Space & Science":
        return "/images/blackhole.png"
    if category == "Indian Mysteries":
        return "/images/roopkund.png"
    if category in ["Archaeology", "Ancient Civilizations"]:
        return "/images/dwarka.png"
    if category in ["Ancient Engineering", "Temple Architecture"]:
        return "/images/konark.png"
    if category in ["Unexplained Phenomena", "Nature"]:
        return "/images/jatinga.png"
    return "/images/bhangarh.png"

# --- MOCK FALLBACKS ---
def _generate_custom_story_mock(topic: str) -> Dict[str, Any]:
    clean_topic = re.sub(r'[?#]', '', topic.strip())
    slug_id = re.sub(r'[^a-z0-9]+', '-', clean_topic.lower())
    if not slug_id:
        slug_id = "custom-topic"
    category = detect_category(clean_topic)
    image = detect_image(category)
    return {
        "id": slug_id,
        "image": image,
        "title": {
            "en": f"The Mystery of {clean_topic}",
            "hi": f"{clean_topic} का अनसुलझा रहस्य",
            "mr": f"{clean_topic} चे गुढ रहस्य"
        },
        "subtitle": {
            "en": f"A documentary investigation into the archives of {clean_topic}",
            "hi": f"{clean_topic} के ऐतिहासिक एवं वैज्ञानिक तथ्यों का एक वृत्तचित्र अन्वेषण",
            "mr": f"{clean_topic} च्या ऐतिहासिक आणि वैज्ञानिक तथ्यांचा शोध"
        },
        "category": category,
        "duration": "10 mins",
        "difficulty": "Medium",
        "era": "Ancient Era",
        "factStatus": "Supported by Partial Evidence",
        "factLabel": "Active Research",
        "learningObjectives": [
            {
                "en": f"Explore the archaeological findings of {clean_topic}",
                "hi": f"{clean_topic} के पुरातात्विक निष्कर्षों की खोज करें",
                "mr": f"{clean_topic} च्या ऐतिहासिक अवशेषांचा अभ्यास करणे"
            }
        ],
        "knowledgeLevel": "Intermediate",
        "relatedTopics": [category, "Archaeology", "Ancient Myths"],
        "synopsis": {
            "en": f"An in-depth research review of {clean_topic}, examining physical ruins, historical archives, popular folklore, and what modern scientific tools say about its true origin.",
            "hi": f"{clean_topic} का एक गहन शोध विश्लेषण, जो भौतिक खंडहरों, ऐतिहासिक अभिलेखों, लोककथाओं और वैज्ञानिक दृष्टिकोण को प्रस्तुत करता है।",
            "mr": f"{clean_topic} चे सखोल संशोधन विश्लेषण, जे भौतिक अवशेष, जुन्या नोंदी, दंतकथा आणि आधुनिक विज्ञानाची मते मांडते."
        },
        "timeline": [
            {
                "year": "Ancient Origin",
                "title": { "en": "Initial Construction or Inception", "hi": "प्रारंभिक निर्माण या शुरुआत", "mr": "सुरुवात किंवा निर्मिती" },
                "details": {
                    "en": f"Initial mentions of {clean_topic} appear in local folklore and ancient oral traditions.",
                    "hi": f"स्थानीय लोककथाओं और प्राचीन मौखिक परंपराओं में {clean_topic} का पहली बार उल्लेख मिलता है।",
                    "mr": f"स्थानिक दंतकथा आणि प्राचीन मौखिक परंपरेमध्ये {clean_topic} चा पहिला उल्लेख आढळतो."
                }
            }
        ],
        "narrative": {
            "en": {
                "intro": [
                    f"Throughout history, the mystery of {clean_topic} has captivated both explorers and scholars.",
                    "Located in a region rich in cultural history, it presents an intriguing mix of physical ruins and legends."
                ],
                "background": [
                    f"Ancient chronicles describe {clean_topic} as a center of massive architectural significance."
                ],
                "evidence": [
                    "Archaeological discoveries confirm that trade was active during this period."
                ],
                "scientific": [
                    "Geologists analyzing the surrounding soil layers identified signs of severe drought or sudden seismic shifting."
                ],
                "historical": [
                    f"Historical documents show that the trade channels of {clean_topic} were vital to regional kingdoms."
                ],
                "legends": [
                    "Popular legends claim a powerful curse or divine intervention led to the sudden disappearance of its residents."
                ],
                "facts": [
                    "Radar walls mapping confirm a large-scale organized community existed here."
                ],
                "takeaways": [
                    "The decline of the site was likely driven by environmental changes and resource depletion rather than magic."
                ],
                "conclusion": [
                    f"Ultimately, {clean_topic} stands as a testament to ancient engineering and adaptability."
                ]
            }
        },
        "explanations": {
            "eli10": {
                "en": f"{clean_topic} is an ancient place that got buried or lost. Scientists went there and dug up old pots, proving that the place was real.",
                "hi": f"{clean_topic} एक बहुत पुराना स्थान है जो जमीन में खो गया था।",
                "mr": f"{clean_topic} हे खूप वर्षांपूर्वीचे एक जुने शहर आहे जे मातीखाली लपले होते."
            },
            "simple": {
                "en": f"{clean_topic} is an ancient historic site that was abandoned due to severe climate changes like drought.",
                "hi": f"{clean_topic} एक प्राचीन ऐतिहासिक स्थल है जो सूखे या भूकंप के कारण वीरान हो गया था।",
                "mr": f"{clean_topic} हे भूकंप किंवा दुष्काळामुळे ओसाड झालेले प्राचीन ठिकाण आहे."
            },
            "detailed": {
                "en": f"Archaeological excavations of {clean_topic} reveal custom masonry and residential layout planning.",
                "hi": f"उत्खनन से {clean_topic} के गृह नियोजन के प्रमाण मिले हैं।",
                "mr": f"उत्खननामध्ये मिळालेले अवशेष उत्कृष्ट नागरी नियोजनाची साक्ष देतात."
            },
            "academic": {
                "en": f"The architectural grid of {clean_topic} displays high mathematical precision in alignment with solar solstices.",
                "hi": f"इसकी रचना उन्नत खगोल विज्ञान को दर्शाती है।",
                "mr": f"वास्तूंची रचना खगोलशास्त्रातील प्रगती दर्शवते."
            },
            "revision": {
                "en": f"Key Points: {clean_topic}. Category: {category}. Abandonment caused by tectonic or weather changes.",
                "hi": f"मुख्य बिंदु: {clean_topic}। श्रेणी: {category}। पतन का कारण सूखा या भूकंप था।",
                "mr": f"महत्त्वाचे मुद्दे: {clean_topic}. वर्ग: {category}. ऱ्हासाचे कारण दुष्काळ."
            }
        },
        "qa": [
            {
                "q": ["evidence", "proof"],
                "a": {
                    "en": "Archaeological excavations recovered ancient stone tools and structured block walls.",
                    "hi": "खुदाई में पत्थर के औजार और दीवारें मिली हैं जो इसके इतिहास को साबित करती हैं।",
                    "mr": "उत्खननामध्ये मिळालेले दगडी खांब आणि भिंती या संस्कृतीचे अस्तित्व सिद्ध करतात."
                }
            }
        ],
        "references": [
            f"Journal of Archaeological Research on {clean_topic}, 2024.",
            "Local oral folklore and comparative historical chronicles."
        ]
    }

def _solve_story_question_mock(story: Dict[str, Any], question: str, lang: str) -> str:
    q_lower = question.lower()
    for pair in story.get("qa", []):
        for keyword in pair.get("q", []):
            if keyword in q_lower:
                return pair["a"].get(lang, pair["a"]["en"])
                
    if any(w in q_lower for w in ["curse", "ghost", "magic", "शाप", "भूत"]):
        if lang == "hi":
            return "दंतकथाएं शाप का उल्लेख करती हैं, लेकिन वैज्ञानिक शोध में इस दावे का कोई ठोस प्रमाण नहीं मिला है।"
        if lang == "mr":
            return "स्थानिक दंतकथांमध्ये शाप किंवा भुतांचे संदर्भ असतात, परंतु विज्ञानात या गोष्टींना आधार नाही."
        return "Legends speak of curses, but physical investigations suggest environmental causes. Science rules out magic."

    fact_label = story.get("factLabel", "Active Research")
    if lang == "hi":
        return f"वेलोरा पुरालेख के अनुसार, यह कहानी {fact_label} के अंतर्गत वर्गीकृत है।"
    if lang == "mr":
        return f"वेलोरा ज्ञानकोशानुसार, हा इतिहास '{fact_label}' या श्रेणीत येतो।"
    return f"According to the VELORA archives, this topic is classified under '{fact_label}'."

# --- DEDICATED GEMINI CORE IMPLEMENTATIONS ---
def generate_custom_story(topic: str) -> Dict[str, Any]:
    if not topic.strip():
        topic = "Unknown Enigma"
        
    cache_key = get_cache_key("generate_custom_story", topic)
    cached = get_cached_response(cache_key)
    if cached:
        return cached

    if not HAS_GEMINI or not settings.GEMINI_API_KEY:
        val = _generate_custom_story_mock(topic)
        set_cached_response(cache_key, val)
        return val

    prompt = f"""
    Generate a detailed cinematic documentary story about the topic '{topic}' conforming exactly to the following JSON structure:
    {{
        "id": "slug-id",
        "image": "/images/bhangarh.png",
        "title": {{ "en": "...", "hi": "...", "mr": "..." }},
        "subtitle": {{ "en": "...", "hi": "...", "mr": "..." }},
        "category": "...",
        "duration": "10 mins",
        "difficulty": "Medium",
        "era": "...",
        "factStatus": "...",
        "factLabel": "Historically Verified",
        "learningObjectives": [ {{ "en": "...", "hi": "...", "mr": "..." }} ],
        "knowledgeLevel": "Intermediate",
        "relatedTopics": [ "...", "..." ],
        "synopsis": {{ "en": "...", "hi": "...", "mr": "..." }},
        "timeline": [ 
            {{ 
                "year": "...", 
                "title": {{ "en": "...", "hi": "...", "mr": "..." }}, 
                "details": {{ "en": "...", "hi": "...", "mr": "..." }} 
            }} 
        ],
        "narrative": {{
            "en": {{
                "intro": [ "...", "..." ],
                "background": [ "..." ],
                "main": [ "..." ],
                "evidence": [ "..." ],
                "scientific": [ "..." ],
                "historical": [ "..." ],
                "legends": [ "..." ],
                "facts": [ "..." ],
                "takeaways": [ "..." ],
                "conclusion": [ "..." ]
            }},
            "hi": {{
                "intro": [ "...", "..." ],
                "background": [ "..." ],
                "main": [ "..." ],
                "evidence": [ "..." ],
                "scientific": [ "..." ],
                "historical": [ "..." ],
                "legends": [ "..." ],
                "facts": [ "..." ],
                "takeaways": [ "..." ],
                "conclusion": [ "..." ]
            }},
            "mr": {{
                "intro": [ "...", "..." ],
                "background": [ "..." ],
                "main": [ "..." ],
                "evidence": [ "..." ],
                "scientific": [ "..." ],
                "historical": [ "..." ],
                "legends": [ "..." ],
                "facts": [ "..." ],
                "takeaways": [ "..." ],
                "conclusion": [ "..." ]
            }}
        }},
        "explanations": {{
            "eli10": {{ "en": "...", "hi": "...", "mr": "..." }},
            "simple": {{ "en": "...", "hi": "...", "mr": "..." }},
            "detailed": {{ "en": "...", "hi": "...", "mr": "..." }},
            "academic": {{ "en": "...", "hi": "...", "mr": "..." }},
            "revision": {{ "en": "...", "hi": "...", "mr": "..." }}
        }},
        "qa": [ 
            {{ 
                "q": [ "keyword" ], 
                "a": {{ "en": "...", "hi": "...", "mr": "..." }} 
            }} 
        ],
        "references": [ "...", "..." ]
    }}
    Instructions:
    1. Output ONLY a valid JSON object. Do not wrap in markdown quotes.
    2. Fill in all translations (English, Hindi, Marathi) appropriately.
    3. Conform 100% to this schema structure.
    4. Categorize it as one of the following: "Indian Mysteries", "Space & Science", "Legends & Folklore", "Temple Architecture", "Ancient Civilizations", "Scientific Discoveries", "Archaeology", "History".
    5. Choose the image field from: "/images/blackhole.png", "/images/roopkund.png", "/images/dwarka.png", "/images/konark.png", "/images/jatinga.png", "/images/bhangarh.png" depending on what fits best.
    """

    try:
        model = genai.GenerativeModel('gemini-1.5-flash')
        response = model.generate_content(
            prompt,
            generation_config={"response_mime_type": "application/json"}
        )
        data = json.loads(response.text)
        slug_id = re.sub(r'[^a-z0-9]+', '-', topic.strip().lower())
        if not slug_id:
            slug_id = "custom-story"
        data["id"] = slug_id
        set_cached_response(cache_key, data)
        return data
    except Exception as e:
        print(f"Error generating custom story with Gemini: {e}. Falling back to mock generator.")
        val = _generate_custom_story_mock(topic)
        set_cached_response(cache_key, val)
        return val

def solve_story_question(story: Dict[str, Any], question: str, lang: str) -> str:
    cache_key = get_cache_key("solve_story_question", story.get("id"), question, lang)
    cached = get_cached_response(cache_key)
    if cached:
        return cached

    if not HAS_GEMINI or not settings.GEMINI_API_KEY:
        val = _solve_story_question_mock(story, question, lang)
        set_cached_response(cache_key, val)
        return val

    prompt = f"""
    You are the VELORA Oracle, an expert historian and educational assistant.
    You are answering a question about the story: {json.dumps(story)}.
    
    Question: "{question}"
    Language to respond in: {lang}
    
    Instructions:
    1. Answer the question using ONLY the facts and timeline records provided in this story.
    2. Keep your answer concise (2-4 sentences max).
    3. If the answer is not present, or if the information is speculative or historically unverified, you MUST respond exactly: "I could not verify this information."
    4. Never invent historical facts or extrapolate beyond the provided story details.
    """

    try:
        model = genai.GenerativeModel('gemini-1.5-flash')
        response = model.generate_content(prompt)
        text = response.text.strip()
        set_cached_response(cache_key, text)
        return text
    except Exception as e:
        print(f"Gemini Q&A call failed: {e}. Falling back to offline Q&A.")
        val = _solve_story_question_mock(story, question, lang)
        set_cached_response(cache_key, val)
        return val

def summarize_story(story: Dict[str, Any], lang: str) -> Dict[str, Any]:
    cache_key = get_cache_key("summarize_story", story.get("id"), lang)
    cached = get_cached_response(cache_key)
    if cached:
        return cached

    fallback_summary = {
        "30s": story.get("synopsis", {}).get(lang, story.get("synopsis", {}).get("en", "")),
        "2m": " ".join(story.get("narrative", {}).get(lang, story.get("narrative", {}).get("en", {})).get("intro", [])),
        "bullets": [obj.get(lang, obj.get("en", "")) for obj in story.get("learningObjectives", [])],
        "dates": [f"{e.get('year')}: {e.get('title', {}).get(lang, e.get('title', {}).get('en', ''))}" for e in story.get("timeline", [])],
        "people": ["Discoverers and historians mentioned in local archives."],
        "places": [story.get("title", {}).get(lang, story.get("title", {}).get("en", "")) + " Archaeological Site"]
    }

    if not HAS_GEMINI or not settings.GEMINI_API_KEY:
        set_cached_response(cache_key, fallback_summary)
        return fallback_summary

    prompt = f"""
    Summarize the following story: {json.dumps(story)}.
    Return ONLY a JSON object containing:
    - "30s": A concise 30-second summary in the language {lang}.
    - "2m": A detailed 2-minute summary in the language {lang}.
    - "bullets": A list of key bullet points in the language {lang}.
    - "dates": A list of key dates and events in the language {lang}.
    - "people": A list of key historical figures mentioned in the language {lang}.
    - "places": A list of key geographical sites or locations in the language {lang}.
    """

    try:
        model = genai.GenerativeModel('gemini-1.5-flash')
        response = model.generate_content(
            prompt,
            generation_config={"response_mime_type": "application/json"}
        )
        data = json.loads(response.text)
        set_cached_response(cache_key, data)
        return data
    except Exception as e:
        print(f"Gemini summary failed: {e}")
        set_cached_response(cache_key, fallback_summary)
        return fallback_summary

def explain_passage(text: str, mode: str, lang: str) -> str:
    cache_key = get_cache_key("explain_passage", text, mode, lang)
    cached = get_cached_response(cache_key)
    if cached:
        return cached

    fallback_text = f"Explanation in mode: {mode} ({lang}) of: {text[:60]}..."

    if not HAS_GEMINI or not settings.GEMINI_API_KEY:
        set_cached_response(cache_key, fallback_text)
        return fallback_text

    prompt = f"""
    Explain the following text: "{text}".
    
    The explanation style/complexity must target: "{mode}".
    Explanation modes guide:
    - eli10: Explain like I am 10 years old. Use simple analogies.
    - simple: Easy and direct explanation.
    - detailed: Technical context and physical evidence details.
    - academic: Scholarly terminology and analytical view.
    - revision: Core key takeaways in bullet points.
    
    Respond in the language: {lang}.
    """

    try:
        model = genai.GenerativeModel('gemini-1.5-flash')
        response = model.generate_content(prompt)
        res_text = response.text.strip()
        set_cached_response(cache_key, res_text)
        return res_text
    except Exception as e:
        print(f"Gemini explain failed: {e}")
        set_cached_response(cache_key, fallback_text)
        return fallback_text

def translate_passage(text: str, target_lang: str) -> str:
    cache_key = get_cache_key("translate_passage", text, target_lang)
    cached = get_cached_response(cache_key)
    if cached:
        return cached

    fallback_text = text

    if not HAS_GEMINI or not settings.GEMINI_API_KEY:
        set_cached_response(cache_key, fallback_text)
        return fallback_text

    prompt = f"""
    Translate the following text into the target language: "{target_lang}".
    Only respond with the translated text. Keep the layout identical.
    Text: "{text}"
    """

    try:
        model = genai.GenerativeModel('gemini-1.5-flash')
        response = model.generate_content(prompt)
        res_text = response.text.strip()
        set_cached_response(cache_key, res_text)
        return res_text
    except Exception as e:
        print(f"Gemini translation failed: {e}")
        set_cached_response(cache_key, fallback_text)
        return fallback_text

def recommend_next_stories(
    current_story: Dict[str, Any],
    category: str,
    history: List[str],
    bookmarks: Dict[str, Any],
    interests: List[str],
    db_stories: List[Dict[str, Any]]
) -> List[Dict[str, Any]]:
    current_id = current_story.get("id")
    available_stories = [s for s in db_stories if s.get("id") != current_id]

    if not available_stories:
        return []

    cache_key = get_cache_key("recommend_next_stories", current_id, category, history, bookmarks, interests)
    cached = get_cached_response(cache_key)
    if cached:
        return cached

    stories_map = {s["id"]: s for s in available_stories}
    stories_info = [{"id": s["id"], "title": s["title"]["en"], "category": s["category"]} for s in available_stories]

    if not HAS_GEMINI or not settings.GEMINI_API_KEY:
        fallback_recs = sorted(available_stories, key=lambda s: s.get("category") == category, reverse=True)[:2]
        set_cached_response(cache_key, fallback_recs)
        return fallback_recs

    prompt = f"""
    You are an educational personalization algorithm.
    Analyze the reader's logs:
    - Current Story Title: "{current_story.get('title', {}).get('en', '')}"
    - Current Story Category: "{category}"
    - Reading History (Ids): {history}
    - Bookmarks & Notes context: {json.dumps(bookmarks)}
    - Stated User Interests: {interests}
    
    Choose the top 2 best next read recommendations from this available catalog:
    {json.dumps(stories_info)}
    
    Return ONLY a JSON array containing the selected story IDs. Example: ["id1", "id2"].
    """

    try:
        model = genai.GenerativeModel('gemini-1.5-flash')
        response = model.generate_content(
            prompt,
            generation_config={"response_mime_type": "application/json"}
        )
        selected_ids = json.loads(response.text)
        recs = [stories_map[sid] for sid in selected_ids if sid in stories_map]
        if not recs:
            recs = available_stories[:2]
        set_cached_response(cache_key, recs)
        return recs
    except Exception as e:
        print(f"Gemini recommendations failed: {e}")
        fallback_recs = available_stories[:2]
        set_cached_response(cache_key, fallback_recs)
        return fallback_recs

def generate_quiz(story: Dict[str, Any], lang: str) -> List[Dict[str, Any]]:
    cache_key = get_cache_key("generate_quiz", story.get("id"), lang)
    cached = get_cached_response(cache_key)
    if cached:
        return cached

    fallback_quiz = [
        {
            "question": "What is the primary topic discussed in the text?",
            "options": ["Archaeological discoveries", "Technological systems", "Weather shifts", "Folklore"],
            "answer": "Archaeological discoveries",
            "explanation": "The story outlines physical ruins mapped by geologists."
        }
    ]

    if not HAS_GEMINI or not settings.GEMINI_API_KEY:
        set_cached_response(cache_key, fallback_quiz)
        return fallback_quiz

    prompt = f"""
    Generate 3 multiple choice questions for the following story: {json.dumps(story)}.
    Return ONLY a JSON array of questions, where each question has the structure:
    {{
        "question": "...",
        "options": ["...", "...", "...", "..."],
        "answer": "...", // must exactly match one of the options
        "explanation": "..." // why it is correct
    }}
    Instructions:
    1. Respond ONLY with the JSON array.
    2. Generate all text (questions, options, answers, explanations) in the language: {lang}.
    """

    try:
        model = genai.GenerativeModel('gemini-1.5-flash')
        response = model.generate_content(
            prompt,
            generation_config={"response_mime_type": "application/json"}
        )
        data = json.loads(response.text)
        set_cached_response(cache_key, data)
        return data
    except Exception as e:
        print(f"Gemini quiz failed: {e}")
        set_cached_response(cache_key, fallback_quiz)
        return fallback_quiz
