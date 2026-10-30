# TODO — FAIZAN-MD Pairing Panel

## Pairing-code page and FAIZAN-MD presentation
- [ ] The site remains a FAIZAN-MD WhatsApp pairing-code panel based on the supplied Heroku page and retains its dark navy/purple visual direction; use the exact wordmark `𝐅αɪᴢαɴ-𝐌ᴅ⎯꯭̽` in both the top and bottom, with `𝐅αɪᴢαɴ` in Malta-orange and `-𝐌ᴅ⎯꯭̽` in white.
- [ ] The placeholder and helper example show `923266105873` as static text only; the page does not submit it automatically.
- [ ] A visitor can enter a WhatsApp number with its country code, request a pairing code from the chosen server using `GET /code?number=<digits>`, view the returned code, and use the Copy button after the code is received.
- [ ] The visible Copy button is solid red with a white icon and text; it is enabled only after a successful code response, and copying provides clear success or failure feedback.
- [x] The page shows clear loading, success, and error states; it does not save the visitor's phone number or pairing code.

## Five servers, Auto Server, and manual selection
- [ ] The panel has five editable server slots. Slot 1 contains the supplied `https://freebot07-d877ac2d7885.herokuapp.com/` server; slot 2 contains the supplied `https://web-production-461bb3.up.railway.app/` server; slots 3–5 are empty for the user to add URLs later.
- [x] Only configured servers are available in the manual selector. The visitor can choose a server manually or use Auto Server to choose an available configured server.
- [x] A pairing request is sent only once to the selected server. A server is compatible when it exposes the expected `/code?number=` API and permits browser CORS from the panel origin.
- [ ] README instructions identify the exact file where the user can add the remaining three server URLs and explain the `/code` and CORS requirements for each added backend.

## Repository identity and Vercel auto-deployment
- [ ] Rename the panel repository and Vercel project/domain to the URL-safe ASCII slug `kashmiri-jutt`, corresponding to the requested human-readable name `𝐊αѕнмιяι-𝐉υтт⎯꯭̽`; preserve the existing FAIZAN-MD page wordmark. GitHub/Vercel URLs must use the ASCII slug, not the decorative Unicode characters.
- [x] The source is organized as a lightweight static website in the private GitHub repository, ready to deploy on Vercel.
- [x] The website source is on the repository's `main` branch without overwriting supplied servers or other user changes.
- [x] The project is imported into Vercel from the private GitHub repository and deployed to its Production environment; GitHub `main` pushes trigger Vercel deployment.
