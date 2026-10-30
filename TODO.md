# TODO — FAIZAN-MD Pairing Panel

## Pairing-code page and existing FAIZAN-MD presentation
- [x] The new site is a FAIZAN-MD WhatsApp pairing-code panel based on the supplied Heroku page and follows its dark navy/purple FAIZAN-MD visual direction.
- [x] A visitor can enter a WhatsApp number with its country code, request a pairing code from the chosen server using `GET /code?number=<digits>`, view the returned code, and copy it.
- [x] The page shows clear loading, success, and error states; it does not save the visitor's phone number or pairing code.

## Five servers, Auto Server, and manual selection
- [x] The panel has five editable server slots. Slot 1 contains the supplied `https://freebot07-d877ac2d7885.herokuapp.com/` server; slots 2–5 are empty for the user to add their own server URLs later.
- [x] Only configured servers are available in the manual selector. The visitor can choose a server manually or use Auto Server to choose an available configured server.
- [x] A pairing request is sent only once to the selected server. A server is compatible when it exposes the expected `/code?number=` API and permits browser CORS from the panel origin.

## Private GitHub repository and Vercel-ready handoff
- [x] The source is organized as a lightweight static website ready to import from the new private GitHub repository into Vercel.
- [x] README instructions identify the exact file where the user can add the remaining four server URLs and explain the `/code` and CORS requirements for each added backend.
- [ ] The new private GitHub repository is created/connected only through the project GitHub confirmation flow, and the website source is pushed to its main branch without overwriting the supplied server or other user changes.
