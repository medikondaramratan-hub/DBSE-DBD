# Front-End Architecture & Design System Explanation

## 1. Front-End Architectural Overview
The front-end of the **Exam Preparation App With Adaptive Quizzes** is built with **React 18** and **Vite**, organized in a clean component-driven architecture:

```
src/
├── api/
│   └── axiosClient.js          # Centralized Axios client with JWT interceptor
├── components/
│   ├── DifficultyBadge.jsx     # Reusable difficulty pills (Easy, Medium, Hard)
│   ├── Navbar.jsx              # Responsive navigation header
│   ├── ProgressBar.jsx         # Dynamic animated progress indicator
│   ├── ProtectedRoute.jsx      # Route authentication guard
│   ├── Sidebar.jsx             # Left desktop navigation rail
│   ├── StatCard.jsx            # Premium metric card with trend indicators
│   └── Toast.jsx               # Floating toast notification
├── context/
│   └── AuthContext.jsx         # React Context for global auth state & actions
├── layouts/
│   └── DashboardLayout.jsx     # Layout wrapper with sidebar and topbar
├── pages/
│   ├── Dashboard.jsx           # Student overview, stats, recent quizzes, recommendations
│   ├── Landing.jsx             # High-conversion public landing page with feature cards
│   ├── Login.jsx               # Split-screen login with 1-click Demo Fill
│   ├── Performance.jsx         # Comprehensive topic mastery analytics & insights
│   ├── Profile.jsx             # Student profile, study preferences, stats
│   ├── Quiz.jsx                # Live adaptive exam engine with timer & instant feedback
│   ├── QuizResult.jsx          # Post-quiz scorecard with breakdown & question review
│   ├── QuizStart.jsx           # Topic briefing, rule confirmation, difficulty overview
│   ├── Register.jsx            # Student registration with validation
│   ├── Subjects.jsx            # Academic subject directory with progress bars
│   └── Topics.jsx              # Topic listing per subject with question counts
├── styles/
│   └── main.css                # Pure Vanilla CSS custom design system (no Tailwind)
├── App.jsx                     # Route definitions & app providers
└── main.jsx                    # Application entry point
```

---

## 2. Design System & Aesthetics
- **Color Tokens**:
  - Primary Indigo Accent: `#6366f1` / `#4f46e5`
  - Deep Academic Slate Surfaces: `#0f172a` (body background), `#1e293b` (card surfaces), `#334155` (borders)
  - Semantic Status Tokens:
    - Success (Easy/Passed): `#10b981` (Emerald)
    - Warning (Medium): `#f59e0b` (Amber)
    - Danger (Hard/Failed): `#ef4444` (Crimson)
- **Typography**: Google Fonts `Outfit` (for display headings, cards, and numeric statistics) paired with `Inter` (for readable, accessible body copy).
- **Glassmorphism**: Subtle backdrop blur (`backdrop-filter: blur(12px)`) with semi-transparent border lines (`rgba(255, 255, 255, 0.08)`).
- **Accessibility & Contrast**: Conforms to WCAG AA color contrast guidelines. Status messages use both explicit iconography and text labels rather than relying solely on color.

---

## 3. Key Components & Implementation Details

### A. Centralized API Layer (`src/api/axiosClient.js`)
- Injects `Authorization: Bearer <token>` automatically on every outbound HTTP request from `localStorage.getItem('token')`.
- Global response interceptor detects `401 Unauthorized` responses and automatically:
  1. Clears cached token and user data.
  2. Dispatches an authentication error notification.
  3. Safely redirects the student to `/login`.

### B. Authentication Context (`src/context/AuthContext.jsx`)
- Provides `user`, `token`, `isAuthenticated`, `login(email, password)`, `register(name, email, password)`, and `logout()` throughout the component tree.
- Restores active user session on browser reload by parsing local storage tokens.

### C. Live Adaptive Quiz Screen (`src/pages/Quiz.jsx`)
- **Timer Engine**: Client-side countdown timer tracked down to seconds with automatic zero-submission guard.
- **Adaptive Step Animation**: As answers are submitted, the app transitions smoothly to the next question, displaying animated difficulty badges (`EASY`, `MEDIUM`, `HARD`) reflecting real-time backend updates.
- **Anti-Cheat Verification**: Does not receive correct answers during the quiz. Only question prompts and choices are rendered.

### D. Comprehensive Results & Performance Analytics
- **`QuizResult.jsx`**: Visual score dial, accuracy metric, time elapsed, and expandable accordion review showing each answered question with explanation, correct answer, and chosen option.
- **`Performance.jsx`**: Topic-by-topic mastery breakdown with colored progress bars, weak area recommendations, and historical quiz attempts list.
