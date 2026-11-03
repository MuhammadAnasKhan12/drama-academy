# Drama Kids booking API

TypeScript backend for online bookings, Stripe card payments and the admin area.
Runs on **Cloudflare Workers** with a **D1** (SQLite) database. Built with Hono, Drizzle, Zod and Stripe.

```
api/
├── src/index.ts            routes, CORS, security headers, cron
├── src/routes/public.ts    availability · payment-intent · booking status
├── src/routes/webhook.ts   Stripe webhook (the only place a booking becomes "paid") + hold expiry
├── src/routes/auth.ts      admin sign-in / sign-out (email + password, session cookie)
├── src/routes/admin.ts     admin screens' data (signed-in admins only)
├── src/middleware/session.ts  checks the admin session cookie
├── src/lib/                Stripe client, emails (Resend), validation, place counting
├── src/db/schema.ts        database tables → `npm run api:db:generate` makes migrations
├── migrations/             SQL applied to D1
└── wrangler.jsonc          Worker settings (non-secret)
```

Prices, dates, ages and capacity come from the website's `app/data/*.ts` files — the API imports the same
code, so the price a parent sees and the price charged can never drift apart.

## Endpoints

| Method | Path | What it does |
|---|---|---|
| GET | `/api/availability` | Places left per club/term (closed ones show 0) |
| POST | `/api/payment-intent` | Re-checks items, ages, prices and places; holds the places; creates a Stripe PaymentIntent (card only) |
| GET | `/api/bookings/:reference/status?payment_intent=pi_…` | Booking status for the confirmation page (needs both values) |
| POST | `/api/stripe/webhook` | Signature-verified Stripe events: paid / failed / cancelled / refunded. On "paid" the academy gets a notification email (parents are not emailed) |
| POST | `/api/auth/login` | `{ email, password }` → sets the admin session cookie (5 wrong tries per email / 20 per IP in 15 min, then blocked for a while) |
| POST | `/api/auth/logout` | Clears the session cookie |
| GET | `/api/auth/me` | The signed-in admin's email, or 401 |
| GET | `/api/admin/bookings` | All bookings for the admin |
| PATCH | `/api/admin/bookings/:id` | `{ "status": "refunded" \| "cancelled" }` |
| GET / PATCH | `/api/admin/items`, `/api/admin/items/:id` | Close / reopen online booking for a club or term |

A cron trigger runs every 15 minutes: unpaid bookings whose 30-minute hold has passed become **expired**,
their places are released and their PaymentIntents cancelled.

## Run it locally

1. **Secrets** — copy `api/.dev.vars.example` to `api/.dev.vars` and fill in:
   - `STRIPE_SECRET_KEY` — test secret (`sk_test_…`) or restricted key (`rk_test_…`) with **PaymentIntents: write**.
   - `STRIPE_WEBHOOK_SECRET` — from step 4.
   - `RESEND_API_KEY` — optional; used only for the academy's new-booking notification. Without it the email is printed in the terminal.
   - `ADMIN_USERS` — who may sign in to the admin. Run `npm run admin:user`, enter an email and password, and paste
     the line it prints (several admins: join the lines with commas).
   - `SESSION_SECRET` — any random string of 32+ characters (`npm run admin:user -- --secret` makes one).
2. **Website settings** — in the project root `.env` (see `.env.example`):
   ```
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
   VITE_BOOKING_API_URL=http://localhost:8787/api
   ```
