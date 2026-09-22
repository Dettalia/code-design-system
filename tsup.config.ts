import {defineConfig} from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  target: 'es2019',
  dts: true,
  sourcemap: true,
  clean: true,
  splitting: false,
  external: ['react', 'react-native'],
});
