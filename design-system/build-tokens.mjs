// Generates server/resources/css/tokens.css from tokens.json.
// Run from the repo root: node design-system/build-tokens.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const tokens = JSON.parse(readFileSync(join(here, 'tokens.json'), 'utf8'));
const out = join(here, '..', 'server', 'resources', 'css', 'tokens.css');

const value = (v) => {
    const raw = typeof v === 'object' ? Object.values(v)[0] : v;

    return String(raw).replace(/^\{(.+)\}$/, 'var(--$1)');
};

const lines = [];
const section = (title, entries) => {
    lines.push('', `    /* ${title} */`, ...entries.map(([name, v]) => `    --${name}: ${v};`));
};

section('Color', tokens.color.tokens.map((t) => [t.name, value(t.value)]));
section('Font families', Object.entries(tokens.type.families).map(([name, v]) => [`font-${name}`, v]));

const typeVars = [];
for (const group of tokens.type.groups) {
    for (const s of group.styles) {
        typeVars.push([`type-${s.name}-family`, `var(--font-${group.family})`]);
        typeVars.push([`type-${s.name}-size`, s.fontSize]);
        typeVars.push([`type-${s.name}-line-height`, s.lineHeight]);
        typeVars.push([`type-${s.name}-weight`, s.fontWeight]);
        if (s.letterSpacing) {
            typeVars.push([`type-${s.name}-tracking`, s.letterSpacing]);
        }
    }
}
section('Type styles', typeVars);

for (const family of ['spacing', 'radius', 'chamfer', 'stroke', 'shadow']) {
    section(family[0].toUpperCase() + family.slice(1), tokens[family].tokens.map((t) => [t.name, value(t.value)]));
}

const css = `/* Libralith — generated from design-system/tokens.json. Do not edit; run node design-system/build-tokens.mjs */

:root {
    color-scheme: dark;
${lines.join('\n')}
}
`;

writeFileSync(out, css);
console.log(`Wrote ${out}`);
