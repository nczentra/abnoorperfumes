# AB Noor Perfumes - Cloudflare Worker for Resend

This Cloudflare Worker provides a 100% free, serverless external backend for sending transactional emails with **Resend** without requiring the Firebase Blaze billing plan.

## Features
- **Welcome Emails** on patron registration.
- **Order Confirmations** with itemized luxury receipt.
- **Shipping / Status Updates** with tracking details.
- **Admin Order Alerts** dispatched straight to `abnoorperfumes@gmail.com`.
- Full CORS support for `https://abnoorperfumes-cdb83.web.app`.

---

## How to Deploy to Cloudflare Workers (Takes 1 Minute)

### Option A: Via Cloudflare Web Dashboard (No CLI Needed)
1. Go to your **[Cloudflare Dashboard](https://dash.cloudflare.com/)** -> **Workers & Pages** -> **Create Application**.
2. Click **Create Worker**, name it `abnoor-email-worker`, and click **Deploy**.
3. Click **Edit code**, copy the contents of `worker.js`, paste it into the editor, and click **Save and Deploy**.
4. In **Settings -> Variables**, you can optionally set `RESEND_API_KEY` to `re_W74ruDJ1_Bg85A7cnQ4hfYbQxPueDKHwT`.
5. Copy your worker's live URL (e.g. `https://abnoor-email-worker.<your-subdomain>.workers.dev`).

### Option B: Via Wrangler CLI
Run from the `cloudflare-worker` directory:
```bash
npx wrangler deploy
```

---

## Connect to Frontend
Once deployed, set the worker URL in your project root `.env`:
```env
VITE_BACKEND_API_URL=https://abnoor-email-worker.<your-subdomain>.workers.dev
```
Or the client-side `emailService.js` will automatically use it!
