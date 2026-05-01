You are an expert full-stack developer, UI/UX designer, and AI/ML engineer.
Build a complete, fully functional mental wellness web application called
"ManoMitra" — a compassionate AI-powered emotional support companion.

Build the ENTIRE project from scratch with ALL pages, features, animations,
and integrations listed below. Make it production-ready, beautiful, and
fully working.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TECH STACK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Frontend:

- React.js with Next.js 14 (App Router)
- Tailwind CSS for styling
- Framer Motion for animations
- Recharts for emotion data visualization
- Lottie React for animated illustrations
- React Hook Form for forms
- Zustand for state management

Backend:

- Node.js with Express.js
- Python FastAPI (for AI/ML endpoints)
- Firebase Firestore (database)
- Firebase Auth (authentication)

AI/ML:

- HuggingFace Inference API (text emotion)
- face-api.js (facial recognition, client-side)
- Web Speech API (voice recording)
- OpenAI GPT-4 API (ManoBot chatbot)
- Gravity AI (custom emotion fusion model endpoint)

Deployment Ready:

- Environment variables for all API keys
- .env.example file included
- README with setup instructions

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DESIGN SYSTEM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Colors:

- Primary: #6C63FF (Soft Purple)
- Secondary: #48CAE4 (Sky Blue)
- Accent: #95D5B2 (Sage Green)
- Warning: #FFB347 (Soft Orange)
- Dark BG: #0D1117
- Light BG: #F8F9FA
- Card BG Dark: #161B22
- Card BG Light: #FFFFFF

Emotion Colors:

- Happy: #FFD700
- Sad: #6495ED
- Angry: #FF6B6B
- Anxious: #FFA07A
- Calm: #98FB98
- Neutral: #C0C0C0

Typography:

- Headings: Poppins Bold
- Body: Nunito Regular
- Quotes: Playfair Display Italic
- Labels: Inter Medium
- Import all from Google Fonts

Animation Rules:

- All transitions: 300-500ms ease-in-out
- Breathing animations for calm UI elements
- Soft fade page transitions
- Gentle particle background on landing
- No harsh cuts or rapid movements
- Micro-interactions on all buttons

Dark/Light Mode:

- Full dark mode support via Tailwind dark class
- Toggle in sidebar
- System preference detection on load
- Smooth transition between modes

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FOLDER STRUCTURE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

manomitra/
├── app/
│ ├── page.tsx (Landing)
│ ├── dashboard/page.tsx (Dashboard)
│ ├── profile/page.tsx (Profile Setup)
│ ├── welcome/page.tsx (Welcome + Breathing)
│ ├── text-emotion/page.tsx (Text Analysis)
│ ├── face-emotion/page.tsx (Facial Detection)
│ ├── voice-emotion/page.tsx (Voice Analysis)
│ ├── mood-support/page.tsx (Support Center)
│ ├── fit-zone/
│ │ ├── page.tsx (Fit Zone Hub)
│ │ ├── music/page.tsx (Music by Mood)
│ │ ├── yoga/page.tsx (Yoga by Mood)
│ │ ├── mental/page.tsx (Mental Activities)
│ │ ├── food/page.tsx (Food by Mood)
│ │ └── sleep/page.tsx (Sleep Analysis)
│ ├── feedback/page.tsx (Thank You + Feedback)
│ └── layout.tsx (Root layout with sidebar)
│
├── components/
│ ├── layout/
│ │ ├── Sidebar.tsx
│ │ ├── Header.tsx
│ │ └── PageWrapper.tsx
│ ├── ui/
│ │ ├── Button.tsx
│ │ ├── Card.tsx
│ │ ├── MoodSlider.tsx
│ │ ├── EmotionBadge.tsx
│ │ ├── ProgressBar.tsx
│ │ └── AnimatedBackground.tsx
│ ├── emotion/
│ │ ├── TextAnalyzer.tsx
│ │ ├── FaceScanner.tsx
│ │ ├── VoiceRecorder.tsx
│ │ └── EmotionFusion.tsx
│ ├── chatbot/
│ │ └── ManoBot.tsx
│ └── charts/
│ ├── EmotionChart.tsx
│ ├── MoodTimeline.tsx
│ └── SleepChart.tsx
│
├── lib/
│ ├── firebase.ts
│ ├── huggingface.ts
│ ├── openai.ts
│ ├── gravityai.ts
│ ├── emotionFusion.ts
│ └── recommendations.ts
│
├── store/
│ └── useStore.ts (Zustand global state)
│
├── data/
│ ├── musicData.ts
│ ├── yogaData.ts
│ ├── foodData.ts
│ ├── activitiesData.ts
│ └── sleepData.ts
│
├── hooks/
│ ├── useEmotion.ts
│ ├── useSpeech.ts
│ └── useCamera.ts
│
└── types/
└── index.ts

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PAGE 0 — LANDING PAGE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Build a stunning, animated landing page with:

