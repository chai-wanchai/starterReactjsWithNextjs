import styled from 'styled-components'
import { connect } from 'react-redux'
import { FunctionComponent } from 'react'
import { Header, Icon, Segment, Divider } from 'semantic-ui-react'
import { RootState } from '../../stores'
import GameLuckyPrizes from '../GameLuckyPrizes'
import { deviceBreakPoint } from '../../utils/css'
const Wrapper = styled('div')`
  background-image : url("/images/yellow-bg.jpg");
  height: 100vh;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  position: fixed;
  width:100%;
`

interface HomeProps {
  userRole?: number
}

const Home: FunctionComponent<HomeProps> = ({
  userRole
}) => {
  return (
    <Wrapper>
      <GameLuckyPrizes></GameLuckyPrizes>
    </Wrapper>
  )
}

const mapStateToProps = ({ auth }: RootState) => ({
  userRole: auth.user.info.role_id
})

export default connect(mapStateToProps, null)(Home)