import { IUserInfo } from '../@type/user'
import { RequestApiResponse } from '../intefaces'
import userToken from '../utils/userToken'
import BaseApi from './BaseApi'

class AuthApi extends BaseApi {


  public login(username: string, password: string) {
    return this.apiPost('/api/auth/login', { username, password })
  }
  public getUserProfile(userUid: string):Promise<RequestApiResponse<IUserInfo>> {
    return this.apiGet(`/api/auth/user/${userUid}`)
  }
  public zipmexToken(user_uid: string, token: string, access_token?: string) {
    return this.apiPost('/api/zipmex/login/session-token', { user_uid, apToken: token, access_token })
  }
  public verifyToken(token?: string) {
    return this.apiPost('api/auth/verify', {}, this.setAuthorize(token))
  }
  public registerUser(data) {
    return this.apiPost('/api/auth/register', data)
  }


}

export const authApi = new AuthApi()

export default AuthApi