import React, { Component } from 'react'
import PartyList from '../src/components/Party/PartyList'
import userToken from '../src/utils/userToken'
import router from 'next/router'
interface HomePageProps {
}

class HomePage extends Component<any> {
  componentDidMount(){
    const token = userToken.getUserToken()
    if(!token){
      router.push('/login')
    }
  }

  render() {
    return (
      <>
        <PartyList />
      </>
    )
  }
}

export default HomePage