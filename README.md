# Kashmiri Jutt — FAIZAN-MD Pairing Panel

Human-readable project name: `𝐊αѕнмιяι-𝐉υтт⎯꯭̽`. Private GitHub repository: [kashmiri-jutt](https://github.com/Faizan-MD-BOTZ/kashmiri-jutt). The panel's on-page wordmark remains **FAIZAN-MD**.

A lightweight static WhatsApp pairing-code page with Auto Server and manual server selection. It calls one selected Heroku or Railway endpoint directly from the browser; it does not run another bot session or save the submitted phone number or returned code.

## Server slots

Edit [`src/servers.mjs`](src/servers.mjs). The panel has exactly five slots. Slot 1 contains the supplied Heroku server, slot 2 contains the supplied Railway server, and slots 3–5 are empty so you can add your other links later. Keep each slot's `id` and `name` intact; add only an HTTPS base URL, for example:

```js
{ id: 'server-3', name: 'Server 3', baseUrl: 'https://your-third-app.example/' }
```

Leave `baseUrl` as `''` until a server is ready. Empty slots remain disabled in the panel. Auto Server checks configured servers and chooses a reachable one; manual mode lets the visitor choose a configured server. A pairing request goes once to one selected server—there is no cross-server retry, to avoid duplicate pairing attempts.

Each configured backend must support `GET /code?number=<digits>` and return JSON containing a non-empty `code` field on success. It must permit browser CORS from the deployed panel origin. The health check uses `GET /code` without a number; it must not create a pairing session or send a code. Both supplied endpoints were checked with that no-number request and permit browser CORS. No phone number or pairing code was used in the check.

## Vercel Production

The project is named `kashmiri-jutt` and is connected to the private GitHub repository above. Vercel automatically deploys updates pushed to the repository's `main` branch. The site is static: use the **Other** framework preset, leave install and build commands empty, and serve the repository root containing `index.html`, `styles.css`, `app.js`, and `src/`.

Primary live site: <https://kashmiri-jutt.vercel.app/>. The previous alias <https://faizan-md-pairing-panel.vercel.app/> remains active.

The form's example number is static helper text; a pairing request is sent only when a visitor submits the form. The page does not write the number or returned code to local storage, cookies, or analytics.
