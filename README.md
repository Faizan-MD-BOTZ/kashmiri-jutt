# FAIZAN-MD Pairing Panel

A lightweight static WhatsApp pairing-code page with Auto Server and manual server selection. It calls one selected Heroku endpoint directly from the browser; it does not run another bot session or save the submitted phone number/code.

## Add your server URLs

Edit [`src/servers.mjs`](src/servers.mjs). There are exactly five slots. Slot 1 currently contains the Heroku endpoint provided for this project. Add your own HTTPS base URLs to slots 2–5, keeping the array and each slot's `id`/`name` intact:

```js
{ id: 'server-2', name: 'Server 2', baseUrl: 'https://your-second-app.herokuapp.com/' }
```

Leave a slot's `baseUrl` as `''` until it is ready. Empty slots appear disabled in the panel. After editing, commit and push the change; Vercel will deploy the updated configuration from GitHub.

Each configured backend must support:

- `GET /code?number=<digits>` and return JSON containing a non-empty `code` field on success.
- Browser CORS access from the deployed panel origin. The supplied first endpoint currently responds with `Access-Control-Allow-Origin: *`.
- A safe no-number `GET /code` health check. The panel uses this to test reachability without requesting a pairing code.

Auto Server checks configured servers, then selects one reachable server. Manual mode lets the visitor choose a configured server. A pairing request is sent once to one selected server; the page does not retry the request against another server, to avoid generating duplicate pairing attempts.

## Deploy to Vercel

1. Connect the new private GitHub repository to Vercel and import it as a project.
2. Select **Other** as the Framework Preset. This is a static site with no install step and no build step.
3. Leave the Build Command empty and serve the repository root as the Output Directory. The root `index.html`, `styles.css`, `app.js`, and `src/` files are the site.
4. Deploy. Later server URL changes are made in `src/servers.mjs` and redeployed by pushing to the connected branch.

The page only sends the entered digits to the selected backend. It does not write the number or returned code to local storage, cookies, or analytics.
