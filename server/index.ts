import cors from 'cors'
import helmet from 'helmet'
import express from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import featureRoute from './routes/feature'
import app from './app'
import domain  from 'domain'

const port = parseInt(process.env.PORT || '8080', 10)
const handle = app.getRequestHandler()

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

  // Passport set session
  // server.use(passport.session())

  server.get('/healthcheck', (req, res) =>
    res.json({ message: 'ok' })
  )

  featureRoute(server, renderPage)

  // End routes ------------------------------------



  server.all('*', (req, res) => handle(req, res))

  server.listen(port, async() => {
    console.log(`> Ready on http://localhost:${port}`)
  })

})