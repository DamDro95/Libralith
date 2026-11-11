# Button

Chamfered primary buttons carry the one main action on a screen; square outlined secondary buttons and chamfered icon buttons cover the rest.

## Variants

- **Primary**: `seam` fill (or the current vault colour), `on-seam` text, control chamfer at `chamfer-m`. One per view.
- **Secondary**: transparent, 1px `line-strong` border, `ink` text. Square, because `clip-path` would cut the border.
- **Icon**: 44–52px square, `void-200` fill, control chamfer at `chamfer-s`. Always has an `aria-label`.

## Rules

- Labels in `display` at 15px, uppercase, 0.16em tracking. Two or three words.
- Height 52px on desktop, 44px minimum anywhere.
- Focus: 2px `seam` outline, 2px offset.
- The consumer provides the label, the click handler and, inside a vault, the vault colour for the primary fill.
