import { RequestApiResponse } from '../../intefaces'
import { authApi } from '../../api/AuthApi'
import { creator } from './action'

interface ToDo {
  onReset: () => void
  onSetToken: (data: string) => void
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

  public onLogin = async (username, password) => {
    const response = await authApi.login({ username, password })
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