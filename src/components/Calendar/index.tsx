import styled from 'styled-components'
import DatePicker from 'react-datepicker'
import { FunctionComponent } from 'react'
import { Input, InputProps } from 'semantic-ui-react'

const Wrapper = styled('div')`
  .react-datepicker-wrapper {
    display: block;
  }
  .react-datepicker-popper {
    z-index: 1000; /** Not sure effect all component */
  }

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

interface CalendarProps {
  errorText?: string
  labelText?: string
  value?: Date
  minDate?: Date
  maxDate?: Date
  dateFormat?: string
  placeholder?: string
  showMonthYearPicker?: boolean
  onChange?: (date: Date) => void
  inputOption?: InputProps
}

const Calendar: FunctionComponent<CalendarProps> = ({
  errorText,
  labelText,
  value,
  minDate,
  maxDate,
  onChange,
  dateFormat,
  placeholder,
  showMonthYearPicker,
  inputOption
}) => (
  <Wrapper>
    {labelText && <label htmlFor='calendar'>{labelText}</label>}
    <DatePicker
      selected={value}
      minDate={minDate}
      maxDate={maxDate}
      onChange={onChange}
      dateFormat={dateFormat}
      placeholderText={placeholder}
      showMonthYearPicker={showMonthYearPicker}
      customInput={
        <Input
          fluid
          icon='calendar alternate outline'
          {...inputOption}
          error={errorText ? true : false}
        />
      }
    />
    {errorText && <label className='error' htmlFor='calendar error'>{errorText}</label>}
  </Wrapper>
)

Calendar.defaultProps = {
  placeholder: 'Select date',
  dateFormat: 'dd/MM/yyyy',
  showMonthYearPicker: false
}

export default Calendar