import { ThunkAction } from 'redux-thunk'
import { RootState } from '../index'

export interface Action {
  type:
  // Group set
  'AUTH_STORE_SET_TOKEN' |
  'AUTH_STORE_SET_USER_INFO' |
  'AUTH_STORE_SET_USER_MENU' |

  // Group reset
  'AUTH_STORE_RESET_TOKEN' |
  'AUTH_STORE_RESET_USER_INFO' |
  'AUTH_STORE_RESET_USER_MENU' |
  'AUTH_STORE_RESET'

  payload?: {
    data: any
  }
}

// Section creator -----------------------------

export interface Creator {

  setToken: (data: string) => ThunkAction<void, RootState, undefined, Action>
  resetToken: () => ThunkAction<void, RootState, undefined, Action>

  setUserInfo: (data: RootState['auth']['user']['info']) => ThunkAction<void, RootState, undefined, Action>
  resetUserInfo: () => ThunkAction<void, RootState, undefined, Action>

  reset: () => ThunkAction<void, RootState, undefined, Action>

}

const setToken: Creator['setToken'] = data => dispatch => dispatch({
  type: 'AUTH_STORE_SET_TOKEN',
  payload: { data }
})

const resetToken: Creator['resetToken'] = () => dispatch => dispatch({
  type: 'AUTH_STORE_RESET_TOKEN'
})

const setUserInfo: Creator['setUserInfo'] = data => dispatch => dispatch({
  type: 'AUTH_STORE_SET_USER_INFO',
  payload: { data }
})

const resetUserInfo: Creator['resetUserInfo'] = () => dispatch => dispatch({
  type: 'AUTH_STORE_RESET_USER_INFO'
})


const reset: Creator['reset'] = () => dispatch => dispatch({
  type: 'AUTH_STORE_RESET'
})

export const creator: Creator = {
  setToken,
  resetToken,
  setUserInfo,
  resetUserInfo,
  reset
}