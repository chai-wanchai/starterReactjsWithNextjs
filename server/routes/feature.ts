import axios, { AxiosRequestConfig, AxiosError } from 'axios'
import authenticateToken from '../middleware/authenticateToken'
import AjaxtRequest from '../../src/utils/AjaxtRequest'

export default (server, render) => {

  /** @route home page */
  server.get('/',  (req, res) => {
    return render(req, res, '/home', { ...req.query })
  })
  server.get('/game-prize/:gameId',  (req, res) => {
    return render(req, res, '/game', { ...req.query,...req.params })
  })

}