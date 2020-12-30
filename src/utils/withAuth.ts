import { RebateAppContext, RebateAppPageProps } from '../intefaces'
import { authApi } from '../api/AuthApi'
import { RootState } from '../stores'
import { PermissionMenu } from '../stores/auth/reducer'
import redirect from './redirect'
import userToken from './userToken'

const checkPermissionPage = (page: string, menu: PermissionMenu[]) => {

  return true

}

export default async (ctx: RebateAppContext): Promise<RebateAppPageProps> => {

  // Get state from Redux store
  const { auth } = ctx.store.getState() as RootState
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