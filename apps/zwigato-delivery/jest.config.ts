/* eslint-disable */
export default {
  displayName: 'zwigato-delivery',
  preset: '../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../coverage/apps/zwigato-delivery',
  collectCoverageFrom: [
    "**/*.service.(t|j)s"
  ],
};
