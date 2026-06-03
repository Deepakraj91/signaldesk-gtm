# SignalDesk GTM

React prototype for GTM buying signals used in outbound sales outreach.

## Local Development

```powershell
npm install
npm run dev
```

## Render Web Service Settings

- Build command: `npm install && npm run build`
- Start command: `npm start`
- Environment variable for live search: `TAVILY_API_KEY`

Use the `render.yaml` Blueprint to create the Node Web Service. A static site will load the UI, but it cannot run `/api/signals`.
