import styled from 'styled-components'
import { connect } from 'react-redux'
import { FunctionComponent, FormEvent, } from 'react'
import {
  Grid,
  Header,
  Segment,
  DropdownItemProps,
  Button as ButtonSemantic
} from 'semantic-ui-react'
import { RootState } from '../../stores'
import { StateForm, StateError } from './index'
import { setDropDownItemsIdName, setDropDownItemsName } from '../../utils/dataUtils'
import Field from '../../components/Field'
import DropDown from '../../components/DropDown'

const ButtonAdd = styled(ButtonSemantic)`
  & {
    width: 120px;
    margin-right: 5px !important;
  }
`

const ButtonClear = styled(ButtonSemantic)`
  & {
    width: 120px;
    margin-right: 0 !important;
    margin-left: 5px !important;
  }
`

// End styled-component ------------------------

interface FormEditorUserProps {
  form: StateForm
  error: StateError
  isFillForm: boolean
  onClear: () => void
  onSubmit: (e: FormEvent<HTMLFormElement>) => void
  onFormChange: (key: keyof StateForm, data) => void
  master: {
    erp: DropdownItemProps[]
    role: DropdownItemProps[]
    rebateType: DropdownItemProps[]
    company: DropdownItemProps[]
  }
}

// End typescript defined ----------------------

const FormEditUser: FunctionComponent<FormEditorUserProps> = ({
  form,
  error,
  master,
  onClear,
  onSubmit,
  isFillForm,
  onFormChange
}) => (
  <form onSubmit={onSubmit}>
    <Segment.Group raised>
      <Segment inverted color='blue'>
        <Header as='h2'>
          <Header.Content>จัดการผู้ใช้งาน</Header.Content>
        </Header>
      </Segment>
      <Segment>
        <Grid>
          <Grid.Row>
            <Grid.Column computer={4}>
              <Field
                value={form.uid}
                placeholder='...'
                labelText='ไอดีผู้ใช้งาน'
                errorText={error.uid}
                disabled={isFillForm}
                onChange={(e, data) => onFormChange('uid', data.value.trim())}
              />
            </Grid.Column>
            <Grid.Column computer={4}>
              <Field
                labelText='ชื่อจริง'
                placeholder='...'
                value={form.firstName}
                errorText={error.firstName}
                onChange={(e, data) => onFormChange('firstName', data.value)}
              />
            </Grid.Column>
            <Grid.Column computer={4}>
              <Field
                labelText='นามสกุล'
                placeholder='...'
                value={form.lastName}
                errorText={error.lastName}
                onChange={(e, data) => onFormChange('lastName', data.value)}
              />
            </Grid.Column>
            <Grid.Column computer={4}>
              <Field
                labelText='Email'
                placeholder='...'
                value={form.email}
                errorText={error.email}
                onChange={(e, data) => onFormChange('email', data.value)}
              />
            </Grid.Column>
            <Grid.Column computer={8}>
              <DropDown
                multiple
                placeholder='...'
                clearable={false}
                labelText='Company'
                value={form.company}
                options={master.company}
                errorText={error.company}
                onChange={(e, data) => onFormChange('company', data.value)}
              />
            </Grid.Column>
            <Grid.Column computer={4}>
              <DropDown
                labelText='ERP'
                placeholder='...'
                options={master.erp}
                value={form.erp}
                errorText={error.erp}
                onChange={(e, data) => onFormChange('erp', data.value)}
              />
            </Grid.Column>
            <Grid.Column computer={4}>
              <DropDown
                labelText='Role'
                placeholder='...'
                options={master.role}
                value={form.role}
                errorText={error.role}
                onChange={(e, data) => onFormChange('role', data.value)}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
      <Segment textAlign='right'>
        {isFillForm ? (
          <ButtonAdd
            color='yellow'
            content='แก้ไขข้อมูล'
          />
        ) : (
          <ButtonAdd
            color='blue'
            content='เพิ่มข้อมูล'
          />
        )}
        <ButtonClear
          color='grey'
          type='button'
          onClick={onClear}
          content='เริ่มงานใหม่'
        />
      </Segment>
    </Segment.Group>
  </form>
)

const mapStateToProps = ({ master }: RootState) => ({
  master: {
    role: master.raw.role.map(setDropDownItemsName),
    erp: master.raw.destinationType.map(setDropDownItemsName),
    rebateType: master.raw.templateType.map(setDropDownItemsIdName),
    company: master.raw.company.filter(
      comp => comp.comp_type === 'C'
    ).map(setDropDownItemsIdName),
  }
})

export default connect(mapStateToProps, null)(FormEditUser)