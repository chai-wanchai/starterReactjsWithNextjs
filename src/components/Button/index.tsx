import styled from 'styled-components'
import { FunctionComponent } from 'react'
import { Button as Btn, ButtonProps } from 'semantic-ui-react'

const Button: FunctionComponent<ButtonProps> = styled(Btn)`
  & {
    min-width: 120px;
    margin-left: 10px;
  }
`

export default Button