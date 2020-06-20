import Router from 'next/router'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { FunctionComponent, FormEvent, useState } from 'react'
import { Icon, Grid, Button, Divider } from 'semantic-ui-react'
import { deviceBreakPoint } from '../../utils/css'
import ToDoAuth from '../../stores/auth/ToDoAuth'
import modal from '../../utils/modal'
import Field from '../../components/Field'

export const SectionHeader = styled('section')`
  z-index: 2;
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  height: 70px;
  display: flex;
  flex-wrap: wrap;
  padding: 10px 35px;
  align-items: center;
  background: linear-gradient(to right, white, red);

  & > label {
    color: red;
    font-size: 30px;
    margin-left: 15px;
    text-shadow: 2px 2px 5px rgba(255, 255, 255, 1);
  }

  & > img {
    height: auto;
    max-height: 100%;
  }

  @media ${deviceBreakPoint.mobileL} {
    padding: 10px 15px;
    & > label {
      font-size: 25px;
    }
    & > img {
      width: 120px;
    }
  }
`

const SectionBody = styled('section')`
  display: flex;
  min-height: calc(100vh - 70px);
`

const SectionLogo = styled('section')`
  flex-basis: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  img {
    width: 500px;
  }

  @media ${deviceBreakPoint.laptop} {
    img {
      width: 400px;
    }
  }

  @media ${deviceBreakPoint.tablet} {
    display: none;
  }
`

const SectionLogin = styled('section')`
  flex-basis: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: #F0F0F0;

  @media ${deviceBreakPoint.tablet} {
    flex-basis: 100%;
  }
`

const LoginForm = styled('form')`
  width: 300px;
  fieldset {
    margin: 15px 0;
    border-style: solid;
    border-width: 1px 0 0;
    padding: 0;
    legend {
      padding-right: 5px;
    }
  }

  @media ${deviceBreakPoint.mobileL} {
    width: 280px;
  }
`

const IconForm = styled(Icon)`
  &.icon {
    color: #333333;
    text-shadow: 0 5px 10px #4D4D4D4D;
  }
`

const TextHead = styled('div')`
  font-size: 2em;
  color: #333333;
  text-shadow: 0 5px 10px #4D4D4D4D;

  @media ${deviceBreakPoint.mobileL} {
    font-size: 1.8em;
  }
`

// End styled-components -----------------------------

interface LoginWithoutADFSProps {
  todoAuth: ToDoAuth
}

interface FormLogin {
  username: string
  password: string
}

const initFormLogin: FormLogin = {
  username: '',
  password: ''
}

const LoginWithoutADFS: FunctionComponent<LoginWithoutADFSProps> = ({
  todoAuth
}) => {

  const [formLogin, setFormLogin] = useState<FormLogin>(initFormLogin)
  const [formLoginError, setFormLoginError] = useState<FormLogin>(initFormLogin)

  const validateForm = () => {
    const error: FormLogin = { ...initFormLogin }

    if (!formLogin.username.trim()) {
      error.username = 'กรุณาระบุ username'
    }

    if (!formLogin.password.trim()) {
      error.password = 'กรุณาระบุ password'
    }

    setFormLoginError(error)

    return Object.keys(error).every(key => !error[key])
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    const response = await todoAuth.onLoginWithoutADFS(formLogin.username, formLogin.password)

    if (response.isSuccess) {
      await modal.toast({ icon: 'success', title: 'Signed in successfully' })
      Router.push('/home', '/')
    } else {
      modal.toast({ icon: 'error', title: response.error.message })
    }
  }

  return (
    <>
      <SectionHeader>
        <img src='/images/scg-logo.png' />
        <label htmlFor='SCG Logo'>| Smart Planing</label>
      </SectionHeader>
      <SectionBody>
        <SectionLogin>
          <LoginForm onSubmit={onSubmit} method='post'>
            <TextHead>SCG Smart Planing</TextHead>
            <fieldset>
              <legend>Login to your account</legend>
            </fieldset>
            <br />
            <Grid verticalAlign='middle'>
              <Grid.Row>
                <Grid.Column width={2}>
                  <IconForm
                    name='user'
                    size='large'
                    style={formLoginError.username ? { marginBottom: 26 } : undefined}
                  />
                </Grid.Column>
                <Grid.Column width={14}>
                  <Field
                    placeholder='username'
                    value={formLogin.username}
                    errorText={formLoginError.username}
                    onChange={(e, data) => {
                      setFormLogin({ ...formLogin, username: data.value })
                      setFormLoginError({ ...formLoginError, username: '' })
                    }}
                  />
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column width={2}>
                  <IconForm
                    name='key'
                    size='large'
                    style={formLoginError.password ? { marginBottom: 26 } : undefined}
                  />
                </Grid.Column>
                <Grid.Column width={14}>
                  <Field
                    type='password'
                    placeholder='password'
                    value={formLogin.password}
                    errorText={formLoginError.password}
                    onChange={(e, data) => {
                      setFormLogin({ ...formLogin, password: data.value })
                      setFormLoginError({ ...formLoginError, password: '' })
                    }}
                  />
                </Grid.Column>
              </Grid.Row>
            </Grid>
            <br />
            <br />
            <Button
              fluid
              color='blue'
              content='Login'
              icon={{ name: 'sign in' }}
            />
            <Divider horizontal>OR</Divider>
            <Button
              fluid
              as='a'
              color='teal'
              href='/login/adfs'
              content='Login with ADFS'
              icon={{ name: 'sign in' }}
            />
          </LoginForm>
        </SectionLogin>
        <SectionLogo>
          <img src='/images/OnlineREBATE.jpg' />
        </SectionLogo>
      </SectionBody>
    </>
  )
}

const mapDispatchToProps = dispatch => ({
  todoAuth: new ToDoAuth(dispatch)
})

export default connect(null, mapDispatchToProps)(LoginWithoutADFS)