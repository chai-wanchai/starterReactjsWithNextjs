import Router from 'next/router'
import { connect } from 'react-redux'
import { FunctionComponent, useEffect } from 'react'
import modal from '../../utils/modal'
import ToDoAuth from '../../stores/auth/ToDoAuth'
import nextConfig from '../../constants/nextConfig'

interface LoginWithADFSProps {
  userADFS: string
  todoAuth: ToDoAuth
}

const LoginWithADFS: FunctionComponent<LoginWithADFSProps> = ({
  userADFS,
  todoAuth
}) => {
  const { adfs } = nextConfig

  const onLogin = async () => {
    const response = await todoAuth.onLoginWithADFS(userADFS)

    if (response.isSuccess) {

      await modal.toast({ icon: 'success', title: 'Signed in ADFS successfully' })
      Router.push('/home', '/')

    } else {

      await modal.Unauthorize()
      await todoAuth.onLogOut()

      const win = window.open(adfs.signoutUrl, adfs.signoutTarget)
      const timer = setInterval(() => {
        win.close()
        if (win.closed) {
          clearInterval(timer)
          Router.push('/login-without-adfs', '/login')
        }
      }, 1000)
      
    }

  }

  useEffect(() => {
    onLogin()
  }, [])

  return (
    <></>
  )
}

const mapDispatchToProps = dispatch => ({
  todoAuth: new ToDoAuth(dispatch)
})

export default connect(null, mapDispatchToProps)(LoginWithADFS)