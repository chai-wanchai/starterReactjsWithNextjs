import BaseApi from './BaseApi'

class AuthApi extends BaseApi {

  /** @Logout for rebate online app */
  public logout = () => {

  }
  public login = (params: { username: string, password: string }) => {
    return this.apiPost('auth/login', params)
  }
  public verifyToken = (token: string) => {
    return this.apiPost('auth/verify', {}, this.setAuthorize(token))
  }

  public registerUser = (data) =>
    this.apiPost('auth/register', data)


}

export const authApi = new AuthApi()

export default AuthApi