# Kashmiri Jutt — FAIZAN-MD Pairing Panel

Human-readable project name: `𝐊αѕнмιяι-𝐉υтт⎯꯭̽`. The panel's on-page wordmark remains **FAIZAN-MD**.

A lightweight static WhatsApp pairing-code page with Auto Server and manual server selection. It calls one selected Heroku or Railway endpoint directly from the browser; it does not run another bot session or save the submitted phone number or returned code.

## Server slots

The panel has seven visible slots configured in [`src/servers.mjs`](src/servers.mjs). All seven slots now use the approved pairing endpoint; the former server URLs have been removed.

| Slot | Server | Base URL |
| --- | --- | --- |
| Server 1 | Approved Heroku server | `https://mishumd-998dc798c50a.herokuapp.com/` |
| Server 2 | Approved Heroku server | `https://mishumd-998dc798c50a.herokuapp.com/` |
| Server 3 | Approved Heroku server | `https://mishumd-998dc798c50a.herokuapp.com/` |
| Server 4 | Approved Heroku server | `https://mishumd-998dc798c50a.herokuapp.com/` |
| Server 5 | Approved Heroku server | `https://mishumd-998dc798c50a.herokuapp.com/` |
| Server 6 | Approved Heroku server | `https://mishumd-998dc798c50a.herokuapp.com/` |
| Server 7 | Approved Heroku server | `https://mishumd-998dc798c50a.herokuapp.com/` |

Keep each configured server's `id` stable. The selector checks configured endpoints; servers returning HTTP 404, failing CORS, or otherwise unreachable are marked unavailable and cannot be selected. Auto Server chooses from reachable configured endpoints; manual mode lets the visitor choose an available endpoint. A pairing request goes once to one selected server—there is no cross-server retry, to avoid duplicate pairing attempts.

Each usable backend must support `GET /code?number=<digits>` and return JSON containing a non-empty `code` field on success. It must permit browser CORS from the panel origin. The availability check uses `GET /code` without a number; it must not create a pairing session or send a code. Do not test pairing endpoints with a real phone number during deployment checks.

The approved Heroku endpoint is used for every visible slot and should pass the no-number `/code` and CORS check before production use.

## Bot release update

The bot repository's current `main` contains commit `46ae5be` (`Raise audio and video download caps to 70 MB`). Heroku Activity confirms that commit was deployed successfully to the existing apps `freebot07`, `fazi007`, `fazi008`, and `fazi009`; each `/health` endpoint returned HTTP 200 afterward. No additional Heroku apps were created. The shared MongoDB URL and bot configuration were left unchanged.

## Vercel Production

The public project is named `kashmiri-jutt` and the production URL is <https://kashmiri-jutt.vercel.app/>. Preserve the currently connected GitHub/Vercel project binding. Vercel's static **Other** preset serves the repository root containing `index.html`, `styles.css`, `app.js`, and `src/`.

The form's example number `923266105873` is static helper text; a pairing request is sent only when a visitor submits the form. The page does not write the number or returned code to local storage, cookies, or analytics.
