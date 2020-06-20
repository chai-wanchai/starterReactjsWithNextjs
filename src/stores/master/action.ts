import { ThunkAction } from 'redux-thunk'
import { RootState } from '../index'

export type MasterKey =
  'role' | 'templateType' | 'destinationType' | 'section' |
  'company' | 'rebateType' | 'customer' | 'distribution'

export type MasterRaw = {
  [name in MasterKey]: any[]
}

export interface Action {
  type:
    'MASTER_STORE_SET_RAW' |
    'MASTER_STORE_SET_CUSTOMER' |
    'MASTER_STORE_RESET'
  payload?: {
    key?: MasterKey
    data: any
  }
}

// Section creator -----------------------------

export interface Creator {
  setMasterRaw: (key: MasterKey, data: any[]) => ThunkAction<void, RootState, undefined, Action>
  setMasterCustomer: (data: any[]) => ThunkAction<void, RootState, undefined, Action>
  reset: () => ThunkAction<void, RootState, undefined, Action>
}

const setMasterRaw: Creator['setMasterRaw'] = (key, data) => dispatch => dispatch({
  type: 'MASTER_STORE_SET_RAW',
  payload: { key, data }
})

const setMasterCustomer: Creator['setMasterCustomer'] = data => dispatch => dispatch({
  type: 'MASTER_STORE_SET_CUSTOMER',
  payload: { data }
})

const reset: Creator['reset'] = () => dispatch => dispatch({
  type: 'MASTER_STORE_RESET'
})

export const creator: Creator = {
  setMasterRaw,
  setMasterCustomer,
  reset
}