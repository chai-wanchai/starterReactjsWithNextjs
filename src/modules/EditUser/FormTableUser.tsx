import styled from 'styled-components'
import { connect } from 'react-redux'
import { FunctionComponent, Fragment, FormEvent } from 'react'
import {
  Table,
  Segment,
  Divider,
  Checkbox,
  CheckboxProps,
  Button as ButtonSemantic
} from 'semantic-ui-react'
import { RootState } from '../../stores'
import { UserProfile } from './index'

const ButtonSave = styled(ButtonSemantic)`
  & {
    width: 120px;
    margin-right: 5px !important;
  }
`

const ButtonDelete = styled(ButtonSemantic)`
  & {
    width: 120px;
    margin-right: 0 !important;
    margin-left: 5px !important;
  }
`

const Wrapper = styled(Segment)`
  overflow: auto;
  padding: 0 !important;
  .ui.table {
    border: 0;
    border-bottom: 1px solid rgba(34,36,38,.15);
    
    thead th {
      font-weight: 300;
      color: #FFFFFF;
      background-color: #2085D0;
    }

  }
`
// End styled-component ------------------------------

interface MasterItem {
  id: number
  name: string
}

interface FormTableUserProps {
  user: UserProfile[]
  profile: UserProfile
  onFormSave: () => Promise<any>
  onFormCheck: (val: any) => void
  onFormDelete: () => Promise<any>
  master: {
    erp: MasterItem[]
    role: MasterItem[]
    company: MasterItem[]
  }
}

// End typescript defined ----------------------------

const FormTableUser: FunctionComponent<FormTableUserProps> = ({
  user,
  master,
  profile,
  onFormSave,
  onFormCheck,
  onFormDelete
}) => {

  const handleSelect = (e: FormEvent<HTMLInputElement>, data: CheckboxProps) => {
    e.preventDefault()
    onFormCheck(data.name)
  }

  return (
    <Segment.Group raised>
      <Wrapper>
        <Table celled textAlign='center'>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>เลือก</Table.HeaderCell>
              <Table.HeaderCell>ไอดีผู้ใช้งาน</Table.HeaderCell>
              <Table.HeaderCell>ชื่อจริง</Table.HeaderCell>
              <Table.HeaderCell>นามสกุล</Table.HeaderCell>
              <Table.HeaderCell>Email</Table.HeaderCell>
              <Table.HeaderCell>Company</Table.HeaderCell>
              <Table.HeaderCell>ERP</Table.HeaderCell>
              <Table.HeaderCell>Role</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {
              user.map((u) => {
                const userComps = u.comp_id.split(',')
                const company = master.company.filter(com =>userComps.indexOf(com.id) !== -1)
                const erp = master.erp.find(erp => erp.id === u.destination_type)
                const role = master.role.find(role => role.id === u.role_id)

                return (
                  <Table.Row
                    key={u.user_id}
                    warning={profile.user_id === u.user_id}
                    disabled={profile.user_id
                      ? profile.user_id !== u.user_id : false
                    }
                  >
                    <Table.Cell>
                      <Checkbox
                        name={u.user_id}
                        onChange={handleSelect}
                        checked={profile.user_id === u.user_id}
                      />
                    </Table.Cell>
                    <Table.Cell>{u.user_id}</Table.Cell>
                    <Table.Cell>{u.user_fname}</Table.Cell>
                    <Table.Cell>{u.user_lname}</Table.Cell>
                    <Table.Cell>{u.email}</Table.Cell>
                    <Table.Cell>
                      {company.length > 0
                        ?  company.map((com, index) => (
                            <Fragment key={com.id}>
                              {com.id} - {com.name}
                              {(index + 1 < company.length) && <Divider />}
                            </Fragment>
                          ))
                        : '-'
                      }
                    </Table.Cell>
                    <Table.Cell>{erp ? erp.name : '-'}</Table.Cell>
                    <Table.Cell>{role ? role.name : '-'}</Table.Cell>
                  </Table.Row>
                )
              })
            }
          </Table.Body>
        </Table>
      </Wrapper>
      <Segment textAlign='right'>
        <ButtonSave
          icon='save'
          color='green'
          content='บันทึก'
          onClick={onFormSave}
          disabled={!profile.user_id}
        />
        <ButtonDelete
          color='red'
          content='ลบ'
          icon='trash'
          type='button'
          onClick={onFormDelete}
          disabled={!profile.user_id}
        />
      </Segment>
    </Segment.Group>
  )
}

const mapStateToProps = ({ master }: RootState) => ({
  master: {
    role: master.raw.role,
    erp: master.raw.destinationType,
    company: master.raw.company.filter(com => com.comp_type === 'C')
  }
})

export default connect(mapStateToProps, null)(FormTableUser)