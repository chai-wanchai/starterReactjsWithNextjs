import { Action } from './action'

export interface PermissionSubMenu {
  sub_menu_desc: string
  sub_menu_path: string
}

export interface PermissionMenu {
  menu_id: number
  role_id: number
  role_desc: string
  menu_desc: string
  menu_path: string
  submenu?: PermissionSubMenu[]
}

export interface State {
  token: string
  user: {
    info: {
      email: string
      user_id: number
      fullname: string
      user_code: string
      site_code: string
      username: string
      role_id: number
      comp_id: string
      destination_type: string
      role_desc: string
    },
    menu: PermissionMenu[]
  }
}

const initState: State = {
  token: '',
  user: {
    info: {
      email: '',
      user_id: null,
      fullname: '',
      user_code: '',
      site_code: '',
      username: '',
      role_id: null,
      comp_id: '',
      destination_type: '',
      role_desc: ''
    },
    menu: []
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
    case 'AUTH_STORE_SET_USER_MENU':
      return {
        ...state,
        user: {
          ...state.user,
          menu: [ ...action.payload.data ]
        }
      }
    case 'AUTH_STORE_RESET_USER_MENU':
      return {
        ...state,
        user: {
          ...state.user,
          menu: []
        }
      }
    case 'AUTH_STORE_RESET':
      return initState
    default:
      return state
  }
}