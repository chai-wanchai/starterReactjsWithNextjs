import { MasterRaw, Action } from './action'

export interface State {
  raw: MasterRaw
  customer: {
    R3: any[]
    S4: any[]
  }
}

const initState: State = {
  raw: {
    role: [],
    section: [],
    templateType: [],
    destinationType: [],
    company: [],
    rebateType: [],
    customer: [],
    distribution: []
  },
  customer: {
    R3: [],
    S4: []
  }
}

export default (state: State = initState, action: Action) => {
  switch(action.type) {
    case 'MASTER_STORE_SET_RAW':
      return {
        ...state,
        raw: {
          ...state.raw,
          [action.payload.key]: [ ...action.payload.data ]
        }
      }
    case 'MASTER_STORE_SET_CUSTOMER':
      return {
        ...state,
        customer: {
          R3: action.payload.data.filter(data => data.sap_source === 'R3'),
          S4: action.payload.data.filter(data => data.sap_source === 'S4')
        }
      }
    case 'MASTER_STORE_RESET':
      return initState
    default:
      return state
  }
}