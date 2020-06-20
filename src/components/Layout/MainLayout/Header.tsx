import styled from 'styled-components'
import { connect } from 'react-redux'
import { useRouter } from 'next/router'
import { FunctionComponent } from 'react'
import config from '../../../../config'
import ToDoAuth from '../../../stores/auth/ToDoAuth'
import nextConfig from '../../../constants/nextConfig'
import { deviceBreakPoint } from '../../../utils/css'
import { Menu, Dropdown } from 'semantic-ui-react'
import { State as AuthState } from '../../../stores/auth/reducer'
import { RootState } from '../../../stores'
// import { SectionHeader } from '../../../modules/LoginWithoutADFS'

const LogoImage = styled('img')`
  margin: 0 7.5px 0 0;
  width: 90px;
  height: auto;
  cursor: pointer;
`

const BandName = styled('div')`
  margin: 0 0 0 7.5px;
  font-size: 1.8rem;
  font-weight: 500;
  color: red;
`

const Container = styled('div')`
  width: 100%;
  height: 100%;
  display: flex;
  margin: 0 auto;
  padding 0 5%;
  min-width: 910px;
  align-items: center;
  background: linear-gradient(to right, white, red);

  & > .box-left {
    
    min-width: 320px;
    display: inline-flex;
    align-items: center;

    @media (max-width: 1140px) {
      padding-left: 7.5px;
    }
  }
  & > .box-right {
    flex-grow: 1;
    display: inline-flex;
    justify-content: flex-end;
    padding-right: 5%;
    color: white;
    @media (max-width: 1140px) {
      padding-right: 7.5px;
    }
  }
`

const Wrapper = styled('div')`
  height: 60px;
  background-color: #FFFFFF;
  border-bottom: 1px solid rgba(118, 118, 128, 0.12);
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
`

// End styled components ------------------------------

interface HeaderProps {
  todoAuth: ToDoAuth
  auth: AuthState
}

// End type & interface ------------------------------

const Header: FunctionComponent<HeaderProps> = ({
  todoAuth, auth
}) => {
  const router = useRouter()
  const { adfs } = nextConfig

  const onLogOut = async () => {
    await todoAuth.onLogOut()

    if (config.env === 'development') {
      router.push('/login-without-adfs', '/login')
      return
    }

    // Clear session ADFS
    const win = window.open(adfs.signoutUrl, adfs.signoutTarget)
    const timer = setInterval(function () {
      win.close()
      if (win.closed) {
        clearInterval(timer);
        router.push('/login-without-adfs', '/login')
      }
    }, 1000)

  }
  let user = auth.user.info.username
  return (
    <Wrapper>
      <Container>
        <div className='box-left'>
          <LogoImage
            src='/images/scg-logo.png'
            onClick={() => router.push('/home', '/')}
          />
          <BandName>| Smart Planing</BandName>
        </div>
        <div className='box-right'>
          <Menu.Menu position='right'>
            <Dropdown item text={user} direction="left" pointing fluid={false} className='logout-dropdown'>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => onLogOut()} icon="sign-out" text="Logout" />
              </Dropdown.Menu>
            </Dropdown>
          </Menu.Menu>
        </div>
      </Container>
    </Wrapper>
  )
}

const mapDispatchToProps = dispatch => ({
  todoAuth: new ToDoAuth(dispatch)
})
const mapStateToProps = ({ auth, master }: RootState) => ({
  auth, master
})
export default connect(mapStateToProps, mapDispatchToProps)(Header)
