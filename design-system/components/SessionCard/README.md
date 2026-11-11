# SessionCard

A terminal-style panel showing one in-progress item (a session) with its vault, title, time left and a thin progress seam.

## Anatomy

- Panel `void-100`; cards sit edge to edge in a grid separated by 1px `line-200` gaps, like a bank of terminals.
- `label` line: vault name and percentage in the vault colour.
- Title in `title`, meta line in `body-s` / `ink-muted`.
- Progress: `stroke-seam` track in `line-200`, filled in the vault colour. Give it an accessible label ("62 percent read").

## Rules

- Show at most three sessions on home; more go to a full list.
- The card links to the item's player or reader.
- The consumer provides the vault, title, meta text and progress.
