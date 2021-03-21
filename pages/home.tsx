import { Component } from 'react'
import { AppPageProps, WebAppContext } from '../src/intefaces'
import withAuth from '../src/utils/withAuth'
import Home from '../src/modules/Home'

interface HomePageProps {
}

class HomePage extends Component<HomePageProps> {
  // static getInitialProps = (ctx: RebateAppContext) => withAuth(ctx).then<AppPageProps>((props) => ({
  //   ...props,
  //   layout: 'main'
  // }))
  
  render() {
    return (
      <>
      Home
      </>
    )
  }
}

export default HomePage