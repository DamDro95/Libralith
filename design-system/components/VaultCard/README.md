# VaultCard

A tall chamfered slab that opens one section of the library (a vault), marked by a vertical seam in that vault's colour.

## Anatomy

- Slab: gradient `void-300` to `void-100`, slab chamfer (top-left) at `chamfer-l`.
- Seam: `stroke-seam` wide, in that vault's `vault-*` colour (e.g. `vault-music`); `glow-soft` on hover or when it is the vault you were last in.
- Text bottom-aligned: `label` vault number in the vault colour, vault name in `display` at ~30–34px uppercase, a `body-s` count in `ink-muted`.

## Rules

- Lay cards out in a row with **different heights** (e.g. 400 / 460 / 420px) aligned to the bottom, like a skyline. Never equal heights.
- A not-yet-available format is a **sealed** vault: dashed `line-strong` outline, no fill, no seam, text in `ink-subtle`.
- The whole card is one link; give it a focus ring.
- The consumer provides the vault colour, name, count and destination.
