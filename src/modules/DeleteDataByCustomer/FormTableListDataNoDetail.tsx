import styled from 'styled-components'
import { Table, Button, Segment } from 'semantic-ui-react'
import { FunctionComponent } from 'react'
import { StateListNoDetail } from './index'

const Wrapper = styled(Segment)`
  overflow: auto;
  position: relative;
  padding: 0 !important;
  .ui.table {
    border: 0;
    border-bottom: 1px solid rgba(34,36,38,.15);
    thead th {
      color: #FFFFFF;
      font-weight: 300;
      background-color: #2085D0;
      &:last-child, &:first-child {
        border-radius: 0 !important;
      }
      &:last-child {
        border-right: 1px solid #2085D0;
      }
    }
  }
`

// End styled-components --------------------------

interface FormTableListDataNoDetailProps {
  list: StateListNoDetail[]
  onDelete: () => void
}

// End typescript defined ------------------------

const FormTableListDataNoDetail: FunctionComponent<FormTableListDataNoDetailProps> = ({
  list,
  onDelete
}) => {
  return (
    <Segment.Group raised>
      <Segment textAlign='right'>
        <Button
          color='red'
          icon='trash'
          content='ลบทั้งหมด'
          onClick={onDelete}
        />
      </Segment>
      <Wrapper>
        <Table celled textAlign='center'>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>ลำดับ</Table.HeaderCell>
              <Table.HeaderCell>รหัสลูกค้า</Table.HeaderCell>
              <Table.HeaderCell>จำนวนเงิน</Table.HeaderCell>
              <Table.HeaderCell>Rebate Type</Table.HeaderCell>
              <Table.HeaderCell>Company</Table.HeaderCell>
              <Table.HeaderCell>เดือนปี</Table.HeaderCell>
              <Table.HeaderCell>Section</Table.HeaderCell>
              <Table.HeaderCell>Comp. Affi</Table.HeaderCell>
              <Table.HeaderCell>Product Hierachy</Table.HeaderCell>
              <Table.HeaderCell>Plant</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {
              list.map((item, index) => (
                <Table.Row key={item.id}>
                  <Table.Cell>{index + 1}</Table.Cell>
                  <Table.Cell>{item.customerId}</Table.Cell>
                  <Table.Cell>{item.amount ? item.amount.toLocaleString() : ''}</Table.Cell>
                  <Table.Cell>{item.rebateType}</Table.Cell>
                  <Table.Cell>{item.companyId}</Table.Cell>
                  <Table.Cell>{item.period}</Table.Cell>
                  <Table.Cell>{item.section}</Table.Cell>
                  <Table.Cell>{item.compAffi}</Table.Cell>
                  <Table.Cell>{item.productHierachy}</Table.Cell>
                  <Table.Cell>{item.plant}</Table.Cell>
                </Table.Row>
              ))
            }
          </Table.Body>
        </Table>
      </Wrapper>
    </Segment.Group>
  )
}

export default FormTableListDataNoDetail