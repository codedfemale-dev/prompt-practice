# Verification

Checked locally on 10 October 2026. No GitHub upload or public deployment has been performed.

## Passed

- JavaScript syntax check.
- Three automated checks: all six challenges have three useful choices and full explanations; linked assets and font licences exist; script targets match unique page identifiers.
- Browser playthrough of all six challenges, with a mixed first answer and five perfect answers. Final total correctly showed 17 of 18.
- Fourth-choice rejection, disabled checking before three selections, and locked answers after checking.
- Example prompt copying showed the successful copied state.
- Notes download returned `coded-female-prompt-notes.txt`.
- Personal prompt builder combined the task, context and format while omitting the empty limits field.
- Replay reset the game to challenge one with checking disabled.
- Keyboard Space selected a checkbox and updated the count.
- Intro and challenge layout at 1280 pixels wide; challenge and builder layout at 390 pixels wide. Document width matched the viewport in the checked states.
- No browser warnings or errors in the inspected log.

## Limits

The clipboard fallback is implemented but was not exercised because browser copying succeeded. This was a local browser check, not a full cross-browser or screen-reader audit. GitHub Pages must be checked after upload.
