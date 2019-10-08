module.exports = {
  transform: {
    '^.+\\.jsx?$': `<rootDir>/jest-preprocess.js`,
    '^.+\\.(css|sass)$': '<rootDir>/__mocks__/styleMock.js',
    '^.+\\.svg$': '<rootDir>/__mocks__/svgTransform.js',
    '^.+\\.jpg$': '<rootDir>/__mocks__/jpgTransform.js'
  },
  moduleNameMapper: {
    '@components(.*)$': '<rootDir>/src/components/$1',
    '@shared(.*)$': '<rootDir>/src/components/shared/$1',
    '@helpers(.*)$': '<rootDir>/src/lib/helpers/$1',
    '@services(.*)$': '<rootDir>/src/lib/services/$1',
    '@mocks(.*)$': '<rootDir>/src/lib/mocks/$1',
    '@pages(.*)$': '<rootDir>/src/pages/$1',
    '@assets(.*)$': '<rootDir>/src/assets/$1',
    '@sass(.*)$': '<rootDir>/src/assets/css/$1',
    '@images(.*)$': '<rootDir>/src/assets/images/$1',
    '@comp-sass(.*)$': '<rootDir>/src/assets/css/components/$1',
    '@templates(.*)$': '<rootDir>/src/templates/$1',
    '@redux(.*)$': '<rootDir>/src/redux/$1',
    '.+\\.(css|styl|less|sass|scss)$': `identity-obj-proxy`,
    '.+\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga|ico)$': `<rootDir>/__mocks__/file-mock.js`
  },
  testPathIgnorePatterns: [`node_modules`, `.cache`],
  transformIgnorePatterns: [`node_modules/(?!(gatsby)/)`],
  globals: {
    __PATH_PREFIX__: ``
  },
  testURL: `http://localhost`,
  setupFiles: [`<rootDir>/loadershim.js`],
  coverageReporters: ['json-summary', 'html', 'text'],
  coveragePathIgnorePatterns: ['lib/mocks/*'],
  reporters: [ 'default', 'jest-junit' ]
}
