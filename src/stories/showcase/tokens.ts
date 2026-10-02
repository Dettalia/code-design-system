import figmaExport from '../../../tokens/figma-export.json';

export interface ExportedToken {
  path: string;
  type: string;
  /** The value as exported: a literal or an alias like `{color.neutral.950}`. */
  raw: unknown;
  /** The value after following aliases. */
  resolved: unknown;
  /** The alias chain, e.g. ['color.neutral.950'] for color.text.primary. */
  aliases: string[];
  description?: string;
}

type Node = {[key: string]: unknown};

const byPath = new Map<string, {$type: string; $value: unknown; $description?: string}>();

(function collect(node: Node, path: string[]) {
  for (const [key, child] of Object.entries(node)) {
    if (key.startsWith('$') || child === null || typeof child !== 'object') continue;
    const childNode = child as Node;
    if ('$value' in childNode) {
      byPath.set([...path, key].join('.'), childNode as {$type: string; $value: unknown});
    } else {
      collect(childNode, [...path, key]);
    }
  }
})(figmaExport as Node, []);

const ALIAS = /^\{(.+)\}$/;

function resolve(raw: unknown, aliases: string[] = []): {resolved: unknown; aliases: string[]} {
  if (typeof raw === 'string') {
    const match = ALIAS.exec(raw);
    if (match) {
      const target = byPath.get(match[1]);
      if (target) return resolve(target.$value, [...aliases, match[1]]);
    }
  }
  return {resolved: raw, aliases};
}

export const exportedTokens: ExportedToken[] = [...byPath.entries()].map(([path, token]) => ({
  path,
  type: token.$type,
  raw: token.$value,
  description: token.$description,
  ...resolve(token.$value),
}));

export const tokenByPath = new Map(exportedTokens.map(t => [t.path, t]));

export const exportMetadata = (
  figmaExport as {$metadata: {source: {fileKey: string}; checksum: string}}
).$metadata;

/** Tokens under `prefix`, grouped by the next path segment. */
export function groupTokens(prefix: string) {
  const groups = new Map<string, ExportedToken[]>();
  for (const token of exportedTokens) {
    if (!token.path.startsWith(prefix + '.')) continue;
    const group = token.path.slice(prefix.length + 1).split('.')[0];
    if (!groups.has(group)) groups.set(group, []);
    groups.get(group)!.push(token);
  }
  return groups;
}

export const isPrimitive = (token: ExportedToken) => token.aliases.length === 0;

export function shortName(path: string, prefix: string) {
  return path.startsWith(prefix + '.') ? path.slice(prefix.length + 1) : path;
}
