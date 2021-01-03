import cors from 'cors'
import helmet from 'helmet'
import express from 'express'
import passport from 'passport'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import passportSaml from '../config/passportSaml'
import featureRoute from './routes/feature'
import gameRoute from './routes/api'
import app from './app'
import domain  from 'domain'
import { Database } from './utils/database'

const port = parseInt(process.env.PORT || '5000', 10)
const handle = app.getRequestHandler()

// Setup passport saml config
// passportSaml(passport)

// Handle render page with NextJS
// const renderPage = (req, res, path, query?) => app.render(req, res, path, query)
const renderPage = (req, res, pagePath, queryParams?) => app
  .render(req, res, pagePath, queryParams)
  .catch(err => app.renderError(err, req, res, pagePath, queryParams))

app.prepare().then(() => {
 
  // Create express server
  const server = express()
  server.use(function (req, res, next) {
    // create per request domain instance
    domain.create().run(function() {
      // explicit binding
      process.domain.add(req)
      process.domain.add(res)
      // save request to domain, to make it accessible everywhere
    
      next()
    });
  });
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
  // server.use(passport.session())

  server.get('/healthcheck', (req, res) =>
    res.json({ message: 'ok' })
  )

  // End 3rd paty ----------------------------------
  server.use('/api',gameRoute)
  featureRoute(server, renderPage)

  // End routes ------------------------------------



  server.all('*', (req, res) => handle(req, res))

  server.listen(port, async() => {
    const db = new Database()
    const dbService = await db.getConnection()
    console.log(dbService.options)
    console.log(`> Ready on http://localhost:${port}`)
  })

})