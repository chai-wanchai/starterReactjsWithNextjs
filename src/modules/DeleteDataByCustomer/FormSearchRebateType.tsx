import { connect } from 'react-redux'
import { FunctionComponent, FormEvent } from 'react'
import { Grid, Header, Segment, DropdownItemProps } from 'semantic-ui-react'
import { RootState } from '../../stores'
import { StateForm, StateError } from './index'
import { setDropDownItemsIdName } from '../../utils/dataUtils'
import Button from '../../components/Button'
import DropDown from '../../components/DropDown'
import Calendar from '../../components/Calendar'

interface FormSearchRebateTypeProps {
  form: StateForm
  error: StateError
  onFormClear: () => void
  onFormChange: (key: keyof StateForm, data) => void
  onSubmit: (e: FormEvent<HTMLFormElement>) => void
  master?: {
    rebateType: DropdownItemProps[]
  }
}

// End typescript defined -------------------------

const FormSearchRebateType: FunctionComponent<FormSearchRebateTypeProps> = ({
  form,
  error,
  master,
  onSubmit,
  onFormClear,
  onFormChange,
}) => {

  const optionsPeriodGroup: DropdownItemProps[] = [
    { key: 'period_group_1', value: '1', text: 'รอบที่ 1' },
    { key: 'period_group_2', value: '2', text: 'รอบที่ 2' }
  ]

  return (
    <form onSubmit={onSubmit}>
      <Segment.Group raised>
        <Segment inverted color='blue'>
          <Header as='h3'>
            <Header.Content>ค้นหา Rebate Type</Header.Content>
          </Header>
        </Segment>
        <Segment>
          <Grid>
            <Grid.Row>
              <Grid.Column computer={6}>
                <DropDown
                  placeholder='...'
                  labelText='Rebate Type'
                  value={form.rebateType}
                  options={master.rebateType}
                  errorText={error.rebateType}
                  onChange={(e, data) => onFormChange('rebateType', data.value)}
                />
              </Grid.Column>
              <Grid.Column computer={4}>
                <Calendar
                  placeholder='...'
                  dateFormat='MMyy'
                  showMonthYearPicker
                  labelText='เดือนปี (mmyy)'
                  errorText={error.period}
                  value={form.period as Date}
                  onChange={date => onFormChange('period', date)}
                />
              </Grid.Column>
              <Grid.Column computer={4}>
                <DropDown
                  placeholder='...'
                  value={form.periodGroup}
                  labelText='กรุณาเลือกรอบที่'
                  options={optionsPeriodGroup}
                  errorText={error.periodGroup}
                  onChange={(e, data) => onFormChange('periodGroup', data.value)}
                />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
        <Segment textAlign='right'>
          <Button
            color='blue'
            icon='search'
            content='ค้นหา'
          />
          <Button
            type='button'
            content='เริ่มงานใหม่'
            onClick={onFormClear}
          />
        </Segment>
      </Segment.Group>
    </form>
  )
}

const mapStateToProps = ({ auth, master }: RootState) => {
  return {
    master: {
      rebateType: master.raw.rebateType.filter(data =>
        auth.user.info.comp_id.split(',').indexOf(data.comp_resp) !== -1
      ).map(setDropDownItemsIdName),
    }
  }
}

export default connect(mapStateToProps, null)(FormSearchRebateType)