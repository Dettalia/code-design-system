// Exports design tokens from the Bliro Design System Figma file.
//
// Runs inside Figma via the Plugin API: `/sync-figma-tokens` passes this file's
// contents to the Figma MCP `use_figma` tool. It is a plain script body (top-level
// `await` and `return`, no imports), not a module. Read-only: it never writes to
// the Figma file. Tested in src/figma/export-tokens.test.ts against a mock `figma`.
//
// What it exports (W3C design-token format: `$type`, `$value`, `$description`):
// - Every local variable, at its collection's default mode. Aliases stay
//   references (`{color.neutral.950}`), so primitive/semantic layering survives.
// - Every local text style under `typography.*`, every shadow effect style
//   under `shadow.*`.
// Paint styles are ignored: in this file they are legacy duplicates of the
// color variables, which are the source of truth.
//
// Paging: tool output is capped (~20 KB), so the result is split into pages.
// The caller prepends `const PAGE = <n>;` (default 0) and saves each page's
// returned object to tokens/.figma-export/page-<n>.json; `npm run tokens:import`
// reassembles them and verifies `checksum` so nothing was lost or altered.

const EXPORTER_VERSION = 1;
const PAGE_BUDGET = 12000; // characters of compact JSON per page

const warnings = [];
const tree = {};

const FONT_WEIGHTS = {
  thin: 100,
  'extra light': 200,
  extralight: 200,
  light: 300,
  regular: 400,
  medium: 500,
  'semi bold': 600,
  semibold: 600,
  bold: 700,
  'extra bold': 800,
  extrabold: 800,
  black: 900,
};

// "Body/Small/SemiBold" -> ['body', 'small', 'semibold'];
// "on primary" -> 'on-primary'.
function toPath(name) {
  return name
    .split('/')
    .map(part => part.trim().toLowerCase().replace(/\s+/g, '-'))
    .filter(Boolean);
}

function round(n, digits = 4) {
  return Number(n.toFixed(digits));
}

function px(n) {
  return `${round(n)}px`;
}

function hex({r, g, b, a = 1}) {
  const channel = c =>
    Math.round(c * 255)
      .toString(16)
      .padStart(2, '0');
  return `#${channel(r)}${channel(g)}${channel(b)}${a < 1 ? channel(a) : ''}`;
}

function setToken(path, token, sourceName) {
  let node = tree;
  for (const key of path.slice(0, -1)) {
    node[key] ??= {};
    if ('$value' in node[key]) {
      throw new Error(
        `"${sourceName}" collides with token ${path.join('.')}: a group and a token share a name.`,
      );
    }
    node = node[key];
  }
  const leaf = path[path.length - 1];
  if (leaf in node) {
    throw new Error(
      `"${sourceName}" collides with another Figma name that normalizes to ${path.join('.')}.`,
    );
  }
  node[leaf] = token;
}

function withDescription(token, description) {
  return description && description.trim() ? {...token, $description: description.trim()} : token;
}

// 32-bit FNV-1a over the JSON text. Not cryptographic, just a transcription check.
function checksum(str) {
  let hash = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash.toString(16).padStart(8, '0');
}

// --- Variables ---------------------------------------------------------------

const collections = await figma.variables.getLocalVariableCollectionsAsync();
const variables = await figma.variables.getLocalVariablesAsync();
const variableById = new Map(variables.map(v => [v.id, v]));
const collectionById = new Map(collections.map(c => [c.id, c]));

for (const c of collections) {
  if (c.modes.length > 1) {
    const defaultMode = c.modes.find(m => m.modeId === c.defaultModeId);
    warnings.push(
      `Collection "${c.name}" has ${c.modes.length} modes; only the default mode "${defaultMode.name}" is exported.`,
    );
  }
}

function variableType(v) {
  const path = toPath(v.name);
  switch (v.resolvedType) {
    case 'COLOR':
      return 'color';
    case 'FLOAT':
      return path.includes('weight') ? 'fontWeight' : 'dimension';
    case 'STRING':
      return path.includes('family') ? 'fontFamily' : 'string';
    default:
      return null;
  }
}

function variableValue(v, value, type) {
  if (type === 'color') return hex(value);
  if (type === 'dimension') return px(value);
  return value;
}

let variableCount = 0;
for (const v of variables) {
  const collection = collectionById.get(v.variableCollectionId);
  const type = variableType(v);
  if (!type) {
    warnings.push(`Skipped "${v.name}": ${v.resolvedType} variables have no token type.`);
    continue;
  }
  const value = v.valuesByMode[collection.defaultModeId];
  let $value;
  if (value && typeof value === 'object' && value.type === 'VARIABLE_ALIAS') {
    const target = variableById.get(value.id);
    if (!target) {
      throw new Error(
        `"${v.name}" aliases a variable that isn't local to this file (e.g. from a library). Export that file's variables too, or make the alias local.`,
      );
    }
    $value = `{${toPath(target.name).join('.')}}`;
  } else {
    $value = variableValue(v, value, type);
  }
  setToken(toPath(v.name), withDescription({$type: type, $value}, v.description), v.name);
  variableCount++;
}

