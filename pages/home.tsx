import React, { Component } from 'react'
import { AppPageProps, WebAppContext } from '../src/intefaces'
import withAuth from '../src/utils/withAuth'
import Home from '../src/modules/Home'
import PartyList from '../src/components/Party/PartyList'

interface HomePageProps {
}

class HomePage extends Component<any> {
  // static getInitialProps = (ctx: WebAppContext) => withAuth(ctx).then<AppPageProps>((props) => ({
  //   ...props,
  //   layout: 'main'
  // }))

  render() {
    return (
      <>
        <PartyList />
      </>
    )
  }
}

export default HomePage