# Prompt Practice by Coded Female

A small, untimed browser game for writing clearer AI prompts. Six fictional scenarios connect prompting to coding, product management, Agile and communication. Players choose three useful additions, read the reasoning and take away an example prompt. A final prompt builder and downloadable notes help turn the lesson into practice.

## Run

Open `index.html` in a modern browser. No installation, build step, API key or account is needed. For a local preview, run `python3 -m http.server 8000` from this folder and visit `http://localhost:8000`.

## Upload to GitHub Pages

1. Create a repository named `prompt-practice` in your GitHub account.
2. Upload the contents of this folder, including `assets/`. Keep `index.html` at the repository root.
3. In **Settings → Pages**, choose **Deploy from a branch**, then `main` and `/ (root)`.
4. Save and wait for GitHub to show the published URL.

For the `codedfemale-dev` account, the expected address is `https://codedfemale-dev.github.io/prompt-practice/`. This is an expected address, not confirmation of publication. Link to the verified address from a Coded Female blog post or learning page.

## How the game works

- Six rounds with five shuffled choices and three useful additions per round.
- One point for each useful detail selected; up to 18 points.
- Explanations cover every option, including the choices left out.
- Progress and drafts stay in memory and reset on reload or replay.
- The prompt builder joins the visitor’s own instructions. It does not send them to an AI model.
- Copying uses the clipboard where available, with a manual selection fallback.
- The notes download contains the player’s selections, takeaways and example prompts.

The scoring is a curated learning exercise, not an automated judgement of an arbitrary prompt. Different phrasing can work well. Clear prompts do not guarantee accurate AI output.

## Brand and accessibility

Uses Coded Female’s gold `#CA9B52`, charcoal `#191919`, cream `#FAF8F4` and white identity. Open Sans and Playfair Display are served locally. The header is a text link, not a replacement logo. Native form controls, keyboard focus, a skip link, live status messages, responsive layouts and reduced-motion preferences are supported.

No analytics, cookies, external font requests, backend or browser storage. The only external links point to Coded Female.

## Edit

Teaching content lives in `challenges.js`, behaviour in `script.js`, layout in `style.css`. Keep exactly three useful choices per challenge, make feedback specific and label all invented scenarios as fictional. Add original logo artwork only if Georgia supplies or verifies it.

## Checks

Run `node --test tests.cjs` for content consistency, linked assets and page wiring. Browser checks should also cover all six rounds, partial scores, the three-choice limit, copying, notes download, prompt building, replay, keyboard use and a narrow phone viewport.

## Font licences

The local font files use the SIL Open Font License. See `assets/OFL-open-sans.txt` and `assets/OFL-playfair-display.txt`.
