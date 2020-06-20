import cors from 'cors'
import helmet from 'helmet'
import express from 'express'
import passport from 'passport'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import passportSaml from '../config/passportSaml'
import loginRoute from './routes/login'
import logoutRoute from './routes/logout'
import featureRoute from './routes/feature'
import app from './app'

const port = parseInt(process.env.PORT || '5000', 10)
const handle = app.getRequestHandler()

// Setup passport saml config
passportSaml(passport)

// Handle render page with NextJS
// const renderPage = (req, res, path, query?) => app.render(req, res, path, query)
const renderPage = (req, res, pagePath, queryParams?) => app
   .render(req, res, pagePath, queryParams)
   .catch(err => app.renderError(err, req, res, pagePath, queryParams))

app.prepare().then(() => {

  // Create express server
  const server = express()

  // Form parser.
  server.use(bodyParser.urlencoded({ extended: true }))
  // Body parser.
  server.use(bodyParser.json())
  // Cookie
  server.use(cookieParser())
  // Use CORS.
  server.use(cors())
  // Helmet frameguard
  server.use(helmet.frameguard({ action: 'SAMEORIGIN' }))
  // Passport initialize
  server.use(passport.initialize())
  // Passport set session
  server.use(passport.session())

  server.get('/healthcheck', (req, res) => 
    res.json({ message: 'scg-rebate-web ok' })
  )

  // End 3rd paty ----------------------------------

  logoutRoute(server)
  
  loginRoute(server, renderPage, passport)

  featureRoute(server, renderPage)

  // End routes ------------------------------------

  

  server.all('*', (req, res) => handle(req, res))

  server.listen(port, err => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
  })

})