LAYOUT:

- Full viewport height hero section
- Animated particle background (floating orbs/stars)
- Subtle gradient: deep navy (#0D1117) to purple (#1a0533)
- Glassmorphism card for about section

CONTENT:

- Logo: Moon icon + "ManoMitra" in Poppins Bold gradient text
- Tagline: "Your Mind Deserves a Friend" (Playfair Display Italic)
- About card with backdrop blur containing:
  "ManoMitra is a safe space where your emotions are heard,
  understood, and supported. We use AI to understand how you
  feel — through your words, your face, and your voice —
  and guide you toward calm, balance, and joy.
  No judgment. No pressure. Just support."
- Three trust badges below about card:
  [✨ 10,000+ Minds Supported] [🔒 Private & Secure] [🧠 AI-Powered]

RELAX BUTTON:

- Large centered CTA button with text "🌿 RELAX"
- Gradient background: purple to blue
- Soft pulsing glow animation (CSS keyframes)
- On hover: scale up + ripple effect
- On click:
  1. Breathing expansion animation (circle grows to fill screen)
  2. Smooth fade transition to /dashboard
  3. Play subtle chime sound (Web Audio API)

ANIMATIONS:

- Particles float slowly (requestAnimationFrame or tsParticles)
- Text fades in sequentially (Framer Motion staggerChildren)
- Continuous breathing pulse on RELAX button
- Scroll-triggered animations if page scrolls

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SIDEBAR (Persistent across all inner pages)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Build a responsive collapsible sidebar with:

STRUCTURE:

- Top: User avatar (initials-based) + name + emotion badge
- Streak counter: "🔥 7 day streak"
- Navigation links with icons:
  🏠 Dashboard
  👤 Profile
  💬 Text Emotion
  😊 Face Scan
  🎙️ Voice Emotion
  💙 Mood Support
  🎯 Fit Zone (expandable submenu)
  🎵 Music
  🧘 Yoga
  🧠 Mental Health
  🥗 Food
  😴 Sleep
  📝 Feedback
- Bottom: Dark mode toggle + Settings icon

BEHAVIOR:

- Collapsible on mobile (hamburger menu)
- Active route highlighted with gradient pill
- Hover states with soft glow
- Smooth expand/collapse animation
- Fit Zone submenu expands with smooth accordion

STYLING:

- Dark: #161B22 background with #6C63FF accents
- Glassmorphism effect on sidebar card
- Custom scrollbar styled to match theme

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PAGE 1 — DASHBOARD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Build the main dashboard hub with:

HEADER SECTION:

- Dynamic greeting based on time of day:
  Before 12: "🌅 Good Morning, [Name]"
  12-5pm: "☀️ Good Afternoon, [Name]"
  After 5: "🌙 Good Evening, [Name]"
- Sub-text: "How are you feeling today?"

STAT CARDS ROW (3 cards):

- Current Mood Card: Shows latest detected emotion + emoji
- Streak Card: "🔥 X Day Streak" with fire animation
- Activities Today: "X / 3 completed" with progress ring

QUICK ACTIONS ROW:

- [🧠 Check Mood] → /text-emotion
- [🧘 Start Yoga] → /fit-zone/yoga
- [🎵 Play Music] → /fit-zone/music
- [😴 Sleep Plan] → /fit-zone/sleep

EMOTION TIMELINE:

- Horizontal scrollable chart showing mood over past 7 days
- Emoji markers on line chart (Recharts)
- Color-coded by emotion

AI RECOMMENDATION CARD:

- Dynamic based on current emotion from Zustand store
- "Based on your mood today..." intro
- Specific suggestion with link to relevant Fit Zone page
- Updates when new emotion is detected

MOOD HISTORY GRAPH:

- Bar chart or area chart — last 7 days mood scores
- Color gradient from sad (blue) to happy (gold)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PAGE 2 — PROFILE SETUP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Build a multi-step profile form with:

STEP 1 — Basic Info:

- Name input (required, saves to Zustand + Firebase)
- Age input (number, 13-99)
- Gender select: Male / Female / Non-binary / Prefer not to say
- Avatar color picker (generates initial-based avatar)

STEP 2 — Mental Health Context:

- "How do you usually feel?" radio options:
  Mostly Calm / Often Anxious / Frequently Sad / It varies
- "What brings you here?" checkboxes (multi-select):
  Stress management / Better sleep / Emotional support /
  General wellness / Just exploring

STEP 3 — Preferences:

- Preferred music genre (dropdown)
- Dietary preference: Vegetarian / Non-veg / Vegan
- Preferred activity intensity: Light / Moderate / Intense
- Notification preference toggle

STEP 4 — Completion:

- Animated completion screen
- "Welcome to ManoMitra, [Name]! 🌸"
- Progress bar showing completion
- [Go to Dashboard] button

FORM BEHAVIOR:

- React Hook Form validation
- Smooth step transitions (Framer Motion slide)
- Progress indicator at top (Step 1 of 4)
- Back button on each step
- Save to Firebase on final submit
- Load saved data if returning user

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PAGE 3 — WELCOME & BREATHING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Build a calming entry page with:

PERSONALIZED GREETING:

- "Welcome back, [Name] 🌸"
- Rotating calming quotes (array of 10+ quotes)
- "You've made it here. That itself takes courage."

BREATHING EXERCISE COMPONENT:

- Animated circle that expands/contracts using CSS keyframes
- Three phases with smooth transitions:
  Inhale (4 seconds) → circle expands, color: soft blue
  Hold (4 seconds) → circle pulses, color: purple
  Exhale (6 seconds) → circle shrinks, color: sage green
- Phase label updates: "Breathe In..." / "Hold..." / "Release..."
- Cycle counter: "Cycle 1 of 3"
- Timer display inside circle

BACKGROUND MUSIC:

- Toggle button for soft ambient sound
- Use Web Audio API to generate binaural tone
- OR embed YouTube iframe (muted autoplay)

NAVIGATION:

- [Skip] button (top right, subtle)
- [I'm Ready →] button appears after 1 breathing cycle
- Both navigate to /text-emotion

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PAGE 4 — TEXT EMOTION MODULE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Build complete text emotion analysis with:

INPUT SECTION:

- Large textarea with animated placeholder cycling through:
  "How are you feeling right now?"
  "What happened today?"
  "What's on your mind?"
  "You can say anything here..."
- Word/character counter (max 500 words)
- Soft typing animation feel

ANALYSIS BUTTON:

- "🔍 Analyze My Emotions" with loading state
- Shimmer loading animation while API processes

HUGGING FACE INTEGRATION:

- Call HuggingFace Inference API:
  Model: j-hartmann/emotion-english-distilroberta-base
- Parse response for emotion labels + scores
- Handle API errors gracefully with fallback

GRAVITY AI INTEGRATION:

- Send same text to Gravity AI custom model endpoint
- Gravity AI provides enhanced contextual emotion analysis
- Merge HuggingFace scores with Gravity AI scores
- Gravity AI endpoint call in lib/gravityai.ts:
  POST to Gravity AI model URL
  Headers: Authorization Bearer token
  Body: { text: userInput, context: "mental_wellness" }
- Gravity AI provides: emotion_intensity, cultural_context,
  wellbeing_score, crisis_indicators, recommendation_tags

RESULTS DISPLAY:

- Animated reveal of dominant emotion with large emoji
- Emotion breakdown horizontal bar chart (Recharts):
  Joy / Sadness / Anger / Fear / Surprise / Disgust / Anxiety
- Each bar animates in sequentially
- Color coded per emotion
- Confidence percentage on each bar
- Gravity AI Wellbeing Score: circular gauge (0-100)

EMOTION FUSION:

- Save text emotion scores to Zustand store
- Combine with face + voice when available
- Show "Emotion Profile Updated" toast notification

HISTORY:

- Save each analysis with timestamp to Firebase
- "View Past Entries" accordion below results

CTA:

- "💡 Based on your emotions → See Recommendations"
- Routes to /mood-support with emotion pre-loaded

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PAGE 5 — FACIAL EMOTION RECOGNITION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Build client-side facial emotion detection:

SETUP:

- Load face-api.js models from /public/models/:
  tiny_face_detector_model
  face_expression_model
- Load models on component mount
- Show loading skeleton while models initialize

CAMERA INTERFACE:

- Video element for live webcam feed
- Canvas overlay for face detection box
- Real-time bounding box drawn around detected face
- Emotion label shown inside bounding box overlay
- Scan line animation while detecting

CONTROLS:

- [📷 Start Camera] — requests getUserMedia permission
- [📸 Capture & Analyze] — captures frame, runs detection
- [🔁 Try Again] — clears result
- [📷 Stop Camera] — kills stream

REAL-TIME DETECTION:

- Run detection every 500ms using setInterval
- Show live emotion bars updating in real-time
- Dominant emotion badge updates live

RESULTS DISPLAY:

- Captured screenshot thumbnail
- Dominant emotion: large emoji + label + percentage
- Emotion breakdown bars (same style as text module)
- Animation: results slide up from bottom

GRAVITY AI INTEGRATION:

- Capture base64 image from canvas
- Send to Gravity AI vision endpoint:
  POST to Gravity AI image emotion endpoint
  Body: { image: base64string, modality: "face" }
- Gravity AI returns: micro_expressions analysis,
  stress_level, fatigue_score, authenticity_score
  (detects if smile is genuine vs forced)
- Display Gravity AI Stress Level indicator
- Display Fatigue Score with sleep recommendation trigger

FALLBACK:

- If camera denied or unavailable:
  Show emoji selection grid: 😊😔😠😰😲😐
  User manually selects their current state
  Proceed with manual selection as face emotion

PRIVACY:

- Prominent notice: "🔒 No video recorded or stored"
- "All processing happens on your device"
- Camera stream destroyed after analysis

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PAGE 6 — VOICE EMOTION RECOGNITION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Build voice recording and emotion analysis:

INSTRUCTIONS:

- "Say anything for 10 seconds. How was your day?
  Count to 10. Read a sentence. Whatever feels natural."

RECORDING INTERFACE:

- Large microphone button (animated pulse when recording)
- Real-time audio waveform visualization (Web Audio API AnalyserNode)
- Waveform: animated bars that respond to actual audio input
- Recording timer countdown: 10 seconds
- Color shift during recording: neutral → red glow

CONTROLS:

- [🔴 Start Recording] → [⏹️ Stop] → [🔁 Retry] → [✅ Analyze]
- Auto-stop at 10 seconds
- Manual stop available

WEB SPEECH API:

- Transcribe speech to text simultaneously
- Show live transcription below waveform
- Use transcription as bonus text emotion input

AUDIO ANALYSIS:

- Compute basic audio features client-side:
  Average pitch (fundamental frequency via FFT)
  Speech rate (words per second from transcription)
  Volume/Energy level (RMS amplitude)
  Pause frequency (silence detection)
  Pitch variation (standard deviation)

GRAVITY AI VOICE INTEGRATION:

- Send audio features + transcription to Gravity AI:
  POST to Gravity AI voice emotion endpoint
  Body: {
  features: { pitch, energy, rate, pauses, variation },
  transcription: "user speech text",
  duration: 10,
  modality: "voice"
  }
- Gravity AI returns:
  emotional_tone: "melancholic" | "anxious" | "calm" etc
  energy_level: 0-100
  stress_score: 0-100
  vocal_patterns: { rushed, monotone, trembling, steady }
  confidence: 0-1
  mental_health_flags: [] (e.g., ["low_energy", "flat_affect"])

RESULTS DISPLAY:

- Detected tone label + confidence
- Energy level meter (horizontal gauge)
- Stress score visualization
- Vocal pattern indicators (tags/chips)
- Gravity AI mental health flags (shown gently, non-alarming)
- Transcription card (what was heard)

EMOTION SAVE:

- Save voice emotion to Zustand store
- Trigger emotion fusion calculation
- Update dashboard emotion timeline

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EMOTION FUSION ENGINE (lib/emotionFusion.ts)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Build the core fusion algorithm:

WEIGHTING SYSTEM:

- Text emotion score: 40% weight
- Face emotion score: 35% weight
- Voice emotion score: 25% weight
- If any modality missing: redistribute weights proportionally

GRAVITY AI FUSION:

- After individual analyses, call Gravity AI fusion endpoint:
  POST to Gravity AI multimodal fusion endpoint
  Body: {
  text_emotions: { joy, sadness, anger, fear, anxiety, calm },
  face_emotions: { happy, sad, angry, fearful, neutral },
  voice_features: { tone, energy, stress },
  gravity_text_analysis: {...},
  gravity_face_analysis: {...},
  gravity_voice_analysis: {...},
  user_context: { age, gender, history_pattern }
  }
- Gravity AI returns unified emotion profile:
  dominant_emotion: string
  emotion_intensity: 0-100
  wellbeing_index: 0-100
  personalized_recommendations: string[]
  priority_interventions: string[]
  mood_trajectory: "improving" | "declining" | "stable"
  cultural_wellness_suggestions: string[] (India-specific)

OUTPUT:

- Unified emotion object saved to Zustand
- Saved to Firebase with timestamp
- Triggers recommendation engine
- Updates dashboard in real-time

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PAGE 7 — MOOD SUPPORT CENTER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Build three-section support hub:

SECTION A — MOOD SLIDER:

- Horizontal slider input (1-10)
- Each value shows different emoji + label:
  1-2: 😭 "Very Distressed" (red)
  3-4: 😔 "Low / Sad" (orange)
  5-6: 😐 "Okay, Getting By" (yellow)
  7-8: 🙂 "Feeling Good" (light green)
  9-10: 😊 "Excellent!" (green)
- Slider thumb animates to emoji for current value
- Background gradient shifts with slider value
- Combines with AI emotion for fuller picture

SECTION B — SMART SUGGESTIONS:

- Read fused emotion from Zustand store
- Display 5-6 personalized suggestions as cards:
  Each card has: icon + title + brief description + action button
- Suggestion categories:
  Music → links to /fit-zone/music
  Yoga → links to /fit-zone/yoga
  Food → links to /fit-zone/food
  Activity → links to /fit-zone/mental
  Sleep → links to /fit-zone/sleep
  Breathing → inline breathing exercise
- Cards animate in with stagger effect
- User can save suggestions to favorites
- Gravity AI personalized_recommendations displayed as
  highlighted "AI Recommended" tagged cards

SECTION C — MANOBOT CHATBOT:

- Chat interface styled like a friendly messenger app
- Bot avatar: glowing purple orb with face
- Initial message based on current emotion:
  "Hey [Name], I noticed you're feeling [emotion] today.
  Would you like to talk about it, or should I just
  suggest some things to help?"
- Quick reply buttons for fast interaction:
  [Talk about it] [Suggest help] [Just browsing]

OPENAI GPT-4 INTEGRATION:

- System prompt:
  "You are ManoBot, a compassionate, non-clinical mental wellness
  companion. You are warm, empathetic, and supportive. You never
  diagnose. You always validate feelings first before suggesting.
  You gently recommend professional help when appropriate.
  Current user emotion context: [emotion data from store].
  User profile: [name, age, preferences].
  Keep responses concise (2-4 sentences), warm, and actionable.
  If crisis keywords detected, immediately provide helpline."
- Stream GPT responses (typewriter effect)
- Conversation history maintained in component state
- Max 20 messages before suggesting professional help

GRAVITY AI CHATBOT ENHANCEMENT:

- Send conversation context to Gravity AI:
  POST to Gravity AI conversational context endpoint
  Body: { messages: [], emotion_context: {}, user_profile: {} }
- Gravity AI returns: conversation_insights, escalation_risk,
  suggested_topics, cultural_relevant_responses
- Use Gravity AI escalation_risk to trigger crisis resources
- Use cultural_relevant_responses to make bot more India-aware
  (references to chai, family, festivals, cultural stressors)

CRISIS DETECTION:

- Keywords: "die", "end it", "suicide", "kill myself",
  "hopeless", "no point", "want to disappear"
- On detection:
  Stop normal response immediately
  Show red-bordered crisis card:
  "I hear you. You're not alone right now.
  Please reach out immediately:
  📞 iCall: 9152987821
  📞 Vandrevala: 1860-2662-345
  📞 AASRA: 9820466627
  [💬 Chat with a counselor]"
  Log event (anonymized) to Firebase
  Do NOT continue normal conversation flow

CHAT FEATURES:

- Message timestamps
- Typing indicator (animated dots)
- Copy message option
- "This helped me" reaction on bot messages
- Conversation export to PDF option

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PAGE 8 — FIT ZONE HUB
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Build the Fit Zone landing with:

HEADER:

- Current mood badge pulled from Zustand
- "Best for you right now:" with top 2 recommendations starred
- Gravity AI mood_trajectory indicator:
  "📈 Your mood is improving today"
  "📉 You seem to be having a tough time — extra support ready"

ZONE CARDS GRID (2x3 or 3x2):

- Each card: full color gradient, icon, title, short description
- Hover: card lifts + glow effect
- "AI Recommended" badge on top suggestions (Gravity AI data)
- Activity count badge: "23 activities inside"
- Cards:
  🎵 Music by Mood (purple)
  🧘 Yoga by Mood (green)
  🧠 Mental Health (blue)
  🥗 Food by Mood (orange)
  😴 Sleep Cycle (dark blue)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PAGE 8A — MUSIC BY MOOD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Build complete music recommendation page:

MOOD SELECTOR:

- Horizontal scrollable mood pills:
  Happy / Sad / Anxious / Calm / Energetic / Focused /
  Angry / Romantic / Tired / Hopeful
- Active mood highlighted (from AI or user override)

MUSIC CATEGORIES:

- Indian Classical (Ragas mapped to moods)
- Lo-fi / Chill
- Bollywood (by emotion)
- Nature Sounds
- Binaural Beats
- Instrumental / Western Classical

PLAYLIST CARDS:

- Build data/musicData.ts with 30+ playlists:
  Each has: id, title, genre, mood[], description,
  duration, coverColor, embedUrl (YouTube/Spotify)
- Card shows: gradient cover, title, mood tags, duration
- Filter playlists by selected mood

RAGA-MOOD DATABASE (Indian Classical):
Map these ragas in musicData.ts:

- Sad → Raag Bhairavi, Raag Yaman
- Anxious → Raag Bhupali (calming)
- Happy → Raag Khamaj, Raag Tilang
- Morning energy → Raag Bhairav
- Evening calm → Raag Puriya Dhanashree
- Focus → Raag Malkauns
- Romance → Raag Kaafi

MUSIC PLAYER COMPONENT:

- Fixed bottom player when song selected
- Controls: Previous / Play-Pause / Next / Volume
- Progress bar with seek
- Song info: title + mood tag
- Ambient background color shifts to match song mood

GRAVITY AI MUSIC ENHANCEMENT:

- Call Gravity AI music recommendation endpoint:
  POST body: { emotion_profile: {}, user_history: [], preferences: {} }
- Gravity AI returns: ai_playlist (ordered list),
  tempo_recommendation (BPM range),
  healing_frequency (if applicable),
  transition_plan: ["start with X for validation,
  end with Y for mood lift"]
- Show Gravity AI "Healing Journey" playlist as special card
- Display tempo guidance: "Starting with slower tempo
  to meet your emotion, gradually brightening"

MUSIC THERAPY INFO:

- Expandable info card: "Why music helps"
- Raga details: time of day, season, emotional effect
- Research backing (1-2 sentences)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PAGE 8B — YOGA BY MOOD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Build yoga recommendation with guided sessions:

MOOD-BASED YOGA SEQUENCES:
Build data/yogaData.ts with sequences for each mood:
Each sequence has:

- mood: string[]
- duration: number (minutes)
- intensity: "light" | "moderate" | "strong"
- poses: Pose[]
  Each Pose: {
  name: string (English + Sanskrit)
  duration: number (seconds)
  description: string
  benefit: string
  breathingCue: string
  imageUrl: string (use placeholder or Unsplash)
  modifications: string
  }

SEQUENCES TO BUILD:
Anxious → Grounding sequence:
Child's Pose (Balasana) 2min
Legs Up Wall (Viparita Karani) 3min
Seated Forward Fold (Paschimottanasana) 2min
Corpse Pose (Savasana) 5min
Pranayama: 4-7-8 breathing throughout

Sad → Heart Opening:
Mountain Pose (Tadasana) 1min
Camel Pose (Ustrasana) 2min
Bridge Pose (Setu Bandha) 2min
Fish Pose (Matsyasana) 2min
Happy Baby (Ananda Balasana) 2min
Pranayama: Kapalabhati (energizing)

Angry → Cooling sequence:
Wide-Legged Forward Fold (Prasarita) 2min
Seated Twist (Ardha Matsyendrasana) 2min each side
Pigeon Pose (Kapotasana) 3min each side
Supine Twist 2min
Pranayama: Sitali (cooling breath)

Tired → Restorative:
Supported Child's Pose 5min
Supported Bridge 5min
Legs Up Wall 10min
Savasana 5min

Stressed → Yin Yoga:
Butterfly pose 5min
Dragon pose 3min each side
Sleeping Swan 4min each side
Savasana 5min

GUIDED SESSION PLAYER:

- Timer-based pose guide
- Auto-advances to next pose
- Audio cue option (bell sound between poses)
- Breathing cue displayed prominently
- Pause / Skip / Restart controls
- Progress indicator: "Pose 2 of 5"
- Full screen mode option

GRAVITY AI YOGA ENHANCEMENT:

- Send user emotion + physical context to Gravity AI:
  POST body: { emotion: {}, age: number, intensity_pref: string }
- Gravity AI returns: personalized_sequence,
  contraindications_check (based on age),
  ayurvedic_dosha_suggestion,
  mudra_recommendation (hand gestures),
  mantra_suggestion (for mental focus)
- Show Gravity AI "Personalized Today" sequence as premium option
- Display mudra guide as bonus content card

PRANAYAMA GUIDE:

- Separate section with 5 breathing techniques
- Each with animated circle guide
- Techniques: Box breathing, 4-7-8, Kapalabhati,
  Nadi Shodhana, Bhramari (humming bee)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PAGE 8C — MENTAL HEALTH ACTIVITIES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Build comprehensive mental wellness toolkit:

TAB NAVIGATION:

- Tabs: [📝 Journal] [✨ Affirmations] [🎯 Grounding]
  [🎮 Games] [📚 CBT Tools] [🙏 Gratitude]

JOURNALING TAB:

- Daily prompt (changes each day, 365 prompts in data file)
- Prompt categories: reflection, gratitude, processing,
  future-self, inner-child, forgiveness
- Text editor with basic formatting
- Mood tag for this entry (emoji selector)
- Word count display
- Save to Firebase with date
- Past entries: calendar view + list view
- Export entries as PDF option
- Gravity AI journal analysis:
  After saving, optional: "Analyze my journal entry"
  Gravity AI returns: themes_detected, growth_indicators,
  recurring_patterns, affirmation_suggestion

AFFIRMATIONS TAB:

- Categorized affirmations (50+ in each category):
  Self-Love / Confidence / Anxiety Relief / Grief /
  Success / Body Positivity / Relationship / Healing
- Display one at a time with typewriter effect
- [Next] [Favorite ❤️] [Share] buttons
- Saved favorites section
- "Your Personalized Affirmation" based on Gravity AI:
  Gravity AI generates custom affirmation based on
  user emotion profile and journal patterns

GROUNDING TAB:

- 5-4-3-2-1 Interactive Guide:
  Step-by-step with input fields for each sense
  User types what they notice
  Timer option for each step
  Completion screen: "You're grounded now 🌱"
- Body Scan Meditation:
  Audio-guided (text-to-speech with Web Speech API)
  Body outline diagram with highlighted areas
  Progress through body from feet to head
- Progressive Muscle Relaxation:
  Step-by-step tension/release guide
  Timer for each muscle group

CBT TOOLS TAB:

- Thought Record:
  Situation → Automatic Thought → Emotion → Evidence For →
  Evidence Against → Balanced Thought → Outcome
  All fields saveable
- Cognitive Distortion Checker:
  List of 15 cognitive distortions with examples
  User checks which apply to current thought
  Reframing suggestions for each
- Behavioral Activation:
  Activity scheduling
  Mood before/after activity logging
  Pattern recognition over time
- Gravity AI CBT Enhancement:
  Analyze thought records for distortion patterns
  Suggest CBT worksheets based on recurring themes
  Track progress in cognitive reframing over time

GAMES TAB:

- Gratitude Bingo: 5x5 grid of gratitude prompts
- Positive Memory Recall: Guided visualization game
- Emotion Charades: Guess the emotion from description
- Kindness Challenge: Daily random acts of kindness
- Worry Time Box: Schedule worry, then release it

GRATITUDE TAB:

- 3 Things Daily: Simple 3-entry gratitude form
- Gratitude Letter: Write to someone (save or send)
- Appreciation Jar: Digital jar filling with gratitude notes
- Streak tracker for daily gratitude practice

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PAGE 8D — FOOD BY MOOD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Build nutrition-mood guidance:

MOOD-FOOD SCIENCE CARDS:
Build data/foodData.ts with complete database:

For each mood include:

- recommended_foods: Food[]
  Each: { name, emoji, benefit, howMuch, howToEat, scienceBehind }
- avoid_foods: string[] with reasons
- recipes: Recipe[]
  Each: { name, ingredients, steps, moodBenefit, prepTime, emoji }
- supplements: { name, benefit, caution }[]
- hydration: string
- meal_plan: { breakfast, lunch, snack, dinner }

MOODS TO COVER:
Sad, Anxious, Angry, Tired, Stressed,
Happy (maintain), Focused, PMS/hormonal,
Low confidence, Brain fog

INDIAN FOOD FOCUS:
Prioritize Indian foods and Ayurvedic wisdom:

- Haldi Doodh (turmeric milk) for inflammation + mood
- Ashwagandha for stress adaptation
- Brahmi for cognitive function
- Amla for vitamin C + mood
- Ghee for brain health
- Dal for tryptophan (serotonin precursor)
- Moringa for energy
- Tulsi tea for anxiety

RECIPE CARDS:

- Visual recipe cards with emoji illustrations
- Step-by-step expandable instructions
- Mood benefit callout box
- Prep time + difficulty badge
- Save to favorites
- Share recipe option

MEAL PLANNER:

- "Today's Mood Meal Plan" based on current emotion
- Full day: Breakfast + Lunch + Snack + Dinner
- Generate grocery list from meal plan
- Dietary filter: Veg / Non-veg / Vegan (from profile)

GRAVITY AI NUTRITION:

- Call Gravity AI nutrition endpoint:
  POST body: { emotion_profile: {}, dietary_pref: string,
  age: number, time_of_day: string }
- Gravity AI returns: personalized_meal_plan,
  micronutrient_focus (e.g., "increase magnesium"),
  ayurvedic_constitution_tips,
  gut_brain_recommendations,
  timing_advice (when to eat what for mood optimization)
- Show as "AI Nutrition Insight" highlighted card
- Display gut-brain connection info pulled from Gravity AI

FOODS TO AVOID:

- Mood-specific warnings
- Explains WHY (not just what to avoid)
- Non-judgmental tone: "If you're craving X, try Y instead"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PAGE 8E — SLEEP CYCLE ANALYSIS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Build complete sleep wellness system:

SLEEP TRACKER INPUT:

- Bedtime (time picker)
- Wake time (time picker)
- Sleep quality (star rating 1-5)
- Disturbances (number input)
- Dream quality (Pleasant / Neutral / Disturbing / None)
- Mood before bed (emoji select)
- Mood after waking (emoji select)

SLEEP ANALYSIS ENGINE (client-side calculation):

- Total sleep hours calculation
- Number of 90-min cycles
- Estimated sleep stages:
  NREM 1: 5% of sleep
  NREM 2: 45% of sleep
  NREM 3 (deep): 25% of sleep
  REM: 25% of sleep
- Sleep efficiency score
- Debt calculation vs recommended hours
- Optimal wake time calculator:
  Given bedtime → suggest wake times at cycle endpoints

VISUALIZATION:

- Sleep architecture chart (area chart, Recharts):
  X-axis: time from sleep to wake
  Y-axis: sleep stage (REM, Light, Deep, Awake)
  Color coded stages
- Weekly sleep pattern chart (bar chart)
- Sleep quality trend line

PERSONALIZED INSIGHTS:
Based on input data, show insights:

- "You got X% deep sleep (recommended: 20-25%)"
- "Disturbances are fragmenting your sleep cycles"
- "Your mood correlation: poor sleep → lower mood next day"

SLEEP HYGIENE PLAN:

- Personalized schedule based on user's wake time:
  Dynamic calculation from wake time backwards:
  Wind-down starts: wake_time - 9 hours
  Phone away: wake_time - 8.5 hours
  In bed: wake_time - 8 hours
  Lights out: wake_time - 7.75 hours

SLEEP HYGIENE TIPS (contextual):

- Temperature: keep room 18-20°C
- Blue light: no screens 1hr before bed
- Consistency: same time every day (even weekends)
- Caffeine: no caffeine after 2pm
- Exercise: no intense exercise within 3hrs of bed
- Alcohol: disrupts REM sleep
- Evening meal: finish 2-3 hours before bed

GRAVITY AI SLEEP ENHANCEMENT:

- Send sleep data to Gravity AI:
  POST body: { sleep_logs: [], emotion_history: [],
  lifestyle_factors: {} }
- Gravity AI returns: sleep_disorder_risk_assessment,
  circadian_rhythm_analysis,
  personalized_sleep_schedule,
  sleep_emotion_correlation (e.g., "anxiety increases
  your sleep latency by est. 25 min"),
  recommended_interventions: [],
  sleep_sound_recommendation: string
- Display sleep disorder risk (gently, non-alarmist):
  "Your patterns suggest possible sleep anxiety.
  Consider speaking with a doctor if this persists."
- Show Gravity AI sleep schedule as "Optimized for You"

SLEEP SOUNDS PLAYER:

- Audio options:
  🌊 Ocean waves / 🌧️ Rain / 🌿 Forest /
  🎵 432hz tone / 🌙 Delta waves / 🎶 Gentle piano
- Use Web Audio API to generate:
  White noise / Pink noise / Brown noise
- Sleep timer: auto-stop after 30/60/90 minutes
- Fade out gradually at timer end

SLEEP CHALLENGE:

- "7-Day Sleep Reset Challenge"
- Daily tasks to improve sleep hygiene
- Progress tracker
- Streak maintained

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PAGE 9 — THANK YOU & FEEDBACK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Build completion and feedback page:

SESSION SUMMARY CARD:

- Animated confetti on arrival (if mood improved)
- Mood Journey: "Started as 😔 Sad → Now feeling 🙂 Better"
- Mood improvement score: "+15 points"
- Activities completed count
- Session duration
- Current streak with flame animation

RATING SECTION:

- "How was ManoMitra today?" star rating (1-5)
- Animated stars on hover
- Different thank you message per rating:
  5⭐: "You made our day too! 💜"
  3-4⭐: "Thank you! We'll keep improving 🌱"
  1-2⭐: "We're sorry. Tell us what went wrong"

MOST HELPFUL SECTION:

- Multi-select: What helped you most today?
  Options as emoji cards (tap to select/deselect)

OPEN FEEDBACK:

- Text area: "Any suggestions for us?"
- Optional name field

CLOSING MESSAGE:

- Rotating inspirational quotes
- Fixed quote:
  "You are not your worst day.
  You are not your darkest thought.
  You are still here. And that matters. 💜"

CTA BUTTONS:

- [🔔 Set Daily Reminder] → browser notifications
- [📤 Share ManoMitra] → Web Share API
- [🏠 Return to Dashboard]
- [📊 View My Progress]

GRAVITY AI FEEDBACK PROCESSING:

- Send feedback + session data to Gravity AI:
  POST body: { rating, feedback_text, session_data: {},
  emotion_before, emotion_after }
- Gravity AI analyzes: session_effectiveness_score,
  feature_improvement_suggestions,
  user_satisfaction_prediction,
  personalization_improvements for next session
- Store Gravity AI suggestions for adaptive improvements
- Next session: ManoBot greets with context from last session
