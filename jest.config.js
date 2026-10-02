module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['@testing-library/jest-dom'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  // Also transform the .mjs helpers under scripts/ that tests import.
  transform: {'\\.[cm]?[jt]sx?$': 'babel-jest'},
  moduleFileExtensions: ['js', 'mjs', 'cjs', 'jsx', 'ts', 'tsx', 'json'],
};
