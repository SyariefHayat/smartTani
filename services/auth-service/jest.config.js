/* eslint-disable no-undef */
/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: 'node',
  transform: {
    '^.+.tsx?$': ['ts-jest', {}],
  },
  setupFiles: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^uuid$': require.resolve('uuid'),
  },
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.test.ts',
    '!src/**/*.d.ts',
    '!src/index.ts',
    '!src/config/*.ts',
  ],
};
