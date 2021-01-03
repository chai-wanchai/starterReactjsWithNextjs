export interface IAjaxResultError {
  code?: string;
  message?: string;
}

export interface IAjaxResult {
  isSuccess: boolean;
  data: any;
  error: IAjaxResultError;
  statusCode: number;
}

export default class AjaxResult<T = any> implements IAjaxResult {
  isSuccess: boolean;
  data: T;
  error: IAjaxResultError;
  statusCode: number = 200;

  constructor(isSuccess: boolean = true) {
    this.isSuccess = isSuccess;
    this.error = {};
  }

  setError(message: string, statusCode?: number, code?: string) {
    this.isSuccess = false;
    this.error.message = message;

    if (code) {
      this.error.code = code;
    }

    // If not specific, will default error 500 (Internal Server Error)
    if (statusCode) {
      this.setStatusCode(statusCode);
    } else {
      this.setStatusCode(500);
    }
  }

  setErrorByItem(item: IAjaxResultError, statusCode?: number) {
    this.setError(item.message, 200, item.code);
    if (statusCode) {
      this.statusCode = statusCode;
    }
  }

  setStatusCode(status: number) {
    this.statusCode = status;
  }
}
