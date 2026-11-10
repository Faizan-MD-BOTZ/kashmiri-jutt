# TODO — FAIZAN-MD Pairing Panel

## Pairing-code page and FAIZAN-MD presentation
- [x] The site remains a FAIZAN-MD WhatsApp pairing-code panel based on the supplied Heroku page and retains its dark navy/purple visual direction; use the exact wordmark `𝐅αɪᴢαɴ-𝐌ᴅ⎯꯭̽` in both the top and bottom, with `𝐅αɪᴢαɴ` in Malta-orange and `-𝐌ᴅ⎯꯭̽` in white.
- [x] The placeholder and helper example show the user-approved phone number `923266105873` as static text only; the page does not submit it automatically.
- [x] A visitor can enter a WhatsApp number with its country code, request a pairing code from the chosen server using `GET /code?number=<digits>`, view the returned code, and use the Copy button after the code is received.
- [x] The visible Copy button is solid red with a white icon and text; it is enabled only after a successful code response, and copying provides clear success or failure feedback with a fallback when browser clipboard permission is denied.
- [x] The page shows clear loading, success, and error states; it does not save the visitor's phone number or pairing code.

## Seven visible slots, Auto Server, and manual selection
- [x] The panel has seven visible slots, all mapped to the approved endpoint `https://mishumd-998dc798c50a.herokuapp.com/`. The former server URLs were removed from the panel configuration.
- [x] Only configured servers are available in the manual selector. The visitor can choose a server manually or use Auto Server to choose an available configured server.
- [x] A pairing request is sent only once to the selected server. A server is compatible when it exposes the expected `/code?number=` API and permits browser CORS from the panel origin; health checks send no phone number.
- [x] README instructions identify `src/servers.mjs` as the exact file where all seven slots are configured and explain the approved `/code` and CORS requirements.
- [ ] The updated seven-slot panel is committed to the currently bound repository's `main` branch; the current production URL is checked after deployment to confirm it serves the updated server choices.

## Existing bot-server release
- [x] Deploy the bot repository's pushed `main` commit `46ae5be` (`Raise audio and video download caps to 70 MB`) to the already-existing Heroku apps `freebot07`, `fazi007`, `fazi008`, and `fazi009`; verify each app's `/health` returns HTTP 200 after deployment. Do not create more Heroku apps or change the MongoDB URL or bot configuration.

## Repository identity and Vercel deployment
- [x] The approved public project/domain uses the URL-safe slug `kashmiri-jutt`, corresponding to the requested human-readable name `𝐊αѕнмιяι-𝐉υтт⎯꯭̽`; the panel retains the FAIZAN-MD wordmark.
- [x] The source is organized as a lightweight static website in the existing GitHub repository, ready for static hosting.
- [ ] The user-provided tutorial video link is added to the panel's Tutorial section when the user supplies that link.