// --- Text styles -------------------------------------------------------------

// Uses the bound variable as a reference when a style property is bound to one.
function boundOr(style, field, fallback) {
  const binding = style.boundVariables && style.boundVariables[field];
  const target = binding && variableById.get(binding.id);
  return target ? `{${toPath(target.name).join('.')}}` : fallback;
}

const textStyles = await figma.getLocalTextStylesAsync();
let textStyleCount = 0;
for (const s of textStyles) {
  const fontWeight = FONT_WEIGHTS[s.fontName.style.toLowerCase()];
  if (fontWeight === undefined) {
    warnings.push(`Skipped text style "${s.name}": unknown font style "${s.fontName.style}".`);
    continue;
  }
  let lineHeight;
  if (s.lineHeight.unit === 'PIXELS') lineHeight = px(s.lineHeight.value);
  else if (s.lineHeight.unit === 'PERCENT') lineHeight = round(s.lineHeight.value / 100);
  else lineHeight = 'normal';

  const letterSpacing =
    s.letterSpacing.unit === 'PERCENT'
      ? `${round(s.letterSpacing.value / 100)}em`
      : px(s.letterSpacing.value);

  const $value = {
    fontFamily: boundOr(s, 'fontFamily', s.fontName.family),
    fontWeight: boundOr(s, 'fontWeight', fontWeight),
    fontSize: boundOr(s, 'fontSize', px(s.fontSize)),
    lineHeight: boundOr(s, 'lineHeight', lineHeight),
    letterSpacing: boundOr(s, 'letterSpacing', letterSpacing),
  };
  if (s.textCase === 'UPPER') $value.textTransform = 'uppercase';

  setToken(
    ['typography', ...toPath(s.name)],
    withDescription({$type: 'typography', $value}, s.description),
    s.name,
  );
  textStyleCount++;
}

// --- Effect styles (shadows) -------------------------------------------------

const effectStyles = await figma.getLocalEffectStylesAsync();
let shadowCount = 0;
for (const s of effectStyles) {
  const shadows = s.effects.filter(
    e => e.visible !== false && (e.type === 'DROP_SHADOW' || e.type === 'INNER_SHADOW'),
  );
  if (shadows.length !== s.effects.filter(e => e.visible !== false).length) {
    warnings.push(
      `Effect style "${s.name}" has non-shadow effects (e.g. blur); only its shadows are exported.`,
    );
  }
  if (shadows.length === 0) continue;
  const $value = shadows.map(e => {
    const shadow = {
      color: hex(e.color),
      offsetX: px(e.offset.x),
      offsetY: px(e.offset.y),
      blur: px(e.radius),
      spread: px(e.spread || 0),
    };
    if (e.type === 'INNER_SHADOW') shadow.inset = true;
    return shadow;
  });
  // "Shadow - modal" -> shadow.modal
  const path = toPath(s.name.replace(/^shadow\s*-\s*/i, ''));
  setToken(['shadow', ...path], withDescription({$type: 'shadow', $value}, s.description), s.name);
  shadowCount++;
}

// --- Output ------------------------------------------------------------------

const paintStyles = await figma.getLocalPaintStylesAsync();

const tokens = {
  $metadata: {
    source: {fileKey: figma.fileKey || null},
    exporter: `figma/export-tokens.js v${EXPORTER_VERSION}`,
  },
  ...tree,
};
const exportChecksum = checksum(JSON.stringify(tokens));

// Entries are [topLevelKey, secondLevelKey | null, value], packed in order.
const entries = [];
for (const [top, value] of Object.entries(tokens)) {
  if (top === '$metadata' || '$value' in value) entries.push([top, null, value]);
  else for (const [sub, child] of Object.entries(value)) entries.push([top, sub, child]);
}
const pages = [[]];
let size = 0;
for (const entry of entries) {
  const entrySize = JSON.stringify(entry).length;
  if (size + entrySize > PAGE_BUDGET && pages[pages.length - 1].length > 0) {
    pages.push([]);
    size = 0;
  }
  pages[pages.length - 1].push(entry);
  size += entrySize;
}

const page = typeof PAGE === 'number' ? PAGE : 0;
if (page < 0 || page >= pages.length) {
  throw new Error(
    `PAGE ${page} is out of range: this export has ${pages.length} pages (0-${pages.length - 1}).`,
  );
}

return {
  page,
  pageCount: pages.length,
  checksum: exportChecksum,
  ...(page === 0
    ? {
        summary: {
          variables: variableCount,
          textStyles: textStyleCount,
          shadows: shadowCount,
          ignoredPaintStyles: paintStyles.length,
        },
        warnings,
      }
    : {}),
  entries: pages[page],
};
