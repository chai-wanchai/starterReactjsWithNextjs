import userToken from '../utils/userToken'
import BaseApi from './BaseApi'

class PartyApi extends BaseApi {


  public getAllParty = async (token?: string) => {
    if (!token) {
      token = userToken.getUserToken()
    }
    const result = await this.apiGet('/api/party', this.setAuthorize(token))
    return result
  }
  public createParty = async (data: any, token?: string) => {
    if (!token) {
      token = userToken.getUserToken()
    }
    const result = await this.apiPost('/api/party', data, this.setAuthorize(token))
    return result
  }

  public joinParty = async (data: any, token?: string) => {
    try {
      if (!token) {
        token = userToken.getUserToken()
      }
      const result = await this.apiPost('/api/party/join', data, this.setAuthorize(token))
      return result
    } catch (error) {
      console.log(error)
    }

  }


}

export const partyApi = new PartyApi()

export default partyApi