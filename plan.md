# Implementation Plan — FAIZAN-MD Pairing Panel

## Scope and behavior

Create a new FAIZAN-MD WhatsApp pairing-code panel based on the user's current Heroku pairing page. A visitor enters a WhatsApp number with country code, chooses a configured server manually or selects **Auto Server**, requests one pairing code, then copies the returned code. The panel supports five server slots. Slot 1 contains the Heroku URL the user supplied (`https://freebot07-d877ac2d7885.herokuapp.com/`) so it works initially; slots 2–5 are empty for the user to fill in later.

Each slot is configured in `src/servers.mjs` with a display name and base URL. Only configured URLs are selectable; empty slots remain visible as placeholders. Auto Server checks configured endpoints for reachability and chooses one healthy endpoint. It sends the pairing request to only that endpoint. Manual selection uses the chosen endpoint. Pairing requests use the existing `GET /code?number=<digits>` contract. The page does not save phone numbers or pairing codes. Other server URLs must expose a compatible `/code` endpoint and allow browser CORS from the panel origin.

## Implementation and hosting

Use a lightweight static HTML/CSS/JavaScript frontend with no database or application server. Keep the public website files at repository root so Vercel's static **Other** preset can serve them with no build or install step. The page calls each configured Heroku base URL directly in the browser. Include a README explaining how to add the remaining four URLs in `src/servers.mjs`, connect the private GitHub repository to Vercel, and ensure each Heroku backend supports the CORS and endpoint contract. Use the WebDev GitHub connection flow to create/connect the new private repository; the account-owner confirmation card is required before repository creation.

## Design

Follow the supplied FAIZAN-MD pairing page rather than inventing a new visual identity: dark navy-to-purple gradient, a compact translucent rounded card, FAIZAN-MD name/mark, clear number input, primary gradient Pair Code button, visible code result with copy action, and distinct server controls. Keep the layout phone-first, readable and uncluttered. Use small motion only for loading and server health feedback; respect reduced-motion preferences.

## Project structure

- `index.html` — accessible single-page pairing form and visible server selector.
- `styles.css` — responsive FAIZAN-MD theme and interaction states.
- `app.js` — server availability check, auto/manual selection, phone normalization, pairing request, result and copy handling.
- `src/servers.mjs` — five editable server slots; one supplied URL and four blank slots.
- `src/pairing-core.mjs` — pure phone, URL and Auto Server selection helpers.
- `manus-routes.json` — declare the single `/` page route.
- `README.md` — setup, adding servers, API/CORS requirements and GitHub-to-Vercel deployment steps.
- `plan.md` and `TODO.md` — approved design/implementation plan and outcome tracking.
- `test/pairing-core.test.mjs` — focused regression checks for phone and server selection helpers.
