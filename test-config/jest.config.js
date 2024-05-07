const {Browser} = require('selenium-webdriver');
/**
  Copyright (c) 2015, 2024, Oracle and/or its affiliates.
  Licensed under The Universal Permissive License (UPL), Version 1.0
  as shown at https://oss.oracle.com/licenses/upl/

*/
/** @type {import('@jest/types').Config.InitialOptions} */
const jestE2eConfig = {
  rootDir: process.cwd(),
  preset: "@oracle/oraclejet-jest-preset",
  testMatch: [
      "<rootDir>/e2e/**/__tests__/**/*.spec.ts"
  ],
  setupFiles: [
    "<rootDir>/test-config/e2e/testSetup.ts"
  ],
  testEnvironment: '<rootDir>/test-config/e2e/custom-environment.ts',
  testEnvironmentOptions: {
    browser: Browser.CHROME,
    headless: true
  }
};

/** @type {import('@jest/types').Config.InitialOptions} */
const config = {
    rootDir: process.cwd(),
    preset: "@oracle/oraclejet-jest-preset",
    moduleNameMapper: {},
    setupFiles: [
      "<rootDir>/test-config/testSetup.ts"
    ],
    testMatch: [
      "<rootDir>/src/**/__tests__/**/*.spec.tsx"
    ],
    collectCoverageFrom: [
      "<rootDir>/src/components/**/*.tsx",
      "!<rootDir>/src/**/(resources)/**/*.js", 
      "!<rootDir>/src/**/(__tests__)/**/*.tsx"
    ],
    coverageThreshold: {
      global: {
        branches: 100,
        functions: 100,
        lines: 100,
        statements: 100
      }
    }
}

module.exports = {
  projects: [{
    displayName: 'e2e',
    ...jestE2eConfig
  }, {
    ...config
  }]
}