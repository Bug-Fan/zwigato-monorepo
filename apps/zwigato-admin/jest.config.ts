/* eslint-disable */
export default {
  displayName: 'zwigato-admin',
  preset: '../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../coverage/apps/zwigato-admin',
  collectCoverageFrom: [
    "**/*.service.(t|j)s"
  ],
};
