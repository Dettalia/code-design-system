// Image imports resolve to a URL: Vite (Storybook) serves the file, and
// examples/build.mjs inlines it as a data URL.
declare module '*.svg' {
  const src: string;
  export default src;
}

declare module '*.png' {
  const src: string;
  export default src;
}
