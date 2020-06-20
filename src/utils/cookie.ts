import { Request, Response, CookieOptions } from 'express'
import UniversalCookie, { CookieSetOptions } from 'universal-cookie'

class Cookie {

  public defaultOptions: CookieSetOptions | CookieOptions = {
    path: '/',
    maxAge: 86400,
  }

  public get = (name: string, req?: Request): any => {
    /**
     * @ServerSite
     */
    if (req && req.cookies) {
      /**
       * if server-site req.cookies should have
       * because we use node module `cookieParser`
       * in middleware express server
       */
      return req.cookies[name]
    }

    /**
     * @ClientSite
     */
    return new UniversalCookie().get(name)
  }

  public set = (
    name: string,
    value: any,
    options?: CookieSetOptions | CookieOptions,
    res?: Response
  ) => {
    if (res) {
      /**
       * @ServerSite
       */
      res.cookie(name, value, options)
    } else {
      /**
       * @ClientSite
       */
      new UniversalCookie().set(name, value, options)
    }
  }

  public del = (
    name: string,
    options?: CookieSetOptions | CookieOptions,
    res?: Response
  ) => {
    if (res) {
      /**
       * @ServerSite
       */
      res.clearCookie(name, options)
    } else {
      /**
       * @ClientSite
       */
      new UniversalCookie().remove(name, options)
    }
  }
}

export default new Cookie()