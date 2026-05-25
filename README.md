# OnmyoCalendar 📅

A robust Full-Stack web application designed to automatically calculate in-game boss event cycles and seamlessly synchronize them directly into the user's Google Calendar. No more waiting around to check daily buffs!
You can try out the app here:
https://onmyocalendar.github.io/

## 🚀 Tech Stack

- **Frontend:** ReactJS, Vite, Tailwind CSS
- **Backend:** Python, FastAPI, Google Calendar API, Google OAuth 2.0
- **Deployment:** GitHub Pages (Frontend), Render (Backend)

## ✨ Key Features & Technical Highlights

### 🔒 Secure Cross-Origin Authentication (OAuth 2.0)
- Implemented a secure Google OAuth 2.0 login flow across independent domains (cross-origin).
- Successfully bypassed browser third-party cookie restrictions by adopting a Token-based Authentication architecture utilizing `window.postMessage`, `localStorage`, and `Authorization` headers.

### ⚡ Optimized Performance & Batch Requests
- **Google API Batching:** Designed a data chunking algorithm leveraging Google API Batch Requests (50 requests/batch) to handle massive datasets, successfully generating up to 720 events (a full 1-year schedule) simultaneously while avoiding rate limits.
- **Asynchronous Processing:** Mitigated cloud environment timeout (504) errors on Render by offloading heavy scheduling tasks to background processes using FastAPI `BackgroundTasks`, drastically reducing API response times to under 0.1 seconds.

### 🎨 Enhanced User Experience (UX/UI)
- Built a modern, responsive user interface using Tailwind CSS.
- Integrated dynamic calendar color selection mapped directly to official Google Calendar color IDs.
- Engineered intuitive loading states with a managed artificial delay combined with backend background processing to provide a seamless, reliable user experience during intensive asynchronous operations.
- Implemented a resilient frontend error-handling mechanism that intercepts `401 Unauthorized` responses to automatically trigger the re-authentication flow.

