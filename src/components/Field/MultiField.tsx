import styled, { css } from 'styled-components'
import { FunctionComponent, KeyboardEvent, useState } from 'react'
import { Label, Icon, Input, InputProps } from 'semantic-ui-react'

const ContentTag = styled('div')`
  & > .ui.label {
    margin: 5px 0 0 5px;
  }
`

const ContainerField = styled('div')<{isFocus: boolean}>`
  border-radius: .28571429rem;
  border: 1px solid rgba(34,36,38, 0.15);

  ${({ isFocus }) => isFocus && css`
    border: 1px solid #85b7d9;
  `}

  & > {
    .ui.input > input {
      border-color: transparent;
      &:focus {
        border-color: transparent;
      }
    }
  }
`

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

// End styled-components --------------------------

interface MultiFieldProps extends InputProps {
  items?: any[]
  labelText?: string
  errorText?: string
  commandCtrlEnable: boolean
  commandSelect: number | null
  onSelect?: (data: any[]) => void
}

// End typescript define --------------------------

const MultiField: FunctionComponent<MultiFieldProps> = ({
  items,
  onSelect,
  labelText,
  errorText,
  commandSelect,
  commandCtrlEnable,
  ...props
}) => {
  const [field, setField] = useState('')
  const [isFocus, setIsFocus] = useState(false)
  const [fietKeyUp, setFitstKeyUp] = useState(false)

  const handleKeyDown = (e: KeyboardEvent) => {

    if (e.keyCode === commandSelect && commandCtrlEnable) {

      if (e.ctrlKey) {
        setFitstKeyUp(true)
      }

    } else if (e.keyCode === commandSelect && !commandCtrlEnable) {
      e.preventDefault()
    }

  }

  const handleKeyUp = (e: KeyboardEvent) => {

    if (e.keyCode === commandSelect && commandCtrlEnable) {

      if (fietKeyUp && onSelect && field !== '') {
        onSelect([ ...items, field ])
        setField('')
        setFitstKeyUp(false)
      }

    } else if (e.keyCode === commandSelect && !commandCtrlEnable) {

      if (onSelect && field !== '') {
        onSelect([ ...items, field ])
        setField('')
        setFitstKeyUp(false)
      }

    }

  }

  return (
    <Wrapper>
      {labelText && <label>{labelText}</label>}
      <ContainerField isFocus={isFocus}>
        <ContentTag>
          {
            items.map((tag, index) =>
              <Label
                key={`${tag}-${index}`}
                color='red'
              >
                {tag}
                <Icon
                  name='delete'
                  onClick={() => {
                    const tags = [...items]
                    tags.splice(index, 1)
                    if (onSelect) {
                      onSelect(tags)
                    }
                  }}
                />
              </Label>
            )
          }
        </ContentTag>
        <Input
          {...props}
          value={field}
          onKeyUp={handleKeyUp}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocus(true)}
          onBlur={() => {
            setField('')
            setIsFocus(false)
          }}
          error={errorText ? true : false}
          onChange={(e, data) => setField(data.value)}
        /> 
      </ContainerField>
      {errorText && <label className='error'>{errorText}</label>}
    </Wrapper>
  )
}

MultiField.defaultProps = {
  items: [],
  fluid: true,
  placeholder: 'Please enter'
}

export default MultiField