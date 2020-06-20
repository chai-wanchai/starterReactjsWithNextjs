import config from '../../config'

export default (server) => {

  /** @route api logout price-engine */
  server.post('/logout', async (req, res) => {

    res.clearCookie(config.authKey, { path: '/' })

    res.end()
    
  })

}