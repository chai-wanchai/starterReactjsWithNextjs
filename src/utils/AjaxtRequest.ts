import { RequestApiError, RequestApiResponse } from '../intefaces'

export default class AjaxRequset<T = any> implements RequestApiResponse {
  public data: T;
  
  public isSuccess: boolean
  
  public error: RequestApiError
  
  public statusCode: number = 200

  constructor(isSuccess: boolean = true) {
    this.error = {}
    this.isSuccess = isSuccess
  }

  public setError(message: string, statusCode?: number, code?: string) {
    this.isSuccess = false
    this.error.message = message

    if (code) {
      this.error.code = code
    }

    // If not specific, will default error 500 (Internal Server Error)
    this.setStatusCode(statusCode || 500)
  }

  public setErrorByItem(item: RequestApiError, statusCode?: number) {
    this.setError(item.message, 200, item.code)
    if (statusCode) {
      this.statusCode = statusCode
    }
  }

  public setStatusCode(status: number) {
    this.statusCode = status
  }
}