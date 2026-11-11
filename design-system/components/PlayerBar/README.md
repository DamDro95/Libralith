# PlayerBar

The persistent now-playing bar pinned to the bottom of any screen while audio plays: title, transport controls with a chamfered play button, and a glowing progress seam.

## Rules

- `void-100` background with a `line-200` top border; full width.
- Play/pause is the only chamfered, `seam`-filled control; previous and next are 44px line-icon buttons.
- Progress: `stroke-seam` track in `line-200`, fill in `seam` with `glow-soft`; times in `readout` / `ink-subtle`.
- On phones it collapses to a mini player above the tab bar: art thumbnail, title, play button, with a 1px seam on its top edge.
- The consumer provides the playing item, playback state and handlers.
