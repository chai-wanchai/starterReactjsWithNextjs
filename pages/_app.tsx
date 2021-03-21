import React from 'react'
import { Provider } from 'react-redux'
import withRedux from 'next-redux-wrapper'
import NextApp, { AppContext } from 'next/app'
import { WebAppContext } from '../src/intefaces'
import { initStore } from '../src/stores'
import { creator as authCreator } from '../src/stores/auth/action'
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

  state = {}

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

  static getDerivedStateFromProps(nextProps, state) {

    const { store, pageProps } = nextProps

    // // Set token to redux store
    // if (pageProps.token) {
    //   store.dispatch(authCreator.setToken(pageProps.token))
    // }

    // // Set user information to redux store
    // if (pageProps.userInfo) {
    //   store.dispatch(authCreator.setUserInfo(pageProps.userInfo))
    // }

    // // Set allow access menu to redux store
    // if (pageProps.userMenu) {
    //   store.dispatch(authCreator.setUserMenu(pageProps.userMenu))
    // }


    return state
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
      <Provider store={store}>
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
      </Provider>
    )
  }
}

export default withRedux(initStore)(WebApp)
