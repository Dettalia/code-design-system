// Builds examples/dist/<name>/index.html from examples/<name>/main.tsx: one
// self-contained page (React, MUI, the Bliro theme, images inlined) that opens
// straight from disk.
// Usage: node examples/build.mjs <name>   (npm run example:card / example:meetings)
import {mkdirSync, writeFileSync} from 'node:fs';
import {build} from 'esbuild';

const PAGES = {
  card: 'Bliro card example',
  meetings: 'My meetings · Bliro',
  companies: 'Companies · Bliro',
};
const name = process.argv[2];
if (!PAGES[name]) {
  console.error(`Usage: node examples/build.mjs <${Object.keys(PAGES).join('|')}>`);
  process.exit(1);
}
const output = `examples/dist/${name}/index.html`;

const result = await build({
  entryPoints: [`examples/${name}/main.tsx`],
  bundle: true,
  write: false,
  format: 'iife',
  minify: true,
  target: 'es2020',
  jsx: 'automatic',
  loader: {'.svg': 'dataurl', '.png': 'dataurl'},
  define: {'process.env.NODE_ENV': '"production"'},
  logLevel: 'warning',
});

// Keep the inline script from being closed early by a "</script" in the bundle.
const script = result.outputFiles[0].text.replace(/<\/script/gi, '<\\/script');

const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${PAGES[name]}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
  </head>
  <body>
    <div id="root"></div>
    <script>${script}</script>
  </body>
</html>
`;

mkdirSync(`examples/dist/${name}`, {recursive: true});
writeFileSync(output, html);
console.log(`Wrote ${output} (${Math.round(html.length / 1024)} KB).`);
