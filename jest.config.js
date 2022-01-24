const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

/** @type {import('@jest/types').Config.InitialOptions} */
const config = {
  collectCoverageFrom: [
    '<rootDir>/tests/integration/*.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/*.{js,jsx,ts,tsx}',
    '!<rootDir>/src/pages/api/**/*',
    '!<rootDir>/src/pages/poc/**/*',
  ],
  moduleNameMapper: {
    '^@/config/(.*)$': '<rootDir>/src/config/$1',
    '^@/components/(.*)$': '<rootDir>/src/components/$1',
    '^@/services/(.*)$': '<rootDir>/src/services/$1',
    '^@/styles/(.*)$': '<rootDir>/src/styles/$1',
    '^@/redux/(.*)$': '<rootDir>/src/redux/$1',
    '^@/hooks/(.*)$': '<rootDir>/src/hooks/$1',
    '^@/utils/(.*)$': '<rootDir>/src/utils/$1',
    '^@/tests/(.*)$': '<rootDir>/tests/$1',
  },
  bail: true,
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  moduleDirectories: ['node_modules', '<rootDir>/'],
  roots: ['<rootDir>/src/', '<rootDir>/tests/'],
  testMatch: ['**/?(*.)+(spec|test).[jt]s?(x)'],
  testEnvironment: 'jsdom',
};

module.exports = createJestConfig(config);
