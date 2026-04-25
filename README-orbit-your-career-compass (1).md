# orbit-your-career-compass

React dashboard for Orbit — a personal career intelligence agent. View AI-scored job matches, manage your career profile, and control your job search agent from one place.

🌐 **Live:** [orbit-your-career-compass.daksh25chawla.workers.dev](https://orbit-your-career-compass.daksh25chawla.workers.dev)

---

## What This Does

This is the frontend of Orbit. It connects to the FastAPI backend and gives you a clean interface to:
- View job and internship matches scored by AI (1-10 relevance score)
- Filter by role type (internship, full-time, remote)
- Sort by relevance score or date found
- Manage your career profile (skills, roles, locations, companies)
- Chat with Orbit AI to update your preferences naturally
- Control agent settings and notification preferences
- Clear matches and reset your profile

---

## Tech Stack

- **React** + TypeScript
- **TanStack Router** — file-based routing
- **Tailwind CSS** — styling
- **Vite** — build tool
- **Cloudflare Pages** — deployment

---

## Prerequisites

Before running the frontend, make sure the backend is running first:
- Follow setup at [orbit-backend](https://github.com/GreenBolJS/orbit-backend)
- Backend should be running at `http://localhost:8000`

---

## Setup

```bash
git clone https://github.com/GreenBolJS/orbit-your-career-compass
cd orbit-your-career-compass
npm install
```

Create `.env`:
```
VITE_API_URL=http://localhost:8000
```

For production, set this to your Railway backend URL:
```
VITE_API_URL=https://orbit-backend-production-26a0.up.railway.app
```

Start:
```bash
npm run dev
```

Open `http://localhost:8080` in your browser.

---

## Pages

| Route | Description |
|---|---|
| `/` | Onboarding — import ChatGPT history or enter profile manually |
| `/dashboard` | Overview of recent matches and agent status |
| `/matches` | Full matches feed with filters and sort |
| `/profile` | Edit skills, roles, locations, companies |
| `/settings` | Agent frequency, score threshold, notifications |

---

## File Structure

```
orbit-your-career-compass/
├── src/
│   ├── api/          # Backend API calls
│   │   ├── client.ts
│   │   ├── matches.ts
│   │   ├── profile.ts
│   │   └── agent.ts
│   ├── routes/       # Page components
│   │   ├── dashboard.tsx
│   │   ├── matches.tsx
│   │   ├── profile.tsx
│   │   └── settings.tsx
│   └── components/   # Reusable UI components
├── .env
└── vite.config.ts
```

---

## Deployment

Deployed on Cloudflare Pages. Auto-deploys on push to main branch.

To deploy your own instance:
1. Push to GitHub
2. Go to [Cloudflare Pages](https://pages.cloudflare.com) → Create application → Pages → Connect to Git
3. Select this repo
4. Add environment variable: `VITE_API_URL=your_railway_backend_url`
5. Deploy — Cloudflare generates a public URL automatically

---

## Part of Orbit

| Repo | Description |
|---|---|
| [orbit-backend](https://github.com/GreenBolJS/orbit-backend) | FastAPI pipeline |
| **orbit-your-career-compass** | This repo — React dashboard |
| [orbit_sync_extension](https://github.com/GreenBolJS/orbit_sync_extension) | Chrome extension |

---

**Daksh Chawla** — BTech, IIT Roorkee · [GitHub](https://github.com/GreenBolJS)
