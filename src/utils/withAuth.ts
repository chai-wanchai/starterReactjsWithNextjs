import { WebAppContext, AppPageProps } from '../intefaces'
import { authApi } from '../api/AuthApi'
import redirect from './redirect'
import userToken from './userToken'


export default async (ctx: WebAppContext): Promise<AppPageProps> => {

  // Get state from Redux store
  const { auth } = ctx.store.getState() as any
  // withAuth should return
  const props: AppPageProps = {
    layout: 'none',
    error: undefined,
    token: undefined,
    userInfo: undefined,
    userMenu: undefined,
    masterData: undefined
  }
  // Get user token from cookie or store
  const token = userToken.getUserToken()

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


  } else {
    /**
     * this case excute when
     * user token expires or incorrect
     */
    userToken.removeUserToken(ctx.res)
    redirect('/login', ctx)
    throw new Error(resVerifyToke.error.message)
  }

  return props
}