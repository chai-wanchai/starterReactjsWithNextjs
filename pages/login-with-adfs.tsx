import { Component } from 'react'
import { RebateAppPageProps, RebateAppContext } from '../src/intefaces'
import LoginWithADFS from '../src/modules/LoginWithADFS'

interface LoginWithADFSPageProps {
  userADFS: string
}

class LoginWithADFSPage extends Component<LoginWithADFSPageProps> {
  static getInitialProps = (ctx: RebateAppContext): RebateAppPageProps => ({
    layout: 'none',
    userADFS: ctx.query.user_ad
  })

  render() {
    return (
      <LoginWithADFS
        userADFS={this.props.userADFS}
      />
    )
  }
}

export default LoginWithADFSPage