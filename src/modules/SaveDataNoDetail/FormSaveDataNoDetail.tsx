import { connect } from 'react-redux'
import { FunctionComponent, FormEvent } from 'react'
import {
  List,
  Grid,
  Radio,
  Label,
  Header,
  Segment,
  DropdownItemProps,
} from 'semantic-ui-react'
import { RootState } from '../../stores'
import { StateForm, StateError } from './index'
import { setDropDownItemsIdName } from '../../utils/dataUtils'
import Field from '../../components/Field'
import Button from '../../components/Button'
import DropDown from '../../components/DropDown'
import Calendar from '../../components/Calendar'
import UploadExcel from '../../components/UploadExcel'

// End styled-component -----------------------

interface FormSaveDataNoDetailProps {
  form: StateForm
  error: StateError
  onClear: () => void
  disableRadioR3: boolean
  disableRadioS4: boolean
  onSubmit: (e: FormEvent<HTMLFormElement>) => void
  onFormChange: (key: keyof StateForm, data) => void
  onUploadFileExcel: (data: any) => void
  master?: {
    company: DropdownItemProps[]
    compAffi: DropdownItemProps[]
    rebateType: DropdownItemProps[]
    distribution: DropdownItemProps[]
  }
}

// End typescript defined ----------------------

const FormSaveDataNoDetail: FunctionComponent<FormSaveDataNoDetailProps> = ({
  form,
  error,
  master,
  onClear,
  onSubmit,
  onFormChange,
  disableRadioR3,
  disableRadioS4,
  onUploadFileExcel
}) => {

  const optionsPeriodGroup: DropdownItemProps[] = [
    { key: 'period_group_1', value: '1', text: 'รอบที่ 1' },
    { key: 'period_group_2', value: '2', text: 'รอบที่ 2' }
  ]

  return (
    <form onSubmit={onSubmit} method='post' encType='multipart/form-data'>
      <Segment.Group raised>
        <Segment inverted color='blue'>
          <Header as='h2'>
            <Header.Content>บันทึกข้อมูลแบบไม่มีรายละเอียด</Header.Content>
          </Header>
        </Segment>
        <Segment stacked>
          <List horizontal>
            <List.Item>ERP Type :</List.Item>
            <List.Item>
              <Radio
                label='R3'
                value='R3'
                name='erp'
                disabled={disableRadioR3}
                checked={form.erp === 'R3'}
                onChange={(e, data) => onFormChange('erp', data.value)}
              />
            </List.Item>
            <List.Item>
              <Radio
                label='S4'
                value='S4'
                name='erp'
                disabled={disableRadioS4}
                checked={form.erp === 'S4'}
                onChange={(e, data) => onFormChange('erp', data.value)}
              />
            </List.Item>
            {error.erp &&
              <List.Item style={{ color: 'red' }}>
                * {error.erp}
              </List.Item>
            }
          </List>
          <Label attached='top right'>
            <UploadExcel
              size='mini'
              type='button'
              color='purple'
              icon='file excel'
              content='import excel'
              disabled={form.erp === ''}
              onChange={onUploadFileExcel}
              style={{ minWidth: 70, marginRight: 0 }}
            />
          </Label>
        </Segment>
        <Segment>
          <Grid>
            <Grid.Row>
              <Grid.Column computer={4}>
                <Field
                  placeholder='...'
                  labelText='รหัสลูกค้า'
                  value={form.customerId}
                  errorText={error.customerId}
                  onChange={(e, data) => onFormChange('customerId', data.value)}
                />
              </Grid.Column>
              <Grid.Column computer={6}>
                <DropDown
                  placeholder='...'
                  labelText='Company'
                  value={form.companyId}
                  options={master.company}
                  errorText={error.companyId}
                  onChange={(e, data) => onFormChange('companyId', data.value)}
                />
              </Grid.Column>
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
                  value={form.period as Date}
                  labelText='เดือนปี (mmyy)'
                  errorText={error.period}
                  onChange={date => onFormChange('period', date)}
                />
              </Grid.Column>
              <Grid.Column computer={6}>
                <DropDown
                  placeholder='...'
                  labelText='Comp Affi'
                  value={form.compAffi}
                  options={master.compAffi}
                  errorText={error.compAffi}
                  onChange={(e, data) => onFormChange('compAffi', data.value)}
                />
              </Grid.Column>
              <Grid.Column computer={3}>
                <Field
                  disabled
                  placeholder='...'
                  labelText='Section'
                  value={form.section}
                  errorText={error.section}
                />
              </Grid.Column>
              <Grid.Column computer={3}>
                <Field
                  type='number'
                  placeholder='...'
                  value={form.amount}
                  labelText='จำนวนเงิน'
                  errorText={error.amount}
                  onChange={(e, data) => onFormChange('amount', parseFloat(data.value))}
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
              <Grid.Column computer={3}>
                <Field
                  placeholder='...'
                  labelText='Product Hierachy'
                  value={form.productHierachy}
                  errorText={error.productHierachy}
                  onChange={(e, data) => onFormChange('productHierachy', data.value)}
                />
              </Grid.Column>
              <Grid.Column computer={3}>
                <Field
                  placeholder='...'
                  labelText='Plant'
                  value={form.plant}
                  errorText={error.plant}
                  onChange={(e, data) => onFormChange('plant', data.value)}
                />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
        <Segment textAlign='right'>
          <Button 
            color='blue'
            content='เพิ่มข้อมูล'
          />
          <Button
            color='grey'
            type='button'
            onClick={onClear}
            content='เริ่มงานใหม่'
          />
        </Segment>
      </Segment.Group>
    </form>
  )
}

const mapStateToProps = ({ auth, master }: RootState) => {
  return {
    master: {
      distribution: master.raw.distribution.map(setDropDownItemsIdName),
      company: master.raw.company.filter(
        comp => comp.comp_type === 'C' && comp.is_actived === '1'
      ).map(setDropDownItemsIdName),
      compAffi: master.raw.company.filter(
        comp => comp.comp_type === 'A'
      ).map(setDropDownItemsIdName),
      rebateType: master.raw.rebateType.filter(data =>
        auth.user.info.comp_id.split(',').indexOf(data.comp_resp) !== -1
      ).map(setDropDownItemsIdName),
    }
  }
}

export default connect(mapStateToProps, null)(FormSaveDataNoDetail)