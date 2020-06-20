import { RequestApiResponse } from '../../intefaces'
import { authApi } from '../../api/AuthApi'
import { creator } from './action'

interface ToDo {
  onReset: () => void
  onSetToken: (data: string) => void
  onLoginWithADFS: (username: string) => Promise<RequestApiResponse>
  onLoginWithoutADFS: (username: string, password: string) => Promise<RequestApiResponse>
  onLogOut: () => Promise<any>
}

class ToDoAuth implements ToDo {
  private dispatch

  constructor(dispatch) {
    this.dispatch = dispatch
  }

  public onReset = () => {
    this.dispatch(creator.reset())
  }

  public onSetToken = data => {
    this.dispatch(creator.setToken(data))
  }

  public onLoginWithADFS = async username => {
    const response = await authApi.loginWithADFS('app', username)
    
    if (response.isSuccess) {
      this.onSetToken(response.data.token)
    }

    return response
  }

  public onLoginWithoutADFS = async (username, password) => {
    const response = await authApi.loginWithoutADFS('app', { username, password })

    if (response.isSuccess) {
      this.onSetToken(response.data.token)
    }

    return response
  }

  public onLogOut = async () => {
    await authApi.logout()
    this.onReset()
    return
  }
}

export default ToDoAuth