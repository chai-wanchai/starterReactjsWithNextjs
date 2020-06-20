import styled, { createGlobalStyle } from 'styled-components'
import { FunctionComponent } from 'react'
import Header from './Header'
import Footer from './Footer'
import MenuCustom from '../../Menu'

const GlobalLayoutStyle = createGlobalStyle`
  body {
    position: relative;
    background-color: #FFFFFF;
  }
  html,
  body,
  .ui.menu,
  .ui.table,
  .ui.header,
  .ui.input > input {
    font-family: 'K2D', sans-serif;
  }
`

const Body = styled('div')`
  width: 100%;
  margin: 0 auto;
  min-width: 910px;
  max-width: 1140px;
  min-height: calc(
    100vh - (
      60px + /** header size */
      80px /** footer size */
      +50px
    )
  );
  padding: 20px 0;
  /* overflow: auto; */
  

  @media (max-width: 1140px) {
    padding: 20px 7.5px;
  }
`
const menu = [
  {
    menu_id: 1,
    menu_desc: 'Dashboard',
    menu_path: '/dashboard',
    menu_order: 1
  }, {
    menu_id: 2,
    menu_desc: 'Desk Reservation',
    menu_path: '/desk-reservation',
    menu_order: 2
  }, {
    menu_id: 3,
    menu_desc: 'Job Planing',
    menu_path: '/job-planing',
    menu_order: 3
  }, {
    menu_id: 4,
    menu_desc: 'Report',
    menu_path: '/report',
    menu_order: 4
  }
]
const MainLayout: FunctionComponent = ({
  children
}) => (
    <>
      <GlobalLayoutStyle />
      <Header />
      <MenuCustom menus={menu} activeMenu="/dashboard" />
      <Body>
        {children}
      </Body>
      <Footer />
    </>
  )

export default MainLayout