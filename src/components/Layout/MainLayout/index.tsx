import styled, { createGlobalStyle } from 'styled-components'
import { FunctionComponent } from 'react'
import { Menu } from 'semantic-ui-react'

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
const MainLayout: FunctionComponent = ({
  children
}) => (
  <>
    {children}
  </>
)

export default MainLayout