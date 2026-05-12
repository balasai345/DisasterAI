<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# DisasterAI

DisasterAI is a disaster-risk monitoring dashboard built with React + Vite, backed by an Express API and a local SQLite database. It also supports mobile builds via Capacitor (Android/iOS) and ships as a PWA.

## Tech Stack

- Frontend: React, Vite, Tailwind
- Backend: Express (served from `server.ts`)
- Database: SQLite (`better-sqlite3`), stored locally as `disaster_risk.db`
- Mobile: Capacitor (Android/iOS)
- PWA: `vite-plugin-pwa`

## Prerequisites

- Node.js (LTS recommended)
- (Optional) Android Studio for Android builds
- (Optional, macOS only) Xcode for iOS builds

## Environment Variables

This app uses Gemini via `@google/genai`.

- `GEMINI_API_KEY` (preferred)
- `API_KEY` (fallback)

Create a local env file (it is ignored by git):

1. Copy `.env.example` to `.env.local`
2. Put your key in `.env.local`:
   - `GEMINI_API_KEY="..."`

## Run Locally

1. Install dependencies:
   - `npm install`
2. Start the dev server (Express + Vite middleware):
   - `npm run dev`
3. Open:
   - http://localhost:3000

## Scripts

- `npm run dev`: Run the app locally (Express server + Vite middleware)
- `npm run build`: Build the web app to `dist/`
- `npm run preview`: Preview the Vite build
- `npm run lint`: Type-check (`tsc --noEmit`)

## API (Local)

The Express server exposes a small API used by the UI:

- `GET /api/stats`: Dashboard stats
- `GET /api/alerts`: Alert history
- `POST /api/alerts`: Create an alert

## Mobile (Capacitor)

After building the web bundle, sync it into native projects:

1. `npm run build`
2. `npx cap sync`
3. Open the native IDE:
   - Android: `npx cap open android`
   - iOS (macOS only): `npx cap open ios`

## Notes

- The local SQLite database file (`disaster_risk.db`) is created at runtime and is intentionally not committed.
