# Kashmiri Jutt — FAIZAN-MD Pairing Panel

Human-readable project name: `𝐊αѕнмιяι-𝐉υтт⎯꯭̽`. The panel's on-page wordmark remains **FAIZAN-MD**.

A lightweight static WhatsApp pairing-code page with Auto Server and manual server selection. It calls one selected Heroku or Railway endpoint directly from the browser; it does not run another bot session or save the submitted phone number or returned code.

## Server slots

The panel has seven visible slots configured in [`src/servers.mjs`](src/servers.mjs). Five existing endpoints are listed; slots 6 and 7 are intentionally empty because no additional Heroku apps are to be created in this update.

| Slot | Server | Base URL |
| --- | --- | --- |
| Server 1 | Existing Heroku app `freebot07` | `https://freebot07-d877ac2d7885.herokuapp.com/` |
| Server 2 | Existing Railway server | `https://web-production-461bb3.up.railway.app/` |
| Server 3 | Heroku app `fazi007` | `https://fazi007-f531d4510b01.herokuapp.com/` |
| Server 4 | Heroku app `fazi008` | `https://fazi008-d3fb7605adb5.herokuapp.com/` |
| Server 5 | Heroku app `fazi009` | `https://fazi009-9d9a2a67162e.herokuapp.com/` |
| Server 6 | Empty | No URL configured |
| Server 7 | Empty | No URL configured |

Do not create `fazi0001` or `fazi0011` or copy another endpoint into an empty slot. Keep each configured server's `id` stable. The selector checks configured endpoints; servers returning HTTP 404, failing CORS, or otherwise unreachable are marked unavailable and cannot be selected. Auto Server chooses from reachable configured endpoints; manual mode lets the visitor choose an available endpoint. A pairing request goes once to one selected server—there is no cross-server retry, to avoid duplicate pairing attempts.

Each usable backend must support `GET /code?number=<digits>` and return JSON containing a non-empty `code` field on success. It must permit browser CORS from the panel origin. The availability check uses `GET /code` without a number; it must not create a pairing session or send a code. Do not test pairing endpoints with a real phone number during deployment checks.

During the latest safe no-number check, the existing Railway URL returned HTTP 404 without a CORS header, so slot 2 will show as unavailable and cannot be selected until that backend is corrected. The four Heroku endpoints passed the no-number `/code` and CORS check.

## Bot release update

The bot repository's current `main` contains commit `46ae5be` (`Raise audio and video download caps to 70 MB`). Heroku Activity confirms that commit was deployed successfully to the existing apps `freebot07`, `fazi007`, `fazi008`, and `fazi009`; each `/health` endpoint returned HTTP 200 afterward. No additional Heroku apps were created. The shared MongoDB URL and bot configuration were left unchanged.

## Vercel Production

The public project is named `kashmiri-jutt` and the production URL is <https://kashmiri-jutt.vercel.app/>. Preserve the currently connected GitHub/Vercel project binding. Vercel's static **Other** preset serves the repository root containing `index.html`, `styles.css`, `app.js`, and `src/`.

The form's example number `923266105873` is static helper text; a pairing request is sent only when a visitor submits the form. The page does not write the number or returned code to local storage, cookies, or analytics.
