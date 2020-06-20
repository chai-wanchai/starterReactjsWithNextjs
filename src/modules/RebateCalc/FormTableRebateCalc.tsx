import jsPDF from 'jspdf'
import moment from 'moment'
import html2canvas from 'html2canvas'
import styled from 'styled-components'
import { FunctionComponent, Fragment, useRef, useState, useEffect } from 'react'
import { Grid, Table, Button, Segment } from 'semantic-ui-react'
import { RebateData } from './index'
import Calendar from '../../components/Calendar'

const ButtonPDF = styled(Button)`
  &.ui.button {
    margin-left: 10px;
  }
`

const TableRowSetionSum = styled(Table.Row)`
  background-color: #D5D8DA;
  & > td {
    border-top: 0 !important;
    padding: 15px !important;
  }
`

const TableRowCompanySum = styled(TableRowSetionSum)`
  background-color: #A3ACB3;
`

const Wrapper = styled(Segment)`
  border-top: 0;
  overflow: auto;
  padding: 0 !important;
  .ui.table {
    border-top: 1px solid rgba(34, 36, 38, 0.1);
    border-bottom: 1px solid rgba(34,36,38, 0.15);
    
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

// End styled-components ------------------------

interface RebateTypeGroup {
  [name: string]: {
    _sum: number
    _name: string
  }
}

interface RebateSectionGroup {
  [name: string]: {
    _sum: number
    _data: RebateTypeGroup
  }
}

interface RebateCompanyGrop {
  [name: string]: {
    _sum: number
    _data: RebateSectionGroup
  }
}

interface FormTableRebateCalcProps {
  baseLine: Date
  onSend: () => void
  rebate: RebateData[]
  onBaseLineChange: (data: Date) => void
}

// End typescript defined -----------------------

const FormTableRebateCalc: FunctionComponent<FormTableRebateCalcProps> = ({
  rebate,
  onSend,
  baseLine,
  onBaseLineChange,
}) => {
  const tableRebateCalcRef = useRef<HTMLDivElement>(null)
  const [rebateGroup, setRebateGroup] = useState<RebateCompanyGrop>({})
  
  const handleSavePDF = () => {
    const doc = new jsPDF()
    const source = tableRebateCalcRef.current
    const options = {
      scrollY: -window.scrollY,
      width: tableRebateCalcRef.current.clientWidth,
      height: tableRebateCalcRef.current.clientHeight
    }

    html2canvas(source, options).then((canvas) => {
      doc.addImage(canvas.toDataURL('image/png'), 'PNG', 5, 5, 200, 0)
      doc.save(`RebateCalc_${moment().format('DD-MMM-YYYY')}.pdf`)
    })
  }

  const handleCreateRebateGrop = () => {
    const result: RebateCompanyGrop = {}

    rebate.forEach(item => {
      // case not have company
      if (!result[item.comp_id]) {
        result[item.comp_id] = { _sum: 0, _data: {} }
      }
      // case have company & not have section
      if (result[item.comp_id] && !result[item.comp_id]._data[item.industry_id]) {
        result[item.comp_id]._sum = result[item.comp_id]._sum + parseFloat(item.amount)
        result[item.comp_id]._data[item.industry_id] = { _sum: 0, _data: {} }

        result[item.comp_id]._data[item.industry_id]._sum = parseFloat(item.amount)
        result[item.comp_id]._data[item.industry_id]._data[
          `${item.rebate_type}_${item.rebate_desc_th}`
        ] = {
          _sum: parseFloat(item.amount),
          _name: item.rebate_desc_th
        }
      } else if (result[item.comp_id] && result[item.comp_id]._data[item.industry_id]) { // case have company & have section
        
        result[item.comp_id]._sum = result[item.comp_id]._sum + parseFloat(item.amount)

        result[item.comp_id]._data[item.industry_id]._sum = result[item.comp_id]._data[item.industry_id]._sum + parseFloat(item.amount)

        if (
          result[item.comp_id]._data[item.industry_id]._data[
            `${item.rebate_type}_${item.rebate_desc_th}`
          ]
        ) {
          result[item.comp_id]._data[item.industry_id]._data[
            `${item.rebate_type}_${item.rebate_desc_th}`
          ]._sum = result[item.comp_id]._data[item.industry_id]._data[
            `${item.rebate_type}_${item.rebate_desc_th}`
          ]._sum + parseFloat(item.amount)
        } else {
          result[item.comp_id]._data[item.industry_id]._data[
            `${item.rebate_type}_${item.rebate_desc_th}`
          ] = {
            _sum: parseFloat(item.amount),
            _name: item.rebate_desc_th
          }
        }
      }
    })

    setRebateGroup(result)
  }

  useEffect(() => {
    handleCreateRebateGrop()
  }, [rebate])

  return (
    <Segment.Group raised>
      <Segment color='blue'>
        <Grid>
          <Grid.Row>
            <Grid.Column computer={4}>
              <Calendar
                value={baseLine}
                onChange={onBaseLineChange}
                placeholder='Rebate Line (DD/MM/YYYY)'
              />
            </Grid.Column>
            <Grid.Column computer={10}>
              <Button
                icon='send'
                color='red'
                onClick={onSend}
                disabled={!baseLine}
                content='ส่งข้อมูลไประบบ SAP'
              />
              <ButtonPDF
                color='blue'
                icon='file pdf'
                content='Download PDF'
                onClick={handleSavePDF}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
      <Wrapper>
        <div ref={tableRebateCalcRef}>
          <Table
            celled
            structured
            textAlign='center'
          >
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Section</Table.HeaderCell>
                <Table.HeaderCell>Rebate Type</Table.HeaderCell>
                <Table.HeaderCell>Name</Table.HeaderCell>
                <Table.HeaderCell>ยอดเงิน</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {
                Object.keys(rebateGroup).map((keyCompany) => (
                  <Fragment key={keyCompany}>
                    {
                      Object.keys(rebateGroup[keyCompany]._data).map((keySection) => (
                        <Fragment key={keySection}>
                          {
                            Object.keys(rebateGroup[keyCompany]._data[keySection]._data).map((keyRebateTypeAndName, index) => (
                              <Table.Row key={index}>
                                {index === 0 &&
                                  <Table.Cell rowSpan={Object.keys(rebateGroup[keyCompany]._data[keySection]._data).length}>
                                    {keySection}
                                  </Table.Cell>
                                }
                                <Table.Cell>{keyRebateTypeAndName.split('_')[0]}</Table.Cell>
                                <Table.Cell>
                                  {rebateGroup[keyCompany]._data[keySection]._data[keyRebateTypeAndName]._name}
                                </Table.Cell>
                                <Table.Cell>
                                  {rebateGroup[keyCompany]._data[keySection]._data[keyRebateTypeAndName]._sum.toLocaleString()}
                                </Table.Cell>
                              </Table.Row>
                            ))
                          }
                          <TableRowSetionSum>
                            <Table.Cell colSpan={3}>Total By Section - {keySection}</Table.Cell>
                            <Table.Cell>{rebateGroup[keyCompany]._data[keySection]._sum.toLocaleString()}</Table.Cell>
                          </TableRowSetionSum>
                        </Fragment>
                      ))
                    }
                    <TableRowCompanySum>
                      <Table.Cell colSpan={3}>Total By Company - {keyCompany}</Table.Cell>
                      <Table.Cell>{rebateGroup[keyCompany]._sum.toLocaleString()}</Table.Cell>
                    </TableRowCompanySum>
                  </Fragment>
                ))
              }
            </Table.Body>
          </Table>
        </div>
      </Wrapper>
    </Segment.Group> 
  )
}

export default FormTableRebateCalc