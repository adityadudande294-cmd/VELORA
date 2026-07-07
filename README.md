# VELORA — Immersive Cinematic Storytelling Platform

**VELORA** is an enterprise-ready, cinematic, AI-powered storytelling platform designed to make reading feel like watching a premium documentary. By blending immersive dark UI, dynamic Web Audio ambient music, Speech Synthesis narrator voices, real Google Gemini API integrations, and secure Admin CMS dashboard interfaces, VELORA delivers a premium educational and storytelling portal.

> **Every Story Has a Truth Waiting to Be Discovered.**

---

## 🎬 Core Features

- **Cinematic Application Portal**: Ambient portal introduction loading Web Audio audio oscillators, screen loaders, and prefers-reduced-motion accessibility skip overrides.
- **Narrator Audio**: Binds HTML5 Speech Synthesis text-to-speech playing narration sentences sequentially.
- **Atmospheric Background Music**: Local Web Audio context oscillators simulating cave winds, breeze sweeps, and parchment flips.
- **Structured Explanations**: Select cognitive explanation tiers (ELI10, simple, academic, or bullet point revision summary).
- **Google Gemini Integrations**: Conversational chat, automated translations (English, Hindi, Marathi), and personalized story recommendations based on user profiles.
- **Content Management (CMS)**: Secure role-based admin panel (`/admin`) for editing narratives, duplicates, category order, user suspension, and media uploads.

---

## 🏛️ Project Architecture

```
VELORA/
├── backend/                       # FASTAPI BACKEND (Python 3.11)
│   ├── app/
│   │   ├── api/                   # Router endpoints (auth, stories, admin, ai, bookmarks)
│   │   ├── config/                # Environment settings & Pydantic Config schemas
│   │   ├── database/              # MongoDB client pooling & index configs, Mock Fallbacks
│   │   ├── schemas/               # Request/Response schemas (Pydantic validations)
│   │   └── services/              # Business logic services (Gemini AI SDK prompts, cache)
│   ├── tests/                     # Synchronous endpoint API tests using python unit tests
│   ├── requirements.txt           # Python dependency lists
│   └── run.py                     # Backend bootloader script
├── public/                        # STATIC ASSETS
│   ├── images/                    # Cinematic cover banners
│   └── uploads/                   # CMS media files directory
└── src/                           # NEXT.JS FRONTEND (React 19 / TS)
    ├── app/
    │   ├── admin/                 # Admin CMS page dashboard
    │   ├── globals.css            # Ambient CSS variables
    │   ├── layout.tsx             # Root template binding SEO OpenGraph/Twitter Cards
    │   ├── page.tsx               # Main SPA view switcher
    │   └── sitemap.ts             # Dynamic XML sitemap generator
    ├── components/                # Presentation split components
    │   ├── dashboard/             # Dashboard menu modules (Home, Search, saved, oracle)
    │   ├── reader/                # StoryReader stages (Cover, reading, complete)
    │   └── intro/                 # Intro cinematic gates & Three.js canvas loader
    ├── contexts/                  # Centralized state contexts (Auth, Bookmarks, Settings)
    ├── hooks/                     # Custom React hooks (AmbientAudio, scroll, SpeechNarration)
    └── services/                  # Frontend API connectors (adminService, aiService, api)
```

---

## ⚙️ Environment Variables

Create a `.env` file in the `backend/` directory based on the template below:
```env
# MongoDB Credentials
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/
DATABASE_NAME=velora_db

# Security & Sessions
JWT_SECRET=velora-super-secret-key-cinema-documentary-story-engine

# Google Gemini API key
GEMINI_API_KEY=your_google_gemini_api_key_here
```

---

## 🛠️ Local Installation & Running

### 1. Launch FastAPI Backend
```bash
cd backend
# Create virtual env and install packages
python -m venv venv
source venv/Scripts/activate # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Launch FastAPI app (default: http://localhost:8000)
python run.py
```

### 2. Launch Next.js Frontend
```bash
npm install
# Run compiler checks
npm run build
# Start dev server
npm run dev
```

---

## 🐳 Docker Deployment

To spin up the complete containerized stack (Next.js, FastAPI, and local persistent MongoDB) automatically:
```bash
# Build and orchestrate all container services in background
docker-compose up --build -d

# Check live logs of running containers
docker-compose logs -f
```

---

## 🧪 Testing Suites

### Python Backend Unit Tests
Runs the native python `unittest` suite checking endpoint health, QA logic, and error boundaries:
```bash
cd backend
python -m unittest discover tests/
```

### Frontend TypeScript Smoke Tests
```bash
npm install
npm test # Executes Jest/TS smoke imports validation
```

---

## 🎯 Version 2.0 Product Roadmap

- **Offline Sync Engine**: Service Worker caching storing complete text-to-speech audios and story pages in local IndexedDB.
- **Multilingual Narration**: Direct integration of ElevenLabs or Google Cloud TTS for native Hindi and Marathi narrators.
- **Advanced Analytics**: Real-time admin monitoring of user sessions using socket streams.
- **Visual Timelines**: Interactive Three.js timeline node graphs mapping historic eras.
