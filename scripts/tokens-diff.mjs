// Prints a Markdown summary of how tokens/figma-export.json differs from a git
// revision (default: HEAD), for the sync PR description and changeset.
// Usage: npm run tokens:diff [-- <git-ref>]
import {execFileSync} from 'node:child_process';
import {readFileSync} from 'node:fs';
import {diffTokens} from './lib/token-export.mjs';

const FILE = 'tokens/figma-export.json';
const ref = process.argv[2] ?? 'HEAD';

let before = {};
try {
  before = JSON.parse(
    execFileSync('git', ['show', `${ref}:${FILE}`], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }),
  );
} catch {
  console.error(`(${FILE} not found at ${ref}; treating every token as added)`);
}
const after = JSON.parse(readFileSync(FILE, 'utf8'));

process.stdout.write(diffTokens(before, after).markdown);
