// Only used by Jest (via babel-jest). The library build uses tsup/esbuild and
// Storybook uses Vite.
module.exports = {
  presets: [
    ['@babel/preset-env', {targets: {node: 'current'}}],
    ['@babel/preset-react', {runtime: 'automatic'}],
    '@babel/preset-typescript',
  ],
};
