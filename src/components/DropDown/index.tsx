import styled from 'styled-components'
import { forwardRef } from 'react'
import { Dropdown, DropdownProps } from 'semantic-ui-react'

const Wrapper = styled('div')`  
  & > label {
    margin-bottom: 5px;
    display: inline-block;
  }
  & > label.error {
    color: red;
    margin-top: 5px;
    display: inline-block;
  }
`

// End styled-components ----------------------

interface DropDownProps extends DropdownProps {
  labelText?: string
  errorText?: string
}

const DropDown = forwardRef<HTMLDivElement, DropDownProps>(({
  labelText,
  errorText,
  ...props
}, ref) => (
  <Wrapper ref={ref}>
    {labelText &&
      <label>{labelText}</label>
    }
    <Dropdown
      {...props}
      error={errorText ? true : false}
    />
    {errorText &&
      <label className='error'>{errorText}</label>
    }
  </Wrapper>
))

DropDown.defaultProps = {
  fluid: true,
  options: [],
  search: true,
  clearable: true,
  selection: true,
  selectOnBlur: false,
  placeholder: 'Please select'
}

export default DropDown