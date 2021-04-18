import React from 'react'
import withRedux from 'next-redux-wrapper'
import NextApp, { AppContext } from 'next/app'
import { WebAppContext } from '../src/intefaces'
import Layout from '../src/components/Layout'
import AppProgress from '../src/components/AppProgress'
import ErrorPage from './_error'

interface WebAppContextProps extends AppContext {
  ctx: WebAppContext
}

interface WebAppProps {
  store: any
}

class WebApp extends NextApp<WebAppProps> {

  static async getInitialProps(context: WebAppContextProps) {
    const { Component, ctx } = context

    try {
      const props = Component.getInitialProps ? await Component.getInitialProps(ctx) : {
        layout: 'none'
      }

      return {
        pageProps: props
      }

    } catch (err) {
      return {
        pageProps: {}
      }

    }

  }

  render() {
    const {
      store,
      Component,
      pageProps: {
        error,
        layout,
        statusCode,
        ...pageProps
      }
    } = this.props
    return (
      <>
        {error || statusCode ? (
          <Layout type='none'>
             <ErrorPage statusCode={error || statusCode} />
          </Layout>
        ): (
          <Layout type={layout}>
            <Component {...this.props} {...pageProps}/>
          </Layout>
        )}
        <AppProgress
          color='red'
          spinner={false}
          showAfterMs={300}
          options={{ trickleSpeed: 50 }}
        />
      </>
    )
  }
}

export default WebApp
