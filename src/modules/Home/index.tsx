import styled from 'styled-components'
import { connect } from 'react-redux'
import { FunctionComponent } from 'react'
import { Header, Icon, Segment, Divider } from 'semantic-ui-react'
import { RootState } from '../../stores'

const Wrapper = styled('div')`
  margin: 20px 0;
`

interface HomeProps {
  userRole?: number
}

const Home: FunctionComponent<HomeProps> = ({
  userRole
}) => {
  return (
    <Wrapper>
      {[1, 3, 4, 5].indexOf(userRole) !== -1 &&
        <>
          <Header as='h2' color='blue'>
            <Header.Content>
              การเตรียม File สำหรับ Upload ไม่มีรายระเอียด &nbsp;
            </Header.Content>
            <Segment placeholder>
              <u>
                <a href='/document/template_no_detail.xlsx' download>
                  <Icon name='file excel' />
                  download
                </a>
              </u>
              <Divider />
              <img src='/images/nodetail.png' />
            </Segment>
          </Header>
        </>
      }
      {[3, 4, 5].indexOf(userRole) !== -1 && <Divider hidden />}
      {[2, 3, 4, 5].indexOf(userRole) !== -1 &&
        <>
          <Header as='h2' color='blue'>
            <Header.Content>การเตรียม File สำหรับ Upload มีรายระเอียด</Header.Content>
            <Segment placeholder>
              <u>
                <a href='/document/template_with_detail.xlsx' download>
                  <Icon name='file excel' />
                  download
                </a>
              </u>
              <Divider />
              <img src='/images/detail.png' />
            </Segment>
          </Header>
        </>
      }
    </Wrapper>
  )
}

const mapStateToProps = ({ auth }: RootState) => ({
  userRole: auth.user.info.role_id
})

export default connect(mapStateToProps, null)(Home)