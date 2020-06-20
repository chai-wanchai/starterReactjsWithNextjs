import styled from 'styled-components'
import { FunctionComponent } from 'react'

const Wrapper = styled('div')`
  height: 80px;
  display: flex;
  color: #FFFFFF;
  align-items: center;
  justify-content: center;
  background-color: #404040;
  /* position: sticky; */
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10;
`

const Footer: FunctionComponent = () => {
  return (
    <Wrapper>
      <div>
        Ⓒ copyright <b>SCG</b>. All Rights Reserved
      </div>
    </Wrapper>
  )
}

export default Footer