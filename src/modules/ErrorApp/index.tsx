import styled, { createGlobalStyle } from 'styled-components'
import { useRouter } from 'next/router'
import { Button, Divider } from 'semantic-ui-react'
import { FunctionComponent } from 'react'
import { deviceBreakPoint } from '../../utils/css'

const ContentRight = styled('div')`
  padding: 24px;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: calc(50% - 3px);

  @media ${deviceBreakPoint.tablet} {
    width: 80%;
  }
`

const ContentLeft = styled(ContentRight)`
  & > img {
    width: 100%;
    max-width: 350px;
  }
`

const ErrorCode = styled('p')`
  margin: 0;
  line-height: 1;
  font-size: 90px;
  font-weight: bold;
  text-align: center;
  font-style: normal;
  font-stretch: normal;
  letter-spacing: normal;
  color: #141E32;
  &::first-letter {
    text-transform: uppercase;
  }
`

const ErrorCodeTitle = styled(ErrorCode)`
  line-height: 1.2;
  font-size: 20px;
  margin-bottom: 15px;
  color: #424A5A;
`

const ErrorDescription = styled('p')`
  margin: 0;
  font-size: 16px;
  text-align: center;
  color: #788796;
  &::first-letter {
    text-transform: uppercase;
  }
`

const Wrapper = styled('div')`
  width: 100%;
  margin: 20px auto;
  display: flex;
  padding: 40px 0;
  max-width: 850px;
  border-radius: 10px;
  background-color: #FFFFFF;
  box-shadow: 0 5px 10px 0 rgba(20, 30, 50, 0.1);

  @media ${deviceBreakPoint.tablet} {
    flex-direction: column;
    align-items: center;
    margin-bottom: 40px;
    width: calc(100% - 16px);
  }
`

const GlobalStyle = createGlobalStyle`
  body {
    background-color: #EFF2F7;
  }
`

// End styled-components -------------------------------

interface ErrorProps {
  statusCode: number
  codeTitle: string
  title: string
  message: string
}

// End typescript defined -------------------------------

const Error: FunctionComponent<ErrorProps> = ({
  statusCode,
  codeTitle,
  title,
  message
}) => {
  const router = useRouter()

  return (
    <>
      <GlobalStyle />
      <Wrapper>
        <ContentLeft>
          <img src='/images/img-background-error.png' />
        </ContentLeft>
        <ContentRight>
          <ErrorCode>{statusCode || 'Oops!!'}</ErrorCode>
          <ErrorCodeTitle>{codeTitle}</ErrorCodeTitle>
          <ErrorDescription>{title}</ErrorDescription>
          <ErrorDescription>{message}</ErrorDescription>
          <Divider hidden />
          <Button
            color='blue'
            content='Go to Homepage'
            onClick={() => router.push('/home', '/')}
          />
        </ContentRight>
      </Wrapper>
    </>
  )
}

export default Error
