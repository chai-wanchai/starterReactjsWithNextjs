import { Action } from './action'


export interface State {
  token: string
  user: {
    info: {
      id: string
      username: string
    }
  }
}

const initState: State = {
  token: '',
  user: {
    info: {     
      id: null,    
      username: ''    
    }
  }
}

export default (state: State = initState, action: Action) => {
  switch (action.type) {
    case 'AUTH_STORE_SET_TOKEN':
      return {
        ...state,
        token: action.payload.data
      }
    case 'AUTH_STORE_RESET_TOKEN':
      return {
        ...state,
        token: ''
      }
    case 'AUTH_STORE_SET_USER_INFO':
      return {
        ...state,
        user: {
          ...state.user,
          info: {
            ...state.user.info,
            ...action.payload.data
          }
        }
      }
    case 'AUTH_STORE_RESET_USER_INFO':
      return {
        ...state,
        user: {
          ...state.user,
          info: {
            ...initState.user.info
          }
        }
      }
    case 'AUTH_STORE_RESET':
      return initState
    default:
      return state
  }
}