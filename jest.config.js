require('dotenv').config({ path: '.env.test' })

module.exports = {
  preset: 'ts-jest',
  roots: [
    "<rootDir>/src"
  ],
  testEnvironment: 'node',
  collectCoverage: true,
  coverageReporters: ['json', 'html', 'text']
}
