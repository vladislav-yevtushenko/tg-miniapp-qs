# Frontend

React + TypeScript client for the Telegram school marketplace mini app.

## Getting started

```bash
cp .env.example .env
npm install
npm run dev
```

The app expects to be loaded inside the Telegram Mini App webview. When developing locally you can still render the UI, but Telegram-specific data will be absent.

## Available scripts

- `npm run dev` – start the Vite dev server
- `npm run build` – type-check and produce a production bundle
- `npm run lint` – run ESLint over the source tree
