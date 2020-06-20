import { Component } from 'react'
import { RebateAppPageProps, RebateAppContext } from '../src/intefaces'
import config from '../config'
import cookie from '../src/utils/cookie'
import redirect from '../src/utils/redirect'
import LoginWithoutADFS from '../src/modules/LoginWithoutADFS'

class LoginWithOutADFSPage extends Component {
  static getInitialProps = (ctx: RebateAppContext): RebateAppPageProps => {
    const utk = cookie.get(config.authKey, ctx.req)

    if (utk) {
      redirect('/', ctx)
    }
    // else if (config.env !== 'development') {
    //   redirect('/login/adfs', ctx)
    // }

    return {
      layout: 'none'
    }
  }

  render() {
    return (
      <LoginWithoutADFS />
    )
  }
}

export default LoginWithOutADFSPage