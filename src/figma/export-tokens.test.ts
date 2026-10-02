/**
 * Runs figma/export-tokens.js against a mock `figma` global and checks the
 * paged output round-trips through scripts/lib/token-export.mjs.
 */
import {readFileSync} from 'fs';
import {join} from 'path';
import {assemblePages, diffTokens} from '../../scripts/lib/token-export.mjs';

const script = readFileSync(join(__dirname, '../../figma/export-tokens.js'), 'utf8');
const AsyncFunction = Object.getPrototypeOf(async () => {}).constructor;

const rgb = (hex: string, a = 1) => ({
  r: parseInt(hex.slice(1, 3), 16) / 255,
  g: parseInt(hex.slice(3, 5), 16) / 255,
  b: parseInt(hex.slice(5, 7), 16) / 255,
  a,
});

type MockOptions = {
  variables?: object[];
  collections?: object[];
  textStyles?: object[];
  effectStyles?: object[];
};

function mockFigma({variables, collections, textStyles, effectStyles}: MockOptions = {}) {
  return {
    fileKey: 'FILEKEY',
    root: {name: 'Document'},
    variables: {
      getLocalVariableCollectionsAsync: async () =>
        collections ?? [
          {
            id: 'c1',
            name: 'Primitives',
            defaultModeId: 'm1',
            modes: [{modeId: 'm1', name: 'Default'}],
          },
          {id: 'c2', name: 'Semantic', defaultModeId: 'm2', modes: [{modeId: 'm2', name: 'Light'}]},
        ],
      getLocalVariablesAsync: async () =>
        variables ?? [
          {
            id: 'v1',
            name: 'color/neutral/950',
            resolvedType: 'COLOR',
            variableCollectionId: 'c1',
            valuesByMode: {m1: rgb('#131a26')},
            description: '',
          },
          {
            id: 'v2',
            name: 'color/text/primary',
            resolvedType: 'COLOR',
            variableCollectionId: 'c2',
            valuesByMode: {m2: {type: 'VARIABLE_ALIAS', id: 'v1'}},
            description: 'a.k.a: Dark - 1',
          },
          {
            id: 'v3',
            name: 'color/border/focus',
            resolvedType: 'COLOR',
            variableCollectionId: 'c2',
            valuesByMode: {m2: rgb('#f26835', 0.3)},
            description: '',
          },
          {
            id: 'v4',
            name: 'spacing/1',
            resolvedType: 'FLOAT',
            variableCollectionId: 'c1',
            valuesByMode: {m1: 4},
            description: '',
          },
          {
            id: 'v5',
            name: 'font/weight/bold',
            resolvedType: 'FLOAT',
            variableCollectionId: 'c1',
            valuesByMode: {m1: 700},
            description: '',
          },
          {
            id: 'v6',
            name: 'color/action/active BG',
            resolvedType: 'COLOR',
            variableCollectionId: 'c2',
            valuesByMode: {m2: rgb('#fef0ea')},
            description: '',
          },
        ],
    },
    getLocalTextStylesAsync: async () =>
      textStyles ?? [
        {
          name: 'Body/Small/SemiBold',
          description: '',
          fontName: {family: 'Inter', style: 'Semi Bold'},
          fontSize: 14,
          lineHeight: {unit: 'PIXELS', value: 24},
          letterSpacing: {unit: 'PERCENT', value: -2},
          textCase: 'ORIGINAL',
          boundVariables: {},
        },
      ],
    getLocalEffectStylesAsync: async () =>
      effectStyles ?? [
        {
          name: 'Shadow - modal',
          description: '',
          effects: [
            {
              type: 'DROP_SHADOW',
              visible: true,
              color: rgb('#131a26', 0.12),
              offset: {x: 0, y: 3},
              radius: 4,
              spread: 0,
            },
            {
              type: 'DROP_SHADOW',
              visible: false,
              color: rgb('#000000'),
              offset: {x: 0, y: 0},
              radius: 1,
              spread: 0,
            },
          ],
        },
      ],
    getLocalPaintStylesAsync: async () => [{name: 'Legacy/Orange'}],
  };
}

async function runPage(figma: object, page?: number) {
  const code = (page === undefined ? '' : `const PAGE = ${page};\n`) + script;
  return new AsyncFunction('figma', code)(figma);
}

async function runAll(figma: object) {
  const first = await runPage(figma, 0);
  const rest = await Promise.all(
    Array.from({length: first.pageCount - 1}, (_, i) => runPage(figma, i + 1)),
  );
  // Simulate saving each page to disk and reading it back.
  return assemblePages([first, ...rest].map(p => JSON.parse(JSON.stringify(p))));
}

