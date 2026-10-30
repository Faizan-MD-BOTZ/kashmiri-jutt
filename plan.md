# Implementation Plan — FAIZAN-MD Pairing Panel

## Scope and behavior

Create a FAIZAN-MD WhatsApp pairing-code panel based on the user's current Heroku pairing page. A visitor enters a WhatsApp number with country code, chooses a configured server manually or selects **Auto Server**, requests one pairing code, then copies the returned code. The form's placeholder and helper example will display the user-approved number `923266105873` as static text only; it is not submitted automatically. The panel supports five server slots: slot 1 contains the supplied Heroku URL, slot 2 contains the newly supplied Railway URL (`https://web-production-461bb3.up.railway.app/`), and slots 3–5 are empty for the user to fill in later.

Each slot is configured in `src/servers.mjs` with a display name and base URL. Only configured URLs are selectable; empty slots remain visible as placeholders. Auto Server checks configured endpoints for reachability and chooses one healthy endpoint. It sends the pairing request to only that endpoint. Manual selection uses the chosen endpoint. Pairing requests use the `GET /code?number=<digits>` contract. The page does not save phone numbers or pairing codes. Other server URLs must expose a compatible `/code` endpoint and allow browser CORS from the panel origin.

The bot prefix and AutoReact issues are separate bot-repository concerns: investigate and fix the bot's per-number settings/socket scope in that repository rather than presenting the website as a settings manager.

## Repository and hosting

The human-readable requested project name is `𝐊αѕнмιяι-𝐉υтт⎯꯭̽`. Use the URL-safe ASCII slug `kashmiri-jutt` for the GitHub repository and Vercel project/domain, while keeping the existing FAIZAN-MD wordmark on the panel. The private GitHub repository is connected to Vercel; updates pushed to `main` should deploy automatically and the live link should include the new slug.

Use a lightweight static HTML/CSS/JavaScript frontend with no database or application server. Keep the public website files at repository root so Vercel's static **Other** preset can serve them with no install step. The WebDev static build copies the site files into `dist/` and publishes that folder. The page calls each configured Heroku or Railway base URL directly in the browser. Keep the README accurate about the three remaining empty server slots, CORS, and endpoint requirements.

## Design

Follow the supplied FAIZAN-MD pairing page rather than inventing a new layout: retain the dark navy-to-purple gradient, compact translucent rounded card, clear number input, primary gradient Pair Code button, visible code result, and server controls. Use the user's exact wordmark `𝐅αɪᴢαɴ-𝐌ᴅ⎯꯭̽` in both header and footer. Color the FAIZAN portion in a warm Malta-orange accent and the `-MD` portion in white. Make the Copy button solid red with white icon and text, and only enable it after a pairing code is successfully returned. Keep the layout phone-first, readable and uncluttered, with small motion only for loading and server health feedback; respect reduced-motion preferences.

## Project structure

- `index.html` — accessible single-page pairing form and visible server selector.
- `styles.css` — responsive FAIZAN-MD theme, interaction states, and the requested brand colors.
- `app.js` — server availability check, auto/manual selection, phone normalization, pairing request, result and copy handling.
- `src/servers.mjs` — five editable server slots; two supplied URLs and three blank slots.
- `src/pairing-core.mjs` — pure phone, URL and Auto Server selection helpers.
- `manus-routes.json` — declare the single `/` page route.
- `README.md` — setup, adding the remaining server URLs, API/CORS requirements and GitHub-to-Vercel deployment steps.
- `plan.md` and `TODO.md` — implementation plan and outcome tracking.
- `test/pairing-core.test.mjs` — focused regression checks for phone and server selection helpers.
