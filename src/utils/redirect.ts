import Router from 'next/router'
import { RebateAppContext } from '../../src/intefaces'

const getActualPage = (target: string): string => {
  switch (target) {
    case '/': return '/home'
    case '/login': return '/login-without-adfs'
    default: return target
  }
}

export default (target: string, ctx?: RebateAppContext, option?: any) => {
  if (ctx && ctx.res) {
    // If on the server, an HTTP 303 response with a "Location"
    // is used to redirect.
    ctx.res.writeHead(303, { Location: target })
    ctx.res.end('server redirect!!')
  } else {
    // On the browser, next/router is used to `replace` the current
    // location for the new one, removing it from history.
    const url = getActualPage(target)
    Router.replace(url, target, option)
  }

  return {}
}