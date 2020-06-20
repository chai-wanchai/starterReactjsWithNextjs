import { AxiosRequestConfig } from 'axios'
import { RequestApiResponse } from '../intefaces'
import request from '../utils/request'

export default abstract class BaseApi {

  protected setAuthorize = (token?: string, type: string = 'Bearer'): AxiosRequestConfig => ({
    headers: {
      authorization: `${type} ${token}`
    }
  })

  /**
   * @Note Requset for api backend
   */
  protected apiGet = (url: string, option?: AxiosRequestConfig): Promise<RequestApiResponse> =>
    request.api.get(url, option)
  protected apiPost = (url: string, params?: any, option?: AxiosRequestConfig): Promise<RequestApiResponse> =>
    request.api.post(url, params, option)
  protected apiPut = (url: string, params?: any, option?: AxiosRequestConfig): Promise<RequestApiResponse> =>
    request.api.put(url, params, option)
  protected apiDel = (url: string, option?: AxiosRequestConfig): Promise<RequestApiResponse> =>
    request.api.delete(url, option)

  /**
   * @Note Request for api frontend
   */
  protected appGet = (url: string, option?: AxiosRequestConfig): Promise<RequestApiResponse> =>
    request.app.get(url, option)
  protected appPost = (url: string, params?: any, option?: AxiosRequestConfig): Promise<RequestApiResponse> =>
    request.app.post(url, params, option)
  protected appPut = (url: string, params?: any, option?: AxiosRequestConfig): Promise<RequestApiResponse> =>
    request.app.put(url, params, option)
  protected appDelete = (url: string, option?: AxiosRequestConfig): Promise<RequestApiResponse> =>
    request.app.delete(url, option)

}