import React, { Component } from 'react'
import PartyList from '../src/components/Party/PartyList'
import userToken from '../src/utils/userToken'
import router from 'next/router'
import { WebAppContext } from '../src/intefaces'
import withAuth from '../src/utils/withAuth'
import { Button, Menu } from 'semantic-ui-react'
class HomePage extends Component<any> {
  static async getInitialProps(ctx: WebAppContext) {

    return { layout: 'main' }
  }
  componentDidMount() {
    const token = userToken.getUserToken()
    if (!token) {
      router.push('/login')
    }
  }

  render() {
    return (
      <>
        <div className="nav">
          <span>ปาร์ตี้ทั้งหมด</span>
          <Button floated="right" onClick={() => { router.push('/create_party') }}>สร้างปาร์ตี้</Button>
        </div>
        <div className="content">
          <PartyList />
        </div>
      </>
    )
  }
}

export default HomePage