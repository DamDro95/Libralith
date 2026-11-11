# SearchField

The archive-wide search: a chamfered `void-200` field with a line icon and mono placeholder text.

## Rules

- Control chamfer at `chamfer-m`; height 44px in headers, 48px in page bodies.
- Placeholder and input text in `mono` at 13px. Placeholder copy speaks in the system voice: "Query the archive".
- On focus the field shifts to `select-music` and the icon to `seam`; no glow.
- Always keep a real `<label>` (visually hidden is fine).
- The consumer provides the submit behaviour and results.
