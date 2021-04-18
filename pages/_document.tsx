import { ServerStyleSheet } from 'styled-components'
import NextDocument, { Html, Head, Main, NextScript } from 'next/document'
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
      <Html>
        <Head>
          <base href='/' />
          <meta charSet='UTF-8' />
          <link rel='icon' type='image/x-icon' href='/images/favicon.ico' />
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link href="https://fonts.googleapis.com/css2?family=Kanit&display=swap" rel="stylesheet" />
          <link rel='stylesheet' href={`${hostFont}/css2?family=K2D:ital,wght@0,100;0,300;0,700;1,100;1,300;1,700&display=swap`} />
          {/** cdn css */}
          <link rel='stylesheet' href={`${hostCDN}/npm/semantic-ui@2.4.2/dist/semantic.min.css`} />
          <link rel='stylesheet' href={`${hostCDN}/npm/react-datepicker@2.12.1/dist/react-datepicker.min.css`} />
          <link rel='stylesheet' href={`/css/style.css`} />

        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}