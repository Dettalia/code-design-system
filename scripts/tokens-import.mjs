// Reassembles the paged Figma export saved under tokens/.figma-export/,
// verifies its checksum, and writes tokens/figma-export.json.
// Usage: npm run tokens:import
import {existsSync, readdirSync, readFileSync, rmSync, writeFileSync} from 'node:fs';
import {join} from 'node:path';
import {assemblePages} from './lib/token-export.mjs';

const PAGES_DIR = 'tokens/.figma-export';
const OUTPUT = 'tokens/figma-export.json';

if (!existsSync(PAGES_DIR)) {
  console.error(`No ${PAGES_DIR}/ directory. Run the Figma export first (see /sync-figma-tokens).`);
  process.exit(1);
}

const files = readdirSync(PAGES_DIR).filter(f => /^page-\d+\.json$/.test(f));
let result;
try {
  const pages = files.map(f => JSON.parse(readFileSync(join(PAGES_DIR, f), 'utf8')));
  result = assemblePages(pages);
} catch (error) {
  console.error(`Import failed: ${error.message}`);
  process.exit(1);
}

writeFileSync(OUTPUT, JSON.stringify(result.tokens, null, 2) + '\n');
rmSync(PAGES_DIR, {recursive: true});

const {summary, warnings} = result;
console.log(`Wrote ${OUTPUT} (checksum ${result.tokens.$metadata.checksum} verified).`);
if (summary) {
  console.log(
    `  ${summary.variables} variables, ${summary.textStyles} text styles, ${summary.shadows} shadows` +
      ` (${summary.ignoredPaintStyles} paint styles ignored).`,
  );
}
for (const warning of warnings) console.warn(`  warning: ${warning}`);
