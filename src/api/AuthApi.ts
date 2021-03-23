import userToken from '../utils/userToken'
import BaseApi from './BaseApi'

class AuthApi extends BaseApi {

 
  public login = (username: string, password: string) => {
    return this.apiPost('/api/auth/login', { username, password })
  }
  public verifyToken = (token?: string) => {
    return this.apiPost('api/auth/verify', {}, this.setAuthorize(token))
  }
  public registerUser = (data) =>
    this.apiPost('/api/auth/register', data)

}

export const authApi = new AuthApi()

export default AuthApi