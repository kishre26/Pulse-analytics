# Pulse — Self-Hosted Website Analytics

A lightweight, self-hosted alternative to Google Analytics. Add one script
tag to any website and see pageviews, visitors, top pages, referrers, and
devices on a live dashboard.

**Stack:** React (Vite) · Node.js / Express · MongoDB

---

## Features

- One-line tracking snippet, no cookies
- Multi-site support with your own login
- Dashboard with 24h / 7d / 30d / 90d views
- Top pages, referrers, browsers, and devices

---

## Project structure

```
analytics-app/
├── backend/     Express API + MongoDB
├── frontend/    React dashboard (Vite)
└── tracker/     Embeddable tracking script
```

---

## Setup

**Requirements:** Node.js 18+, a MongoDB database ([Atlas free tier](https://www.mongodb.com/atlas) works well)

```bash
git clone https://github.com/<your-username>/pulse-analytics.git
cd pulse-analytics/analytics-app

cd backend && npm install && cp .env.example .env
cd ../frontend && npm install && cp .env.example .env
```

Fill in `backend/.env` with your MongoDB connection string and a JWT secret.

Run both servers:
```bash
# Terminal 1
cd backend && npm run dev      # http://localhost:5000

# Terminal 2
cd frontend && npm run dev     # http://localhost:5173
```

Open `http://localhost:5173`, register an account, add a site, and copy the
tracking snippet it gives you into the page you want to measure.

---

## How it works

1. You add a site in the dashboard → get a unique tracking snippet
2. Paste the snippet into your site's `<head>`
3. Every page load pings the API with the URL and referrer — no cookies, no personal data
4. The dashboard shows aggregated stats pulled from MongoDB

---

## License

MIT
