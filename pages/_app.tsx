import React from 'react'
import { Provider } from 'react-redux'
import withRedux from 'next-redux-wrapper'
import NextApp, { AppContext } from 'next/app'
import { RebateAppContext } from '../src/intefaces'
import { initStore } from '../src/stores'
import { creator as authCreator } from '../src/stores/auth/action'
import Layout from '../src/components/Layout'
import AppProgress from '../src/components/AppProgress'
import ErrorPage from './_error'

interface RebateOnlineAppContext extends AppContext {
  ctx: RebateAppContext
}

interface RebateOnlineAppProps {
  store: any
}

class RebateOnlineApp extends NextApp<RebateOnlineAppProps> {

  state = {}

  static async getInitialProps(context: RebateOnlineAppContext) {
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

    // Set token to redux store
    if (pageProps.token) {
      store.dispatch(authCreator.setToken(pageProps.token))
    }

    // Set user information to redux store
    if (pageProps.userInfo) {
      store.dispatch(authCreator.setUserInfo(pageProps.userInfo))
    }

    // Set allow access menu to redux store
    if (pageProps.userMenu) {
      store.dispatch(authCreator.setUserMenu(pageProps.userMenu))
    }


    return state
  }

  render() {
    const {
      store,
      Component,
      pageProps: {
        error,
        layout,
        ...pageProps
      },
    } = this.props
    
    return (
      <Provider store={store}>
        {error ? (
          <Layout type='none'>
             <ErrorPage statusCode={error} />
          </Layout>
        ): (
          <Layout type={layout}>
            <Component {...pageProps} />
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

export default withRedux(initStore)(RebateOnlineApp)
