import BaseApi from './BaseApi'

class AuthApi extends BaseApi {

  /** @Logout for rebate online app */
  public logout = () =>
    this.appPost('logout', {})

  /** @Login with ADFS api */
  public loginWithADFS = (type: 'api' | 'app', username: string) => {
    if (type === 'api') {
       return this.apiPost('auth/login', { username })
    }
    return this.appPost('login/with/adfs', { username })
  }
 
  /** @Login no ADFS api */
  public loginWithoutADFS = (type: 'api' | 'app', params: { username: string, password: string }) => {
    if (type === 'api') {
      return this.apiPost('auth/loginNoAD', params)
    }
    return this.appPost('login/without/adfs', params)
  }

  /** @User verify user token api */
  public verifyToken = (token: string) =>
    this.apiPost('auth/verify', {}, this.setAuthorize(token))

  /** @User get user info api */
  public getUserInfo = (token: string) =>
    this.apiGet('auth/user-info', this.setAuthorize(token))

  /** @User get role menu system */
  public getRoleMenu = (token: string) =>
    this.apiPost('auth/rolemenu', {}, this.setAuthorize(token))
  
}

export const authApi = new AuthApi()

export default AuthApi