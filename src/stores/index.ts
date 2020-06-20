import { createStore, applyMiddleware, combineReducers } from 'redux'
import thunkMiddleware from 'redux-thunk'
import auth, { State as AuthState } from './auth/reducer'
import master, { State as MasterState } from './master/reducer'

export interface RootState {
  auth: AuthState
  master: MasterState
}

const bindMiddleware = middleware => {
  if (process.env.NODE_ENV !== 'production') {
    const { composeWithDevTools } = require('redux-devtools-extension')
    return composeWithDevTools(applyMiddleware(...middleware))
  }
  return applyMiddleware(...middleware)
}

export const initStore = () => {
  return createStore(
    combineReducers({
      auth,
      master
    }),
    bindMiddleware([thunkMiddleware])
  )
}