/* eslint-disable */
export default {
  displayName: 'zwigato',
  preset: '../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../coverage/apps/zwigato',
  collectCoverageFrom: [
    '**/*.service.(t)s',
    '!**/log.service.(t)s',
    '!**/email.service.(t)s',
    '!**/geocode.service.(t)s',
  ],
};
