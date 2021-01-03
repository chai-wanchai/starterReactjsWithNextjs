import { Component } from 'react'
import { RebateAppPageProps, RebateAppContext } from '../src/intefaces'
import withAuth from '../src/utils/withAuth'
import Home from '../src/modules/Home'

interface HomePageProps {
}

class HomePage extends Component<HomePageProps> {
  // static getInitialProps = (ctx: RebateAppContext) => withAuth(ctx).then<RebateAppPageProps>((props) => ({
  //   ...props,
  //   layout: 'main'
  // }))
  
  render() {
    return (
      <Home />
    )
  }
}

export default HomePage