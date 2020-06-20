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
import { setDropDownItemsIdName } from '../../utils/dataUtils'
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

interface FormRebateTypeProps {
  form: StateForm
  error: StateError
  isFillForm: boolean
  onClear: () => void
  onSubmit: (e: FormEvent<HTMLFormElement>) => void
  onFormChange: (key: keyof StateForm, data) => void
  master: {
    company: DropdownItemProps[]
  }
}

// End typescript defined ----------------------

const FormRebateType: FunctionComponent<FormRebateTypeProps> = ({
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
          <Header.Content>จัดการ Rebate Type</Header.Content>
        </Header>
      </Segment>
      <Segment>
        <Grid>
          <Grid.Row columns={2}>
            <Grid.Column>
              <Field
                placeholder='...'
                disabled={isFillForm}
                labelText='Rebate Type'
                value={form.rebateType}
                errorText={error.rebateType}
                onChange={(e, data) => onFormChange('rebateType', data.value)}
              />
            </Grid.Column>
            <Grid.Column>
              <DropDown
                placeholder='...'
                options={master.company}
                value={form.compResponse}
                labelText='Comp. Response'
                errorText={error.compResponse}
                onChange={(e, data) => onFormChange('compResponse', data.value)}
              />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row columns={2}>
            <Grid.Column>
              <Field
                placeholder='...'
                value={form.rebateDesTH}
                errorText={error.rebateDesTH}
                labelText='Rebate Description THAI'
                onChange={(e, data) => onFormChange('rebateDesTH', data.value)}
              />
            </Grid.Column>
            <Grid.Column>
              <Field
                placeholder='...'
                value={form.rebateDesEN}
                errorText={error.rebateDesEN}
                labelText='Rebate Description ENG'
                onChange={(e, data) => onFormChange('rebateDesEN', data.value)}
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

const mapStateToProps = ({ auth, master }: RootState) => {
  const { comp_id } = auth.user.info
  const uComps = comp_id.split(',')
  return {
    master: {
      company: master.raw.company
      .filter(com =>
        com.comp_type === 'C' &&
        uComps.indexOf(com.id) !== -1
      )
      .map(setDropDownItemsIdName)
    }
  }
}

export default connect(mapStateToProps, null)(FormRebateType)