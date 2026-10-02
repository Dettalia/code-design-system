// Types for token-export.mjs, for the TypeScript tests that import it.
export interface ExportPage {
  page: number;
  pageCount: number;
  checksum: string;
  summary?: {variables: number; textStyles: number; shadows: number; ignoredPaintStyles: number};
  warnings?: string[];
  entries: [string, string | null, unknown][];
}

// The token document is arbitrary nested JSON; tests index into it freely.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TokenDocument = Record<string, any>;

export function checksum(str: string): string;
export function assemblePages(pages: ExportPage[]): {
  tokens: TokenDocument;
  summary: ExportPage['summary'];
  warnings: string[];
};
export function flattenTokens(
  node: unknown,
  path?: string[],
  out?: Record<string, unknown>,
): Record<string, unknown>;
export function diffTokens(
  before: unknown,
  after: unknown,
): {added: string[]; removed: string[]; changed: string[]; markdown: string};
