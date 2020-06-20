import styled from 'styled-components'
import { FunctionComponent, useState } from 'react'
import { Icon, Input, InputProps } from 'semantic-ui-react'

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

// End styled-components -------------------------

interface NormalFieldProps extends InputProps {
  labelText?: string 
  errorText?: string
}

// End typescript define -------------------------

const NormalField: FunctionComponent<NormalFieldProps> = ({
  type,
  labelText,
  errorText,
  ...props
}) => {
  const [viewType, setViewType] = useState(type)

  return (
    <Wrapper>
      {labelText && <label>{labelText}</label>}
      <Input
        {...props}
        type={viewType}
        error={errorText ? true : false}
        icon={type === 'password'
          ? (
            <Icon
              link
              name={viewType === 'password' ? 'eye' : 'eye slash'}
              onClick={() => setViewType(viewType === 'password' ? 'text' : 'password')}
            />
          ) : (props.icon)
        }
      />
      {errorText && <label className='error'>{errorText}</label>}
    </Wrapper>
  )
}

NormalField.defaultProps = {
  fluid: true,
  placeholder: 'Please enter'
}

export default NormalField