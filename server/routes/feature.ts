import axios, { AxiosRequestConfig, AxiosError } from 'axios'
import authenticateToken from '../middleware/authenticateToken'
import AjaxtRequest from '../../src/utils/AjaxtRequest'

export default (server, render) => {

  /** @route home page */
  server.get('/', authenticateToken, (req, res) => {
    return render(req, res, '/home', { ...req.query })
  })

}