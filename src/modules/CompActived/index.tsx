import moment from 'moment'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { useRouter } from 'next/router'
import { FormEvent, FunctionComponent, useState } from 'react'
import { Segment, Table, Button, Checkbox, CheckboxProps } from 'semantic-ui-react'
import { RootState } from '../../stores'
import { compActivedApi } from '../../api/CompActivedApi'
import modal from '../../utils/modal'

const Wrapper = styled('form')`
  .ui.table {
    border-bottom: 1px solid rgba(34,36,38,.15);
    
    thead th {
      color: #FFFFFF;
      font-weight: 300;
      background-color: #2085D0;
    }

    tbody td.error, tbody tr.error {
      color: #FFFFFF !important;
      background-color: #F94444 !important;
    }

  }
`

// End styled-components --------------------------

interface CompanyItem {
  comp_type: 'A' | 'C'
  full_name: string
  id: string
  is_actived: '0' | '1'
  name: string
  updated_by: string
  updated_date: string
}

interface CompActivedProps {
  utk: string
  master?: {
    company: CompanyItem[]
  }
}

const CompActived: FunctionComponent<CompActivedProps> = ({
  utk,
  master
}) => {
  const router = useRouter()
  const [list, setList] = useState<CompanyItem[]>(master.company)

  const handleSelect = (e: FormEvent<HTMLInputElement>, data: CheckboxProps) => {
    const [, idx] = data.name.split('_')
    list[parseFloat(idx)].is_actived = data.checked ? '0' : '1'
    setList([ ...list ])
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    const confirm = await modal.confirm('ยืนยันการบันทึกข้อมูล')

    if (!confirm.value) {
      return
    }

    const response = await compActivedApi.saveData(list, utk)

    if (response.isSuccess) {
      await modal.open({ type: 'success', title: 'บันทึกข้อมูล Success' })
      router.reload()
    } else {
      modal.error(response.error.message)
    }
  }

  return (
    <Wrapper onSubmit={handleSubmit}>
      <Segment.Group raised>
        <Segment textAlign='right'>
          <Button
            icon='save'
            color='green'
            content='บันทึก'
          />
        </Segment>
        <Segment>
          <Table celled textAlign='center'>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>ปิดการใช้งานชั่วคราว</Table.HeaderCell>
                <Table.HeaderCell>Company Id</Table.HeaderCell>
                <Table.HeaderCell>Company Name</Table.HeaderCell>
                <Table.HeaderCell>ผู้แก้ไขล่าสุด</Table.HeaderCell>
                <Table.HeaderCell>วันที่แก้ไขล่าสุด</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {
                list.map((item, index) => (
                  <Table.Row key={item.id}>
                    <Table.Cell>
                      <Checkbox
                        onChange={handleSelect}
                        name={`${item.id}_${index}`}
                        checked={item.is_actived === '0'}
                      />
                    </Table.Cell>
                    <Table.Cell>{item.id}</Table.Cell>
                    <Table.Cell>{item.name}</Table.Cell>
                    <Table.Cell>{item.updated_by}</Table.Cell>
                    <Table.Cell>
                      {item.updated_date ? moment(item.updated_date).format('DD/MM/YYYY') : ''}
                    </Table.Cell>
                  </Table.Row>
                ))
              }
            </Table.Body>
          </Table>
        </Segment>
      </Segment.Group>
    </Wrapper>
  )
}

const mapStateToProps = ({ auth, master }: RootState) => {
  const { user, token } = auth
  const uComps = user.info.comp_id.split(',')

  return {
    utk: token,
    master: {
      company: master.raw.company.filter(comp =>
        uComps.indexOf(comp.id) !== -1 &&
        comp.comp_type === 'C'
      )
    }
  }
}

export default connect(mapStateToProps, null)(CompActived)