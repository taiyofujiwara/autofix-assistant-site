AgentOrchestrator Landing

Quickstart
- Copy .env.example to .env.local
- Set NEXT_PUBLIC_PLAUSIBLE_DOMAIN (optional for local)
- Choose ONE lead sink (recommended for local):
  - LEADS_FILE=./data/leads.csv (auto-creates file)
  - OR set FORMSPREE_ID=xxxx OR LEAD_WEBHOOK_URL=https://...
- npm install
- npm run dev
- Visit http://localhost:3000

Deploy (Vercel)
- Set NEXT_PUBLIC_PLAUSIBLE_DOMAIN to your domain (e.g. agentorchestrator.com)
- Optionally set FORMSPREE_ID or LEAD_WEBHOOK_URL (don’t set placeholder values)
- Deploy from site/web

API
- POST /api/subscribe { email, name? }
  - Sends to webhook, Formspree, or appends to file if configured
  - Basic email validation; trims inputs

Notes
- Landing copy reads from ../../site/landing-copy.md; edit there.
- Plausible snippet is injected when NEXT_PUBLIC_PLAUSIBLE_DOMAIN is set.
- Thank-you page at /thank-you; demo page at /demo.

Local verification
- With LEADS_FILE=./data/leads.csv, submit the form and verify that file exists and has a new line.
- Check browser console/network for 200 from /api/subscribe.
