// Helpers shared by the token import/diff scripts and their tests.
// The checksum must match `checksum()` in figma/export-tokens.js.

// 32-bit FNV-1a over the JSON text. Not cryptographic, just a transcription check.
export function checksum(str) {
  let hash = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash.toString(16).padStart(8, '0');
}

// Rebuilds the token document from the pages returned by figma/export-tokens.js
// and verifies it against the export's checksum. Throws with a specific reason
// if a page is missing, duplicated, from a different export, or altered.
export function assemblePages(pages) {
  if (pages.length === 0) throw new Error('No export pages found.');
  const {pageCount, checksum: expected} = pages[0];
  const byIndex = new Map();
  for (const p of pages) {
    if (p.checksum !== expected || p.pageCount !== pageCount) {
      throw new Error(
        `Page ${p.page} comes from a different export run (checksum ${p.checksum}, expected ${expected}). Re-run every page.`,
      );
    }
    if (byIndex.has(p.page)) throw new Error(`Page ${p.page} appears twice.`);
    byIndex.set(p.page, p);
  }
  const missing = [];
  for (let i = 0; i < pageCount; i++) if (!byIndex.has(i)) missing.push(i);
  if (missing.length) throw new Error(`Missing page(s) ${missing.join(', ')} of ${pageCount}.`);

  const tokens = {};
  for (let i = 0; i < pageCount; i++) {
    for (const [top, sub, value] of byIndex.get(i).entries) {
      if (sub === null) tokens[top] = value;
      else (tokens[top] ??= {})[sub] = value;
    }
  }
  const actual = checksum(JSON.stringify(tokens));
  if (actual !== expected) {
    throw new Error(
      `Checksum mismatch: reassembled export hashes to ${actual}, Figma reported ${expected}. A page was altered while being saved. Re-save the pages exactly as returned.`,
    );
  }
  tokens.$metadata = {...tokens.$metadata, checksum: expected};
  return {tokens, summary: byIndex.get(0).summary, warnings: byIndex.get(0).warnings ?? []};
}

// Flattens a token document to {"color.text.primary": <$value>, ...}.
// Also reads the legacy `value` key so diffs against older exports work.
export function flattenTokens(node, path = [], out = {}) {
  if (node === null || typeof node !== 'object') return out;
  if ('$value' in node || 'value' in node) {
    out[path.join('.')] = '$value' in node ? node.$value : node.value;
    return out;
  }
  for (const [key, child] of Object.entries(node)) {
    if (key.startsWith('$') || key.startsWith('_')) continue;
    flattenTokens(child, [...path, key], out);
  }
  return out;
}

const show = value => (typeof value === 'string' ? value : JSON.stringify(value));

// Markdown summary of token changes, for PR descriptions and changesets.
export function diffTokens(before, after) {
  const a = flattenTokens(before);
  const b = flattenTokens(after);
  const added = Object.keys(b).filter(k => !(k in a));
  const removed = Object.keys(a).filter(k => !(k in b));
  const changed = Object.keys(b).filter(k => k in a && show(a[k]) !== show(b[k]));
  const lines = [];
  const section = (title, keys, render) => {
    if (keys.length === 0) return;
    lines.push(`### ${title} (${keys.length})`, '');
    for (const k of keys) lines.push(`- ${render(k)}`);
    lines.push('');
  };
  section('Added', added, k => `\`${k}\`: \`${show(b[k])}\``);
  section('Removed', removed, k => `\`${k}\` (was \`${show(a[k])}\`)`);
  section('Changed', changed, k => `\`${k}\`: \`${show(a[k])}\` → \`${show(b[k])}\``);
  return {
    added,
    removed,
    changed,
    markdown: lines.length ? lines.join('\n') : 'No token changes.\n',
  };
}
