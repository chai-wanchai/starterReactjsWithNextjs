import { Request, Response } from 'express'
import cookie from './cookie'

export class Token {

  private USER_TOKEN_KEY = 'utk'

  getUserToken(req?: Request): any {
    return cookie.get(this.USER_TOKEN_KEY, req)
  }

  setUserToken(tokenUser: string, res?: Response) {
    cookie.set(this.USER_TOKEN_KEY, tokenUser, cookie.defaultOptions, res)
  }

  removeUserToken(res?: Response) {
    cookie.del(this.USER_TOKEN_KEY, { path: cookie.defaultOptions.path }, res)
  }
  
}

export default new Token()
