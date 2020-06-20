import { FunctionComponent } from 'react'
import { Popup, InputProps } from 'semantic-ui-react'
import MultiField from './MultiField'
import NormalField from './NormalField'

interface FieldProps extends InputProps {
  fieldType?: 'normal' | 'multi'
  items?: any[]
  labelText?: string
  errorText?: string
  commandSelectText?: string
  commandCtrlEnable?: boolean
  commandSelect?: number | null
  onSelect?: (data: any[]) => void
}

const Field: FunctionComponent<FieldProps> = ({
  items,
  onSelect,
  fieldType,
  commandSelect,
  commandCtrlEnable,
  commandSelectText,
  ...props
}) => {
  switch (fieldType) {
    case 'normal':
      return <NormalField {...props} />
    case 'multi':
      return (
        <Popup
          position='bottom center'
          content={
            <>
              Press
              &nbsp;
              <span style={{ color: 'red'  }}>{commandSelectText}</span>
              &nbsp;
              to select value
            </>
          }
          trigger={
            <MultiField
              items={items}
              onSelect={onSelect}
              commandSelect={commandSelect}
              commandCtrlEnable={commandCtrlEnable}
              {...props}
            />
          }
        />
      )
  }
}

Field.defaultProps = {
  fieldType: 'normal',
  commandSelectText: '[ CTRL + , ]',
  commandCtrlEnable: true, // KeyBoard ctrl
  commandSelect: 188 // KeyBoard ,
}

export default Field