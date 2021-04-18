import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios'
import config from '../../config'
import AjaxRequest from './AjaxtRequest'

const successResponse = ({ data }: AxiosResponse) => data

const failedResponse = (error: AxiosError) => {
  const ajaxResult = new AjaxRequest()
  if (error.response && error.response.status === 401) { // Unauthorized
    ajaxResult.setError(error.message, 401)
  } else {
    const errorMsg = error.response?.data?.error?.message || error.message
    ajaxResult.setError(errorMsg)
  }
  return Promise.resolve(ajaxResult)
}

class Request {
  public api: AxiosInstance = axios.create({
    baseURL: config.api.backEnd,
    timeout: 60000
  })
  public app: AxiosInstance = axios.create({
    // baseURL: config.api.frontEnd,
    timeout: 60000
  })
  constructor() {
    this.api.interceptors.response.use(successResponse, failedResponse)
    this.app.interceptors.response.use(successResponse, failedResponse)
  }
}

export default new Request()