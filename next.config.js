const packageJSON = require('./package.json')

module.exports = {
  useFileSystemPublicRoutes: false,
  publicRuntimeConfig: {
    env: process.env.NODE_ENV,
    appVersion: packageJSON.version,
    adfs: {
      signoutUrl: 'https://accessdev.scg.co.th/adfs/ls/?wa=wsignout1.0',
      signoutTarget: 'Secure Payment'
    }
  }
}