describe('figma/export-tokens.js', () => {
  it('exports variables, aliases, text styles and shadows as design tokens', async () => {
    const {tokens, summary, warnings} = await runAll(mockFigma());

    expect(summary).toEqual({variables: 6, textStyles: 1, shadows: 1, ignoredPaintStyles: 1});
    expect(warnings).toEqual([]);
    expect(tokens.$metadata.source).toEqual({fileKey: 'FILEKEY'});
    expect(tokens.color.neutral['950']).toEqual({$type: 'color', $value: '#131a26'});
    expect(tokens.color.text.primary).toEqual({
      $type: 'color',
      $value: '{color.neutral.950}',
      $description: 'a.k.a: Dark - 1',
    });
    expect(tokens.color.border.focus.$value).toBe('#f268354d');
    expect(tokens.color.action['active-bg'].$value).toBe('#fef0ea');
    expect(tokens.spacing['1']).toEqual({$type: 'dimension', $value: '4px'});
    expect(tokens.font.weight.bold).toEqual({$type: 'fontWeight', $value: 700});
    expect(tokens.typography.body.small.semibold.$value).toEqual({
      fontFamily: 'Inter',
      fontWeight: 600,
      fontSize: '14px',
      lineHeight: '24px',
      letterSpacing: '-0.02em',
    });
    expect(tokens.shadow.modal.$value).toEqual([
      {color: '#131a261f', offsetX: '0px', offsetY: '3px', blur: '4px', spread: '0px'},
    ]);
  });

  it('defaults to page 0 when PAGE is not set', async () => {
    const result = await runPage(mockFigma());
    expect(result.page).toBe(0);
  });

  it('splits large exports into pages that reassemble exactly', async () => {
    const variables = Array.from({length: 600}, (_, i) => ({
      id: `v${i}`,
      name: `color/group-${Math.floor(i / 10)}/${i}`,
      resolvedType: 'COLOR',
      variableCollectionId: 'c1',
      valuesByMode: {m1: rgb('#123456')},
      description: 'x'.repeat(40),
    }));
    const figma = mockFigma({variables});
    const first = await runPage(figma, 0);
    expect(first.pageCount).toBeGreaterThan(1);
    const {tokens} = await runAll(figma);
    expect(Object.keys(tokens.color)).toHaveLength(60);
  });

  it('warns about extra modes and exports the default one', async () => {
    const figma = mockFigma({
      collections: [
        {
          id: 'c1',
          name: 'Semantic',
          defaultModeId: 'light',
          modes: [
            {modeId: 'light', name: 'Light'},
            {modeId: 'dark', name: 'Dark'},
          ],
        },
      ],
      variables: [
        {
          id: 'v1',
          name: 'color/bg',
          resolvedType: 'COLOR',
          variableCollectionId: 'c1',
          valuesByMode: {light: rgb('#ffffff'), dark: rgb('#000000')},
          description: '',
        },
      ],
    });
    const {tokens, warnings} = await runAll(figma);
    expect(tokens.color.bg.$value).toBe('#ffffff');
    expect(warnings).toEqual([expect.stringContaining('only the default mode "Light"')]);
  });

  it('fails on names that collide after normalization', async () => {
    const figma = mockFigma({
      variables: [
        {
          id: 'v1',
          name: 'color/On Primary',
          resolvedType: 'COLOR',
          variableCollectionId: 'c1',
          valuesByMode: {m1: rgb('#ffffff')},
          description: '',
        },
        {
          id: 'v2',
          name: 'color/on primary',
          resolvedType: 'COLOR',
          variableCollectionId: 'c1',
          valuesByMode: {m1: rgb('#ffffff')},
          description: '',
        },
      ],
    });
    await expect(runPage(figma, 0)).rejects.toThrow('normalizes to color.on-primary');
  });

  it('fails on aliases to variables outside the file', async () => {
    const figma = mockFigma({
      variables: [
        {
          id: 'v1',
          name: 'color/text',
          resolvedType: 'COLOR',
          variableCollectionId: 'c1',
          valuesByMode: {m1: {type: 'VARIABLE_ALIAS', id: 'library-var'}},
          description: '',
        },
      ],
    });
    await expect(runPage(figma, 0)).rejects.toThrow("isn't local to this file");
  });
});

describe('assemblePages', () => {
  it('rejects a page that was altered while being saved', async () => {
    const figma = mockFigma();
    const page = JSON.parse(JSON.stringify(await runPage(figma, 0)));
    page.entries[1][2]['950'].$value = '#000000'; // ["color", "neutral", {...}]
    expect(() => assemblePages([page])).toThrow('Checksum mismatch');
  });

  it('rejects an incomplete set of pages', () => {
    expect(() => assemblePages([{page: 1, pageCount: 2, checksum: 'abc', entries: []}])).toThrow(
      'Missing page(s) 0 of 2',
    );
  });
});

describe('diffTokens', () => {
  it('lists added, removed and changed tokens', () => {
    const before = {color: {a: {$value: '#000'}, b: {$value: '#111'}}};
    const after = {color: {a: {$value: '#fff'}, c: {$value: '{color.a}'}}};
    const {added, removed, changed, markdown} = diffTokens(before, after);
    expect(added).toEqual(['color.c']);
    expect(removed).toEqual(['color.b']);
    expect(changed).toEqual(['color.a']);
    expect(markdown).toContain('`color.a`: `#000` → `#fff`');
  });
});
