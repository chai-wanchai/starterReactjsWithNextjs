import jsPDF from 'jspdf'
import moment from 'moment'
import html2canvas from 'html2canvas'
import styled from 'styled-components'
import { FormEvent, FunctionComponent, useRef, useState, useEffect } from 'react'
import {
  Icon,
  Grid,
  Label,
  Table,
  Segment,
  Checkbox,
  CheckboxProps,
} from 'semantic-ui-react'
import { StateListNoDetail } from './index'
import Field from '../../components/Field'
import Button from '../../components/Button'

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
    }
  }
`

// End styled-components --------------------------

interface StateSumOfList {
  [name: string]: {
    amount: number
    status: boolean
  }
}

interface StateSummary {
  money: number
  rebate: number
}

interface FormTableListDataNoDetailProps {
  enableSave: boolean
  list: StateListNoDetail[]
  onSave: () => void
  onSelect: () => void
  onDelete: (listId: any[]) => void
  onCheck: (items: StateListNoDetail[]) => void
}

// End typescript defined ------------------------

const initSummary: StateSummary = { money: 0, rebate: 0 }

const FormTableListDataNoDetail: FunctionComponent<FormTableListDataNoDetailProps> = ({
  list,
  onSave,
  onCheck,
  onSelect,
  onDelete,
  enableSave
}) => {
  const tableListAndSumRef = useRef<HTMLDivElement>(null)
  const [isPDF, setIsPDF] = useState<boolean>(false)
  const [items, setItems] = useState<StateListNoDetail[]>([])
  const [sumOfList, setSumOfList] = useState<StateSumOfList>({})
  const [sumAll, setSumAll] = useState<StateSummary>(initSummary)
  const [sumReject, setSumReject] = useState<StateSummary>(initSummary)

  const handleSavePDF = () => {
    const doc = new jsPDF()
    const source = tableListAndSumRef.current
    const options = {
      scrollY: -window.scrollY,
      width: tableListAndSumRef.current.clientWidth,
      height: tableListAndSumRef.current.clientHeight,
    }

    html2canvas(source, options).then((canvas) => {
      doc.addImage(canvas.toDataURL('image/png'), 'PNG', 5, 5, 200, 0)
      doc.save(`DataNoDetailByCustomer_${moment().format('DD-MMM-YYYY')}.pdf`)
      setIsPDF(false)
    })
  }

  const handleSelect = (e: FormEvent<HTMLInputElement>, data: CheckboxProps) => {
    e.preventDefault()
    const [, idx] = data.name.split('_')
    items[parseFloat(idx)].selected = data.checked
    items[parseFloat(idx)].editable = data.checked
    setItems([ ...items ])
    onSelect()
  }

  const handleDelete = () => {
    const listDataId = items.filter(item => item.selected).map(item => item.id)
    onDelete(listDataId)
  }

  const handleChange = (key: keyof StateListNoDetail, id: number, val: any) => {
    items[id] = {
      ...items[id],
      [key]: val,
      error: {
        ...items[id].error,
        [key]: false
      }
    }
    setItems([ ...items ])
  }

  const handleSummaryData = () => {
    const result: StateSumOfList = {}

    list.forEach(item => {
      if (!result[item.rebateType]) {
        result[item.rebateType] = {
          amount: item.amount,
          status: !Object.keys(item.error).some(key => item.error[key])
        }
      } else {
        result[item.rebateType] = {
          amount: item.amount + result[item.rebateType].amount,
          status: result[item.rebateType].status
            ? !Object.keys(item.error).some(key => item.error[key]) : false
        }
      }
    })

    setSumOfList(result)

    const resultAll: StateSummary = Object
      .keys(result)
      .reduce((prve, current) => ({
        rebate: prve.rebate + 1,
        money: prve.money + result[current].amount,
      }), initSummary)

    setSumAll(resultAll)

    const resultReject: StateSummary = Object
      .keys(result)
      .filter(key => !result[key].status)
      .reduce((prve, current) => ({
        rebate: prve.rebate + 1,
        money: prve.money + result[current].amount,
      }), initSummary)

    setSumReject(resultReject)
  }

  useEffect(() => {
    setItems(list)
    handleSummaryData()
  }, [list])

  return (
    <>
      <div style={isPDF ? { overflow: 'auto' } : undefined}>
        <div ref={tableListAndSumRef} style={isPDF ? { width: 1800 } : undefined}>
          <Grid>
            <Grid.Row columns={2}>
              <Grid.Column>
                <Segment.Group raised>
                  <Wrapper>
                    <Table celled textAlign='center'>
                      <Table.Header>
                        <Table.Row>
                          <Table.HeaderCell>Rebate Type</Table.HeaderCell>
                          <Table.HeaderCell>จำนวนเงิน</Table.HeaderCell>
                          <Table.HeaderCell>สถานะ</Table.HeaderCell>
                        </Table.Row>
                      </Table.Header>
                      <Table.Body>
                        {
                          Object.keys(sumOfList).map(key => (
                            <Table.Row key={key}>
                              <Table.Cell>{key}</Table.Cell>
                              <Table.Cell error={!sumOfList[key].status}>
                                {sumOfList[key].amount.toLocaleString()}
                              </Table.Cell>
                              <Table.Cell>
                                <Icon
                                  color={sumOfList[key].status
                                    ? 'green' : 'red'
                                  }
                                  name={sumOfList[key].status
                                    ? 'check' : 'close'
                                  }
                                />
                              </Table.Cell>
                            </Table.Row>
                          ))
                        }
                      </Table.Body>
                    </Table>
                  </Wrapper>
                </Segment.Group>
              </Grid.Column>
              <Grid.Column>
                <Segment.Group raised>
                  <Wrapper>
                    <Table celled textAlign='center'>
                      <Table.Header>
                        <Table.Row>
                          <Table.HeaderCell>สรุปรายการ</Table.HeaderCell>
                          <Table.HeaderCell>จำนวน Rebate Type</Table.HeaderCell>
                          <Table.HeaderCell>จำนวนเงิน</Table.HeaderCell>
                        </Table.Row>
                      </Table.Header>
                      <Table.Body>
                        <Table.Row>
                          <Table.Cell>ข้อมูลทั้งหมด</Table.Cell>
                          <Table.Cell>{sumAll.rebate.toLocaleString()}</Table.Cell>
                          <Table.Cell>{sumAll.money.toLocaleString()}</Table.Cell>
                        </Table.Row>
                        <Table.Row>
                          <Table.Cell>ข้อมูล Reject</Table.Cell>
                          <Table.Cell error={sumReject.rebate > 0}>
                            {sumReject.rebate.toLocaleString()}
                          </Table.Cell>
                          <Table.Cell error={sumReject.money > 0}>
                            {sumReject.money.toLocaleString()}
                          </Table.Cell>
                        </Table.Row>
                      </Table.Body>
                    </Table>
                  </Wrapper>
                </Segment.Group>
              </Grid.Column>
            </Grid.Row>
          </Grid>
          <Segment.Group raised>
            <Wrapper>
              <Table celled textAlign='center' style={{ width: 1800 }}>
                <Table.Header>
                  <Table.Row>
                    {!isPDF &&
                      <Table.HeaderCell>เลือก</Table.HeaderCell>
                    }
                    <Table.HeaderCell>ลำดับ</Table.HeaderCell>
                    <Table.HeaderCell>รหัสลูกค้า</Table.HeaderCell>
                    <Table.HeaderCell>จำนวนเงิน</Table.HeaderCell>
                    <Table.HeaderCell>Rebate Type</Table.HeaderCell>
                    <Table.HeaderCell>Company</Table.HeaderCell>
                    <Table.HeaderCell>เดือนปี</Table.HeaderCell>
                    <Table.HeaderCell>Section</Table.HeaderCell>
                    <Table.HeaderCell>Comp. Affi</Table.HeaderCell>
                    <Table.HeaderCell>รอบที่</Table.HeaderCell>
                    <Table.HeaderCell>Product Hierachy</Table.HeaderCell>
                    <Table.HeaderCell>Plant</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {
                    items.map((item, index) => (
                      <Table.Row key={item.id} warning={item.selected}>
                        {!isPDF &&
                          <Table.Cell>
                            {item.active &&
                              <Checkbox
                                onChange={handleSelect}
                                checked={item.selected}
                                name={`${item.companyId}_${index}`}
                              />
                            }
                          </Table.Cell>
                        }
                        <Table.Cell>{index + 1}</Table.Cell>
                        {item.editable &&
                          <>
                            <Table.Cell>
                              <Field
                                placeholder='...'
                                value={item.customerId}
                                onChange={(e, data) => handleChange('customerId', index, data.value)}
                              />
                            </Table.Cell>
                            <Table.Cell>
                              <Field
                                type='number'
                                placeholder='...'
                                value={item.amount}
                                onChange={(e, data) => handleChange('amount', index, parseFloat(data.value))}
                              />
                            </Table.Cell>
                            <Table.Cell>
                              <Field
                                placeholder='...'
                                value={item.rebateType}
                                onChange={(e, data) => handleChange('rebateType', index, data.value)}
                              />
                            </Table.Cell>
                            <Table.Cell>
                               <Field
                                  placeholder='...'
                                  value={item.companyId}
                                  onChange={(e, data) => handleChange('companyId', index, data.value)}
                                />
                            </Table.Cell>
                            <Table.Cell>
                              <Field
                                placeholder='...'
                                value={item.period}
                                onChange={(e, data) => handleChange('period', index, data.value)}
                              />
                            </Table.Cell>
                            <Table.Cell>
                              <Field
                                placeholder='...'
                                value={item.section}
                                onChange={(e, data) => handleChange('section', index, data.value)}
                              />
                            </Table.Cell>
                            <Table.Cell>
                              <Field
                                placeholder='...'
                                value={item.compAffi}
                                onChange={(e, data) => handleChange('compAffi', index, data.value)}
                              />
                            </Table.Cell>
                            <Table.Cell>
                              <Field
                                placeholder='...'
                                value={item.periodGroup}
                                onChange={(e, data) => handleChange('periodGroup', index, data.value)}
                                action='รอบที่'
                              />
                            </Table.Cell>
                            <Table.Cell>
                              <Field
                                placeholder='...'
                                value={item.productHierachy}
                                onChange={(e, data) => handleChange('productHierachy', index, data.value)}
                              />
                            </Table.Cell>
                            <Table.Cell>
                              <Field
                                placeholder='...'
                                value={item.plant}
                                onChange={(e, data) => handleChange('plant', index, data.value)}
                              />
                            </Table.Cell>
                          </>
                        }
                        {!item.editable &&
                          <>
                            <Table.Cell error={item.error.customerId}>{item.customerId}</Table.Cell>
                            <Table.Cell error={item.error.amount}>{item.amount ? item.amount.toLocaleString() : ''}</Table.Cell>
                            <Table.Cell error={item.error.rebateType}>{item.rebateType}</Table.Cell>
                            <Table.Cell error={item.error.companyId}>{item.companyId}</Table.Cell>
                            <Table.Cell error={item.error.period}>{item.period}</Table.Cell>
                            <Table.Cell error={item.error.section}>{item.section}</Table.Cell>
                            <Table.Cell error={item.error.compAffi}>{item.compAffi}</Table.Cell>
                            <Table.Cell error={item.error.periodGroup}>รอบที่ {item.periodGroup}</Table.Cell>
                            <Table.Cell error={item.error.productHierachy}>{item.productHierachy}</Table.Cell>
                            <Table.Cell error={item.error.plant}>{item.plant}</Table.Cell>
                          </>
                        }
                      </Table.Row>
                    ))
                  }
                </Table.Body>
              </Table>
            </Wrapper>
          </Segment.Group>
        </div>
      </div>
      <Segment.Group horizontal size='mini'>
        <Segment textAlign='right'>
          <Button
            color='blue'
            icon='file pdf'
            content='Download PDF'
            disabled={items.some(item => item.selected)}
            onClick={async () => {
              await setIsPDF(true)
              handleSavePDF()
            }}
          />
        </Segment>
        <Segment textAlign='right'>
          <Button
            color='red'
            disabled={enableSave}
            content='ตรวจสอบเพื่อบันทึก'
            onClick={() => onCheck(items)}
          />
        </Segment>
        <Segment textAlign='right'>
            {!enableSave &&
              <Label pointing='right' color='yellow'>
                โปรดตรวจสอบข้อมูล!
              </Label>
            }
            <Button
              icon='save'
              color='green'
              content='บันทึก'
              onClick={onSave}
              disabled={!enableSave}
            />
          <Button
            color='red'
            content='ลบ'
            icon='trash'
            onClick={handleDelete}
            disabled={items.every(item => !item.selected)}
          />
        </Segment>
      </Segment.Group>
    </>
      
  )
}

export default FormTableListDataNoDetail