# orbit-your-career-compass

React dashboard for Orbit — a personal career intelligence agent. View AI-scored job matches, manage your career profile, and control your job search agent from one place.

🌐 **Live:** [orbit-your-career-compass.daksh25chawla.workers.dev](https://orbit-your-career-compass.daksh25chawla.workers.dev)

---

## What This Does

This is the frontend of Orbit. It connects to the FastAPI backend and gives you a clean interface to:
- View job and internship matches scored by AI
- Filter by role type (internship, full-time, remote)
- Sort by relevance score or date found
- Manage your career profile (skills, roles, locations)
- Chat with Orbit AI to update your preferences naturally
- Control agent settings and notification preferences

---

## Tech Stack

- **React** + TypeScript
- **TanStack Router** — file-based routing
- **Tailwind CSS** — styling
- **Vite** — build tool
- **Cloudflare Pages** — deployment

---

## Setup

```bash
git clone https://github.com/GreenBolJS/orbit-your-career-compass
cd orbit-your-career-compass
npm install
```

Create `.env`:
```
VITE_API_URL=https://orbit-backend-production-26a0.up.railway.app
```

Start:
```bash
npm run dev
```

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
2. Connect repo to Cloudflare Pages
3. Add `VITE_API_URL` environment variable
4. Cloudflare handles the rest

---

## Part of Orbit

| Repo | Description |
|---|---|
| [orbit-backend](https://github.com/GreenBolJS/orbit-backend) | FastAPI pipeline |
| **orbit-your-career-compass** | This repo — React dashboard |
| [orbit_sync_extension](https://github.com/GreenBolJS/orbit_sync_extension) | Chrome extension |

---

**Daksh Chawla** — BTech, IIT Roorkee · [GitHub](https://github.com/GreenBolJS)
