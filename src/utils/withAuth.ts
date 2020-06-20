import { RebateAppContext, RebateAppPageProps } from '../intefaces'
import { authApi } from '../api/AuthApi'
import { masterApi } from '../api/MasterApi'
import { RootState } from '../stores'
import { PermissionMenu } from '../stores/auth/reducer'
import redirect from './redirect'
import userToken from './userToken'

const checkPermissionPage = (page: string, menu: PermissionMenu[]) => {
  /**
   * check case should related with route on server `express` and `nextjs pages`
   */
  switch (page) {
    case '/save-data-no-detail':
      return menu.find(item => item.menu_path === 'editData' &&
        item.submenu.find(subItem => subItem.sub_menu_path === 'saveDataNoDetail')
      ) ? true : false
    case '/save-data-with-detail':
      return menu.find(item => item.menu_path === 'editData' &&
        item.submenu.find(subItem => subItem.sub_menu_path === 'saveDataWithDetail')
      ) ? true : false
    case '/edit-data-by-customer':
      return menu.find(item => item.menu_path === 'editData' &&
        item.submenu.find(subItem => subItem.sub_menu_path === 'editDataByCustomer')
      ) ? true : false
    case '/del-data-form-rebate-type':
      return menu.find(item => item.menu_path === 'editData' &&
        item.submenu.find(subItem => subItem.sub_menu_path === 'delDataFormRebateType')
      ) ? true : false
    case '/edit-user':
      return menu.find(item => item.menu_path === 'editUser') ? true : false
    case '/rebate-type':
      return menu.find(item => item.menu_path === 'rebateType') ? true : false
    case '/rebate-calc':
      return menu.find(item => item.menu_path === 'rebateCalc') ? true : false
    default:
      return true
  }
}

export default async (ctx: RebateAppContext): Promise<RebateAppPageProps> => {

  // Get state from Redux store
  const { auth, master } = ctx.store.getState() as RootState
  // withAuth should return
  const props: RebateAppPageProps = {
    layout: 'none',
    error: undefined,
    token: undefined,
    userInfo: undefined,
    userMenu: undefined,
    masterData: undefined
  }
  // Get user token from cookie or store
  const token = ctx.isServer ? userToken.getUserToken(ctx.req) : auth.token

  if (!token) {
    /**
     * redirect to `/login` page because
     * user not have permission to access page.
     */
    redirect('/login', ctx)
    throw new Error('Token not found')
  }

  // Verify user token
  const resVerifyToke = await authApi.verifyToken(token)

  if (resVerifyToke.isSuccess) {

    // Set token verify
    props.token = token

    // Get user information
    const resUserInfo = await authApi.getUserInfo(token)
    if (resUserInfo.isSuccess) {
      props.userInfo = resUserInfo.data
    }

    // Get allow access menu system for user
    const resUserMenu = await authApi.getRoleMenu(token)
    if (resUserMenu.isSuccess) {
      props.userMenu = resUserMenu.data
    }

    // Get master data
    if (Object.keys(master.raw).every(key => master.raw[key].length === 0)) {
      props.masterData = await masterApi.getAllMasterData(token)
    }
    
  } else {
    /**
     * this case excute when
     * user token expires or incorrect
     */
    userToken.removeUserToken(ctx.res)
    redirect('/login', ctx)
    throw new Error(resVerifyToke.error.message)
  }

  if (props.userMenu && !checkPermissionPage(ctx.pathname, props.userMenu)) {
    props.error = 404 // force show page not found
  }

  return props
}