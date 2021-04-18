import axios, { AxiosRequestConfig, AxiosError } from 'axios'
import authenticateToken from '../middleware/authenticateToken'
import AjaxtRequest from '../../src/utils/AjaxtRequest'

export default (server, render) => {

  /** @route home page */
  server.get('/', (req, res) => {
    return render(req, res, '/', { ...req.query })
  })
  server.get('/login', (req, res) => {
    return render(req, res, '/login', { ...req.query, ...req.params })
  })
  server.get('/zipmex/:uid/link-account', (req, res) => {
    return render(req, res, '/zipmex-session', { ...req.query, ...req.params })
  })

}