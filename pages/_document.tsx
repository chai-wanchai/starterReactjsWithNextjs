import { ServerStyleSheet } from 'styled-components'
import NextDocument, { Head, Main, NextScript } from 'next/document'

const hostCDN = 'https://cdn.jsdelivr.net'
const hostFont = 'https://fonts.googleapis.com'

export default class Document extends NextDocument {
  static async getInitialProps(ctx) {
    const sheet = new ServerStyleSheet()
    const originalRenderPage = ctx.renderPage

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: App => props => sheet.collectStyles(<App {...props} />),
        })

      const initialProps = await NextDocument.getInitialProps(ctx)
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      }
    } finally {
      sheet.seal()
    }
  }

  render() {
    return (
      <html>
        <Head>
          <base href='/' />
          <meta charSet='UTF-8' />
          <meta httpEquiv='X-UA-Compatible' content='IE=Edge' />
          <meta name='viewport' content='initial-scale=1.0, width=device-width' />
          {/** favicon app */}
          <link rel='icon' type='image/x-icon' href='/static/favicon.ico' />
          {/** fonts */}
          <link rel='stylesheet' href={`${hostFont}/css2?family=K2D:ital,wght@0,100;0,300;0,700;1,100;1,300;1,700&display=swap`} />
          {/** cdn css */}
          <link rel='stylesheet' href={`${hostCDN}/npm/semantic-ui@2.4.2/dist/semantic.min.css`} />
          <link rel='stylesheet' href={`${hostCDN}/npm/react-datepicker@2.12.1/dist/react-datepicker.min.css`} />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    )
  }
}