const packageJSON = require('./package.json')
const path = require('path')
module.exports = {
  useFileSystemPublicRoutes: false,
  publicRuntimeConfig: {
    env: process.env.NODE_ENV,
    appVersion: packageJSON.version,
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'src','scss')],
  },
  future: {
    webpack5: true,
  },
}