3. **Database (first time only), then start everything**
   ```bash
   npm run api:db:migrate:local
   npm run dev:all
   ```
   `dev:all` starts the API (http://localhost:8787, lines marked `[api]`) and the website
   (http://localhost:5199, lines marked `[web]`) together; Ctrl+C stops both.
   To run them separately instead: `npm run api:dev` and `npm run dev:web` in two terminals.
4. **Stripe webhooks locally** — install the [Stripe CLI](https://docs.stripe.com/stripe-cli), then:
   ```bash
   stripe login
   stripe listen --forward-to localhost:8787/api/stripe/webhook --events payment_intent.succeeded,payment_intent.payment_failed,payment_intent.canceled,charge.refunded
   ```
   (or `npm run dev:stripe`). Copy the `whsec_…` it prints into `STRIPE_WEBHOOK_SECRET` and restart `npm run dev:all`.
5. Book on http://localhost:5199/book with a [Stripe test card](https://docs.stripe.com/testing):
   `4242 4242 4242 4242`, any future date, any CVC. `4000 0025 0000 3155` tests the bank's 3-D Secure check,
   `4000 0000 0000 0002` a declined card. Then see it in http://localhost:5199/admin.

## Deploy (Cloudflare)

You need a Cloudflare account and `npx wrangler login`.

1. **Database**
   ```bash
   npx wrangler d1 create drama-kids
   ```
   Put the printed `database_id` into `api/wrangler.jsonc`, then:
   ```bash
   npm run api:db:migrate:remote
   ```
2. **Settings** in `api/wrangler.jsonc` → `vars`:
   - `SITE_ORIGIN` — your website address, e.g. `https://dramakidscanterbury.co.uk` (comma-separate several).
   - `EMAIL_FROM` — a sender on a domain verified in Resend.
3. **Secrets** (never in files):
   ```bash
   npx wrangler secret put STRIPE_SECRET_KEY --config api/wrangler.jsonc
   npx wrangler secret put STRIPE_WEBHOOK_SECRET --config api/wrangler.jsonc
   npx wrangler secret put RESEND_API_KEY --config api/wrangler.jsonc
   npx wrangler secret put ADMIN_USERS --config api/wrangler.jsonc
   npx wrangler secret put SESSION_SECRET --config api/wrangler.jsonc
   ```
   `ADMIN_USERS`: paste the line(s) from `npm run admin:user` (use a strong password).
   `SESSION_SECRET`: paste the output of `npm run admin:user -- --secret`. Without both, admin sign-in refuses everyone.
4. **Deploy** — `npm run api:deploy`. Note the URL (`https://drama-kids-api.<you>.workers.dev`), or add a
   route so the API lives at `https://yourdomain/api/*`.
5. **Stripe webhook** — Stripe Dashboard → Developers → Webhooks → *Add endpoint*:
   `https://<api-address>/api/stripe/webhook`, events `payment_intent.succeeded`,
   `payment_intent.payment_failed`, `payment_intent.canceled`, `charge.refunded`.
   Put its signing secret into `STRIPE_WEBHOOK_SECRET` (step 3).
6. **Admin accounts** — to add someone, run `npm run admin:user` and set `ADMIN_USERS` again with all the entries
   (comma-separated). To remove someone, set it again without their entry: they are signed out on their next click.
   To sign everyone out, set a new `SESSION_SECRET`.
7. **Website** — build with the live values in `.env` (`VITE_BOOKING_API_URL=https://<api-address>/api`,
   `VITE_STRIPE_PUBLISHABLE_KEY=pk_live_…` when going live) and deploy `build/client` to Cloudflare Pages.
   Serve `__spa-fallback.html` for unknown paths.
8. **Rate limiting** — Cloudflare dashboard → Security → WAF → Rate limiting rules: e.g. 10 requests per
   minute per IP to `/api/payment-intent`.

### Going live checklist
- Switch to live Stripe keys (`sk_live_`/`rk_live_` secret, `pk_live_` publishable) and a live webhook.
- Restricted key permissions: PaymentIntents **write** is required.
- Verify your sending domain in Resend.
- Test one real booking end to end, then refund it in Stripe and mark it refunded in the admin.

## Security notes
- Card details never reach this API — Stripe's card form sends them straight to Stripe.
- Prices, ages and places are recalculated on the server; the browser's total is only compared, never used.
- A booking is only marked paid by a **signature-verified** Stripe webhook; repeated events are ignored.
- Secrets live in `.dev.vars` (git-ignored) locally and Wrangler secrets in production.
- CORS allows only `SITE_ORIGIN`; all input is validated with Zod; queries are parameterised (Drizzle).
- Admin sign-in: passwords are stored only as PBKDF2-SHA256 hashes in a secret; sessions are signed, HttpOnly, Secure,
  SameSite=Strict cookies that last 12 hours; repeated wrong passwords are blocked for 15 minutes. Admin routes return
  no-store headers and log every action with the admin's email.
