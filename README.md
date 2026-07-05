# Pulse — Self-Hosted Website Analytics

Pulse is a lightweight, self-hosted alternative to Google Analytics. Drop a tiny
tracking snippet into any website, and watch pageviews, unique visitors, top
pages, referrers, browsers, and devices roll in on a live dashboard — all on
infrastructure you own.

**Stack:** React (Vite) · Node.js / Express · MongoDB

---

## Features

- **One-line tracking snippet** — a ~1KB vanilla JS script, no cookies, no
  external dependencies on the tracked site.
- **Privacy-friendly visitor counting** — unique visitors are approximated
  with a daily-rotating hash of IP + user agent; raw IPs are never stored.
- **Multi-site support** — one account, unlimited tracked domains.
- **Dashboard** — pageviews & visitors over time, top pages, top referrers,
  browser/device breakdown, with 24h / 7d / 30d / 90d ranges.
- **JWT authentication** — each user only sees their own sites' data.

---

## Project structure

```
analytics-app/
├── backend/              Express API + MongoDB models
│   ├── src/
│   │   ├── config/       Database connection
│   │   ├── models/       User, Site, Event (Mongoose schemas)
│   │   ├── middleware/   JWT auth guard
│   │   └── routes/       auth, sites, collect, stats
│   └── server.js         App entry point
├── frontend/             React (Vite) dashboard
│   └── src/
│       ├── api/          Axios client
│       ├── context/      Auth context
│       ├── components/   StatCard, charts, tracking snippet, etc.
│       └── pages/        Login, Register, Sites, SiteDashboard
└── tracker/
    └── tracker.js        Embeddable script for tracked websites
```

---

## How it works

1. You create an account and register a site (e.g. `myblog.com`) in the
   dashboard. This generates a unique `siteId`.
2. You paste the generated `<script>` tag into that site's `<head>`.
3. Every page load, `tracker.js` sends a small beacon (URL + referrer) to
   `POST /api/collect` — no cookies, no personal data.
4. The backend parses the user agent for browser/OS/device, stores the event
   in MongoDB, and the dashboard queries aggregated stats on demand.

---

## Getting started

### Prerequisites

- Node.js 18+
- A MongoDB instance — either [local](https://www.mongodb.com/docs/manual/installation/)
  or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster

### 1. Clone and install

```bash
git clone https://github.com/<your-username>/pulse-analytics.git
cd pulse-analytics

cd backend && npm install
cd ../frontend && npm install
```

### 2. Configure environment variables

**backend/.env** (copy from `backend/.env.example`):

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/pulse-analytics
JWT_SECRET=change_this_to_a_long_random_string
JWT_EXPIRES_IN=7d
CLIENT_ORIGIN=http://localhost:5173
```

**frontend/.env** (copy from `frontend/.env.example`):

```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Run it

```bash
# Terminal 1 — API
cd backend
npm run dev        # http://localhost:5000

# Terminal 2 — Dashboard
cd frontend
npm run dev        # http://localhost:5173
```

Open `http://localhost:5173`, register an account, add a site, and copy the
generated tracking snippet into the page you want to measure.

> **Testing locally without a real website?** Open your browser console on
> any local HTML file and paste in a `fetch('http://localhost:5000/api/collect', ...)`
> call, or serve a simple HTML page with the snippet included — pageviews
> will show up on the dashboard within seconds.

---

## API reference

All authenticated routes expect `Authorization: Bearer <token>`.

| Method | Route                          | Auth | Description                          |
|--------|---------------------------------|------|--------------------------------------|
| POST   | `/api/auth/register`           | —    | Create an account                    |
| POST   | `/api/auth/login`              | —    | Log in, returns a JWT                |
| GET    | `/api/sites`                   | ✅   | List your tracked sites              |
| POST   | `/api/sites`                   | ✅   | Register a new site                  |
| DELETE | `/api/sites/:id`                | ✅   | Delete a site and its events         |
| POST   | `/api/collect`                 | —    | Ingest a pageview (called by `tracker.js`) |
| GET    | `/api/stats/:siteId/summary`   | ✅   | Aggregated stats (`?range=24h\|7d\|30d\|90d`) |

---

## Deployment notes

- **Backend**: deploy to any Node host (Render, Railway, Fly.io, an EC2 box,
  etc.) and point `MONGO_URI` at Atlas or your own MongoDB instance. Make sure
  `CLIENT_ORIGIN` matches your deployed frontend URL for CORS to work.
- **Frontend**: `npm run build` in `frontend/` produces a static `dist/`
  folder deployable to Vercel, Netlify, Cloudflare Pages, or any static host.
  Set `VITE_API_URL` to your deployed backend URL before building.
- **Tracker script**: serve `tracker/tracker.js` as a static file from your
  backend (or a CDN) so the snippet's `src` resolves to a public URL.

---

## Roadmap ideas

- Geolocation (country/city) via a self-hosted IP database
- Real-time "visitors online now" indicator
- Custom event tracking (button clicks, conversions)
- Data export (CSV) and email digests

---

## License

MIT — use it, fork it, ship it.
