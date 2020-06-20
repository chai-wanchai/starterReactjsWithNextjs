import moment from 'moment'
import config from '../../config'
import { authApi } from '../../src/api/AuthApi'
import authenticateSaml from '../middleware/authenticateSaml'

export default (server, render, passport) => {

   // Section with ADFS ---------------------------

  /** @route middlewere redirect to ADFS */
  server.get('/login/adfs', authenticateSaml(passport))
  /** @route login page with ADFS */
  server.post('/login', authenticateSaml(passport), (req, res) => {
    return render(req, res, '/login-with-adfs', { ...req.query, ...req.user })
  })
  /** @route api login page with ADFS */
  server.post('/login/with/adfs', async (req, res) => {

    const response = await authApi.loginWithADFS('api', req.body.username)

    if (response.isSuccess) {
      res.cookie(config.authKey, response.data.token, {
        path: '/',
        sameSite: 'strict',
        expires: moment().add(1, 'days').toDate(), // 1 day
        httpOnly: true, // Allow javascript create cookie only server-site
        secure: config.envSecure // Allow javascript create cookie only host `https`
      })
    }
    return res.send(response)
  })

  // Section without ADFS -------------------------

  /** @route login page without ADFS */
  server.get('/login', (req, res) => {
    const { cookies } = req

    // Redirect user to home page if user already login
    if (cookies[config.authKey]) { 
      return res.redirect('/')
    }

    return render(req, res, '/login-without-adfs', { ...req.query })
  })
  /** @route api login page without ADFS */
  server.post('/login/without/adfs', async (req, res) => {
    
    const response = await authApi.loginWithoutADFS('api', req.body)

    if (response.isSuccess) {
      res.cookie(config.authKey, response.data.token, {
        path: '/',
        sameSite: 'strict',
        expires: moment().add(1, 'days').toDate(), // 1 day
        httpOnly: true, // Allow javascript create cookie only server-site
        secure: config.envSecure // Allow javascript create cookie only host `https`
      })
    }
    return res.send(response)
  })

}