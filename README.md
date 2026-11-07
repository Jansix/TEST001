<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/34b72068-9963-4f1a-b716-79fea77606db

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Official weather on Vercel

The server route `/api/weather` reads `CWA_API_KEY` from Vercel's server environment.
Configure it in Project Settings > Environment Variables for Production, then deploy.
Do not prefix this secret with `VITE_`, commit it, or include it in client code.

Data sources: CWA `F-B0053-059` (Alishan forest recreation forecast) and
`F-D0047-029` (Chiayi County township forecasts). Fenqihu explicitly uses the
Zhuqi township representative point; Southern Branch uses Taibao City.
The UI shows current available forecast periods, not guaranteed trip-date forecasts
or live station observations. Missing UV/sunrise/sunset values are not synthesized.
Responses are cached for 15 minutes. A warm function can serve a marked stale
response for up to 6 hours on upstream failure; cold starts may have no fallback.
Local Vite alone does not run Vercel Functions; use Vercel preview deployments
(or Vercel CLI development) to exercise the complete route.
