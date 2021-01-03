import styled from 'styled-components'
import { FunctionComponent } from 'react'
import { deviceBreakPoint } from '../../utils/css'
import modal from '../../utils/modal'
import dynamic from 'next/dynamic'
export const WrapperBackground = styled('div')`
  background-image : url("/images/yellow-bg.jpg");
  height: 100vh;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  position: fixed;
  width:100%;
`
const Title = styled('h1')`
	text-align:center;
	margin-top:2rem !important;
	font-size: 3rem;
  font-weight: 800;
`

interface HomeProps {
}

const QrReader = dynamic<any>(
  () => import('react-qr-reader'),
  { ssr: false }
)
const Home: FunctionComponent<HomeProps> = () => {
  const handleError = (err:Error) => {
    if (err) {
      modal.error(err.message)
    }
  }
  const handleScan = (data) => {
    if (data) {
      window.open(data, "_self")
    }
  }
  return (
    <WrapperBackground>
      <Title>Game Prizes</Title>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <QrReader
          showViewFinder={true}
          delay={300}
          onError={handleError}
          onScan={handleScan}
          style={{ width: '300px', height: '300px' }}
        />
      </div>

    </WrapperBackground>
  )
}

export default Home