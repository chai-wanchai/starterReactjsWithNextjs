import moment from 'moment'
import { FormEvent, FunctionComponent } from 'react'
import {
  Grid,
  Button,
  Header,
  Segment,
  DropdownItemProps
} from 'semantic-ui-react'
import { StateForm, StateError } from './index'
import DropDown from '../../components/DropDown'

// End styled-components -------------------------------

interface FormRebateCalcSearchProps {
  form: StateForm
  error: StateError
  onSubmit: (e: FormEvent<HTMLFormElement>) => void
  onFormChange: (key: keyof StateForm, data) => void
}

// End typescript defined ------------------------------

const FormRebateCalcSearch: FunctionComponent<FormRebateCalcSearchProps> = ({
  form,
  error,
  onSubmit,
  onFormChange
}) => {

  const monthPlustwo = moment().add(2, 'month')
  const monthPlusOne = moment().add(1, 'month')
  const monthNow = moment()
  const monthMinusOne = moment().add(-1, 'month')
  const monthMinustwo = moment().add(-2, 'month')


  const optionsRound: DropdownItemProps[] = [
    { key: 'round_1', value: '1', text: 'รอบที่ 1' },
    { key: 'round_2', value: '2', text: 'รอบที่ 2' }
  ]

  const optionDate: DropdownItemProps[] = [
    { key: 'date_1', value: monthPlustwo.format('MMYY'), text: monthPlustwo.format('MM/YYYY') },
    { key: 'date_2', value: monthPlusOne.format('MMYY'), text: monthPlusOne.format('MM/YYYY') },
    { key: 'date_3', value: monthNow.format('MMYY'), text: monthNow.format('MM/YYYY') },
    { key: 'date_4', value: monthMinusOne.format('MMYY'), text: monthMinusOne.format('MM/YYYY') },
    { key: 'date_5', value: monthMinustwo.format('MMYY'), text: monthMinustwo.format('MM/YYYY') },
  ]

  return (
    <form onSubmit={onSubmit}>
      <Segment.Group raised>
        <Segment inverted color='blue'>
          <Header as='h2'>
            <Header.Content>คำนวณยอด Rebate</Header.Content>
          </Header>
        </Segment>
        <Segment>
          <Grid>
            <Grid.Row columns={2}>
              <Grid.Column>
                <DropDown
                  placeholder='...'
                  value={form.month}
                  options={optionDate}
                  errorText={error.month}
                  labelText='กรุณาเลือก เดือน'
                  onChange={(e, data) => onFormChange('month', data.value)}
                />
              </Grid.Column>
              <Grid.Column>
                <DropDown
                  placeholder='...'
                  value={form.round}
                  options={optionsRound}
                  errorText={error.round}
                  labelText='กรุณาเลือก รอบที่'
                  onChange={(e, data) => onFormChange('round', data.value)}
                />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
        <Segment textAlign='right'>
          <Button
            color='blue'
            icon='search'
            content='ตรวจสอบข้อมูล'
          />
        </Segment>
      </Segment.Group>
    </form>
  )
}

export default FormRebateCalcSearch