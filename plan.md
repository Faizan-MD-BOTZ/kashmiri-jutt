# Implementation Plan — FAIZAN-MD Pairing Panel

## Scope and behavior

Maintain the FAIZAN-MD WhatsApp pairing-code panel. A visitor enters a WhatsApp number with country code, chooses an available server manually or selects **Auto Server**, requests one pairing code, then copies the returned code. The form's placeholder and helper example display the user-approved number `923266105873` as static text only; it is not submitted automatically.

The panel has seven visible server slots, all pointing to the approved endpoint `https://mishumd-998dc798c50a.herokuapp.com/`. Remove the former server URLs from the panel configuration; do not create additional apps or reuse an old endpoint.

Deploy bot repository commit `46ae5be` (`Raise audio and video download caps to 70 MB`) to the already-existing Heroku apps `freebot07`, `fazi007`, `fazi008`, and `fazi009`, then verify their availability. Do not alter the MongoDB URL or bot configuration. The panel selector must mark servers unavailable if its safe no-number `/code` check fails, returns HTTP 404, or is blocked by browser CORS. Each usable backend supports `GET /code?number=<digits>` and returns JSON with a non-empty `code`; one pairing request goes to only one selected server. The page does not save phone numbers or pairing codes.

The bot's per-number prefix and AutoReact settings remain separate bot-repository concerns, not panel features.

## Repository and hosting

The approved public panel identity is `𝐊αѕнмιяι-𝐉υтт⎯꯭̽`, with the existing `kashmiri-jutt.vercel.app` public domain. Preserve the panel's existing GitHub/Vercel binding and deploy the revised panel through the connected repository; do not change repository ownership or hosting settings.

Use a lightweight static HTML/CSS/JavaScript frontend with no database or application server. Keep the public website files at repository root for Vercel's static **Other** preset. The Webdev static build copies the site files into `dist/` and publishes that folder. The page calls the configured Heroku base URL directly in the browser. Keep the README accurate about the approved endpoint, CORS, and endpoint requirements.

## Design

Follow the supplied FAIZAN-MD pairing page rather than inventing a new layout: retain the dark navy-to-purple gradient, compact translucent rounded card, clear number input, primary gradient Pair Code button, visible code result, and server controls. Use the user's exact wordmark `𝐅αɪᴢαɴ-𝐌ᴅ⎯꯭̽` in both header and footer. Color the FAIZAN portion in a warm Malta-orange accent and the `-MD` portion in white. Make the Copy button solid red with white icon and text, and only enable it after a pairing code is successfully returned. Keep the layout phone-first, readable and uncluttered, with small motion only for loading and server health feedback; respect reduced-motion preferences.

## Project structure

- `index.html` — accessible single-page pairing form and visible seven-slot server selector.
- `styles.css` — responsive FAIZAN-MD theme, interaction states, and the requested brand colors.
- `app.js` — server availability check, auto/manual selection, phone normalization, pairing request, result and copy handling.
- `src/servers.mjs` — five existing server URLs plus two deliberately empty slots.
- `src/pairing-core.mjs` — pure phone, URL and Auto Server selection helpers.
- `manus-routes.json` — declare the single `/` page route.
- `README.md` — setup, exact server mapping, API/CORS requirements and GitHub-to-Vercel deployment steps.
- `plan.md` and `TODO.md` — implementation plan and outcome tracking.
- `test/pairing-core.test.mjs` — focused regression checks for phone and server selection helpers.
