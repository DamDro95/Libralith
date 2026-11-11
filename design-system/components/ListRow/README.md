# ListRow

One stratum in a dense list of tracks, chapters or episodes: mono number, title, mono time, with the current item lit by a seam on its left edge.

## Rules

- Rows 52px tall with a `line-100` divider; the column header uses `label` in `ink-subtle` over a `line-200` rule.
- Current row: 56px, `stroke-seam` left edge in the vault colour, background in the vault's `select-*` colour (e.g. `select-music`), title weight 500, time in the vault colour, a play glyph in place of the number. Mark it with `aria-current`.
- Hover: `void-100` background. No glow on rows.
- Each row is a real `<button>` (or link).
- The consumer provides number, title, time, current state and the vault.
