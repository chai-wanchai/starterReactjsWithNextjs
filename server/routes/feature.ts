import axios, { AxiosRequestConfig, AxiosError } from 'axios'
import authenticateToken from '../middleware/authenticateToken'
import AjaxtRequest from '../../src/utils/AjaxtRequest'

export default (server, render) => {

  /** @route home page */
  server.get('/', (req, res) => {
    return render(req, res, '/home', { ...req.query })
  })
  server.get('/login', (req, res) => {
    return render(req, res, '/login', { ...req.query, ...req.params })
  })
  server.get('/register', (req, res) => {
    return render(req, res, '/register', { ...req.query })
  })
  server.get('/party/create', (req, res) => {
    return render(req, res, '/create_party', { ...req.query })
  })
  server.get('/create_party', (req, res) => {
    return render(req, res, '/create_party', { ...req.query })
  })

}