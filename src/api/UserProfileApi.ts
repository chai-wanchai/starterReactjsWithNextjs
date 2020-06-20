import BaseApi from './BaseApi'

class UserProfileApi extends BaseApi {

  public getUserProfile = (token: string) =>
    this.apiPost('userprofile/getUserProfile', {}, this.setAuthorize(token))

  public saveUserProfile = (params, token: string) =>
    this.apiPost('userprofile/mergeUserProfile', { jsonModel: params }, this.setAuthorize(token))

  public deleteUserProfile = (uid: any, token: string) =>
    this.apiPost('userprofile/deleteUserProfile', { user_id: uid }, this.setAuthorize(token))
}

export const userProfileApi = new UserProfileApi()

export default UserProfileApi