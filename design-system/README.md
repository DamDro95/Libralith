<!-- Copy of the Libralith design system kept on claude.ai: https://claude.ai/artifact/HiCUXsZV5dQjMvmVp3DXUZ
     This repo copy is what the code uses. When the design changes, update both. -->

# Libralith

Libralith is a personal media library for music, podcasts, video, photos, books, comics and (later) games, designed as an ancient megastructure: colossal dark monoliths, small human-scale interface, and a single line of light running through it all. This is the **Monolith** style.

## Principles

1. **Scale is the story.** Forms are huge, interface is small. Heroes use towering slabs and `display-xl` type; controls stay compact and precise. A tiny figure or object at the base of a slab sells the size.
2. **Light is signal.** Colour lives in thin lines — the seam (`seam`, `stroke-seam`, `glow-seam`) — not in big fills. If something glows, it means *active*, *current* or *go*.
3. **Cut, don't round.** Corners are square (`radius-none`) or chamfered (`chamfer-s` … `chamfer-xl`). Never pills, never soft rounded cards. `radius-disc` is for true discs only.
4. **Each vault has one colour.** Every media type is its own vault with its own colour (see Vaults). A screen inside a vault uses its colour for seams, labels and progress; the rest stays in void and ink.
5. **The system speaks in labels; people read sentences.** Mono uppercase `label` text is the machine's voice. Titles and body copy are plain, human sentence case.

## Colour

The ground is always `void-000`. Panels step up through `void-100` and `void-200`; slabs fade from `void-300` down to `void-100`.

| Use | Token |
|---|---|
| Page | `void-000` |
| Panels, player bar, session terminals | `void-100` |
| Inputs, icon buttons, highlight cards | `void-200` |
| Primary text | `ink` |
| Secondary text | `ink-muted` |
| System labels, inactive nav | `ink-subtle` |
| Control borders, slab strata | `line-strong` |
| Decorative dividers | `line-100`, `line-200` |
| Primary action, focus, current | `seam` with text in `on-seam` |

Rules:
- Never fill a large area with a vault colour. Its biggest use is a primary button.
- The current item in a list gets a `stroke-seam` left edge in the vault colour over that vault's `select-*` background (e.g. `select-music`).
- `line-100` and `line-200` are too faint for control edges; use `line-strong` on anything clickable that has a border.

## Vaults

Each media type is a vault, numbered in this order:

| No. | Vault | Colour token | Hex | Current-row background |
|---|---|---|---|---|
| 01 | Music | `vault-music` (= `seam`) | #7fe6ff cyan | `select-music` |
| 02 | Podcasts | `vault-podcasts` | #ff9d7a coral | `select-podcasts` |
| 03 | Video | `vault-video` | #b9a4ff violet | `select-video` |
| 04 | Photos | `vault-photos` | #8ef2b5 mint | `select-photos` |
| 05 | Books | `vault-books` | #ffc46b amber | `select-books` |
| 06 | Comics | `vault-comics` | #ff8ad8 pink | `select-comics` |
| 07 | Games | `vault-games` | #d6ef6a lime | `select-games` |

Games stay **sealed** until they are supported. Every vault colour has at least 9:1 contrast on `void-000` and `void-100`, and `on-seam` text works on all of them, so any vault colour can fill a primary button inside its vault. Seven colours can't all be told apart by lightness, so a vault colour is never the only signal: always pair it with the vault's name or label.

## Typography

Four families, all open source (SIL Open Font License) and self-hosted:

- **Chakra Petch** (`display`): angular and engineered. Headlines uppercase with open tracking (`display-xl`, `display-l`, `heading`); titles in sentence case (`title`). The wordmark is `wordmark`: uppercase, 0.32em tracking.
- **Inter** (`sans`): everything people read in the UI (`body-l`, `body`, `body-s`).
- **IBM Plex Mono** (`mono`): the system voice (`label`, `readout`). Times, counts, file formats, breadcrumbs.
- **Source Serif 4** (`serif`): long-form reading only (`reading`), in the ebook reader, max 640px wide.

Never load them from Google Fonts or any other CDN: Libralith must work offline. The web client bundles them from Fontsource npm packages (`@fontsource/chakra-petch`, `@fontsource-variable/inter`, `@fontsource/ibm-plex-mono`, `@fontsource-variable/source-serif-4`), imported in `server/resources/css/app.css`.

## Shape

Chamfers are cut with `clip-path`. Two patterns:

- **Slab** (one corner, top-left): `clip-path: polygon(0 var(--chamfer-l), var(--chamfer-l) 0, 100% 0, 100% 100%, 0 100%)`. Vault cards, album slabs, poster tiles.
- **Control** (two opposite corners): `clip-path: polygon(var(--chamfer-m) 0, 100% 0, 100% calc(100% - var(--chamfer-m)), calc(100% - var(--chamfer-m)) 100%, 0 100%, 0 var(--chamfer-m))`. Primary buttons, search, the play button, the video frame.

`clip-path` hides borders at the cut, so chamfered elements are filled, not outlined. Bordered elements (secondary buttons) stay square.

## Spacing and layout

An 8px rhythm with a few larger steps: `space-1` to `space-8`. Desktop pages use `space-6` gutters and a 1320–1376px max width. Sections are separated by `space-8`. Lists are dense: rows are 52px tall (56px for the current row) with `line-100` dividers.

Pages are fluid: side panels stack under the main column on narrow screens; tables and shelf rows scroll horizontally in their own box.

## Light and motion

- One main seam per hero, with `glow-seam`. Small seams use `glow-soft`.
- A thin horizontal `horizon` line is the floor slabs stand on, often with a faint seam-coloured haze rising from it.
- Motion, when used, is slow: seams can pulse brightness over 3–4 seconds. Respect reduced-motion settings and keep everything readable when still.

## Iconography

Line icons, 1.5–2px stroke, square or butt caps, drawn on a 24px grid, coloured `ink` (or the vault colour when active). No filled glyph sets, no emoji. Icon-only buttons are 44px square minimum and always carry an `aria-label`.

The current logo mark is a placeholder: two angled brackets with a vertical seam bar between them, beside the `wordmark`. A finished mark has not been designed yet; until then use the wordmark alone where possible.

## Voice

- Labels: terse and system-like. `VAULT 01 · MUSIC`, `SYS // ARCHIVE ONLINE`, `ACTIVE SESSIONS`, `03 ACTIVE`.
- Headlines: short, monumental, uppercase. `THE ARCHIVE`, `VAULTS`.
- Body: warm and plain. "Every song, film and book you own, held in one structure older and larger than you need it to be."
- Theme: dark only. There is no light theme.
- Vocabulary: library sections are **vaults**, in-progress items are **sessions**, unreleased formats are **sealed**.

## Accessibility

- Text pairs used here all meet 4.5:1 on `void-000` and `void-100`, including `ink-subtle` labels.
- Vault colours are never the only signal; always pair them with a text label.
- Focus rings: 2px `seam` outline, 2px offset.
- Touch targets 44px minimum.
