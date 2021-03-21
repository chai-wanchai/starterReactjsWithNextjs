const packageJSON = require('./package.json')

module.exports = {
  useFileSystemPublicRoutes: false,
  publicRuntimeConfig: {
    env: process.env.NODE_ENV,
    appVersion: packageJSON.version,
  }
}