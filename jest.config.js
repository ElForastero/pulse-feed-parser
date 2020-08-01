const { createJestConfig } = require('tsdx/dist/createJestConfig');
const { paths } = require('tsdx/dist/constants');

process.env.BABEL_ENV = 'test';
process.env.NODE_ENV = 'test';

module.exports = createJestConfig(undefined, paths.appRoot);
