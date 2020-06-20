import jsPDF from 'jspdf'
import moment from 'moment'
import html2canvas from 'html2canvas'
import styled from 'styled-components'
import {
  useRef,
  useState,
  useEffect,
  FormEvent,
  FunctionComponent,
} from 'react'
import {
  Icon,
  Grid,
  Table,
  Segment,
  Checkbox,
  CheckboxProps,
} from 'semantic-ui-react'
import { StateList } from './index'
import Button from '../../components/Button'

const Wrapper = styled(Segment)`
  overflow: auto;
  padding: 0 !important;
  .ui.table {
    border: 0;
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

interface FormTableListDataProps {
  list: StateList[]
  onSend: () => void
  onRemove: () => void
  onSelect: (id: number, value: boolean) => void
}

// End typescript defined -------------------------

const initSummary: StateSummary = { money: 0, rebate: 0 }

const FormTableListData: FunctionComponent<FormTableListDataProps> = ({
  list,
  onSend,
  onSelect,
  onRemove
}) => {
  const tableListAndSumRef = useRef<HTMLDivElement>(null)
  const [isPDF, setIsPDF] = useState<boolean>(false)
  const [sumOfList, setSumOfList] = useState<StateSumOfList>({})
  const [sumAll, setSumAll] = useState<StateSummary>(initSummary)
  const [sumReject, setSumReject] = useState<StateSummary>(initSummary)

  const handleSavePDF = () => {
    const doc = new jsPDF()
    const source = tableListAndSumRef.current
    const options = {
      width: 1800,
      scrollY: -window.scrollY,
      height: tableListAndSumRef.current.clientHeight,
    }

    html2canvas(source, options).then((canvas) => {
      doc.addImage(canvas.toDataURL('image/png'), 'PNG', 5, 5, 200, 0)
      doc.save(`SaveDataWithDetail_${moment().format('DD-MMM-YYYY')}.pdf`)
      setIsPDF(false)
    })
  }

  const handleSelect = (e: FormEvent<HTMLInputElement>, data: CheckboxProps) => {
    e.preventDefault()
    const [, idx] = data.name.split('_')
    onSelect(parseFloat(idx), data.checked)
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
    handleSummaryData()
  }, [list])

  useEffect(() => {
    if (isPDF) {
      handleSavePDF()
    }
  }, [isPDF])

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
            <Table
              celled
              textAlign='center'
              style={{
                width: 1800
              }}
            >
              <Table.Header>
                <Table.Row>
                  {!isPDF &&
                    <Table.HeaderCell>เลือก</Table.HeaderCell>
                  }
                  <Table.HeaderCell>ลำดับ</Table.HeaderCell>
                  <Table.HeaderCell>รหัสลูกค้า</Table.HeaderCell>
                  <Table.HeaderCell>Company</Table.HeaderCell>
                  <Table.HeaderCell>Rebate Type</Table.HeaderCell>
                  <Table.HeaderCell>
                    เดือนปี
                    <br />
                    (mmyy)
                  </Table.HeaderCell>
                  <Table.HeaderCell>Section</Table.HeaderCell>
                  <Table.HeaderCell>Comp. Affi</Table.HeaderCell>
                  <Table.HeaderCell>
                    เดือนปีที่รับสินค้า
                    <br />
                    (mm/yyyy)
                  </Table.HeaderCell>
                  <Table.HeaderCell>สินค้าที่บันทึกเอง</Table.HeaderCell>
                  <Table.HeaderCell>ปริมาณ</Table.HeaderCell>
                  <Table.HeaderCell>หน่วย</Table.HeaderCell>
                  <Table.HeaderCell>Step</Table.HeaderCell>
                  <Table.HeaderCell>อัตตราที่จ่าย</Table.HeaderCell>
                  <Table.HeaderCell>จำนวนเงิน</Table.HeaderCell>
                  <Table.HeaderCell>รอบที่</Table.HeaderCell>
                  <Table.HeaderCell>Product Hierachy</Table.HeaderCell>
                  <Table.HeaderCell>Plant</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {
                  list.map((item, index) => (
                    <Table.Row
                      key={index}
                      warning={item.selected}
                    >
                      {!isPDF &&
                        <Table.Cell>
                          <Checkbox
                            onChange={handleSelect}
                            checked={item.selected}
                            name={`${item.companyId}_${index}`}
                          />
                        </Table.Cell>
                      }
                      <Table.Cell error={Object.values(item.error).some(val => val)}>
                        {index + 1} {item.duplicate ? <u>ซ้ำ</u> : null}
                      </Table.Cell>
                      <Table.Cell error={item.error.customerId}>
                        {item.customerId}
                      </Table.Cell>
                      <Table.Cell error={item.error.companyId}>
                        {item.companyId}
                      </Table.Cell>
                      <Table.Cell error={item.error.rebateType}>
                        {item.rebateType}
                      </Table.Cell>
                      <Table.Cell error={item.error.period}>
                        {item.period}
                      </Table.Cell>
                      <Table.Cell error={item.error.section}>
                        {item.section}
                      </Table.Cell>
                      <Table.Cell error={item.error.compAffi}>
                        {item.compAffi}
                      </Table.Cell>
                      <Table.Cell error={item.error.receiveMonth}>
                        {item.receiveMonth}
                      </Table.Cell>
                      <Table.Cell error={item.error.productDescription}>
                        {item.productDescription}
                      </Table.Cell>
                      <Table.Cell error={item.error.quantity}>
                        {item.quantity}
                      </Table.Cell>
                      <Table.Cell error={item.error.unit}>
                        {item.unit}
                      </Table.Cell>
                      <Table.Cell error={item.error.step}>
                        {item.step}
                      </Table.Cell>
                      <Table.Cell error={item.error.rate}>
                        {item.rate}
                      </Table.Cell>
                      <Table.Cell error={item.error.amount}>
                        {item.amount}
                      </Table.Cell>
                      <Table.Cell error={item.error.periodGroup}>
                        รอบที่ {item.periodGroup}
                      </Table.Cell>
                      <Table.Cell error={item.error.productHierachy}>
                        {item.productHierachy}
                      </Table.Cell>
                      <Table.Cell error={item.error.plant}>
                        {item.plant}
                      </Table.Cell>
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
            onClick={() => setIsPDF(true)}
          />
        </Segment>
        <Segment textAlign='right'>
          <Button
            icon='save'
            color='green'
            content='บันทึก'
            onClick={onSend}
            disabled={sumReject.rebate > 0}
          />
          <Button
            color='red'
            content='ลบ'
            icon='trash'
            onClick={onRemove}
            disabled={list.every(item => !item.selected)}
          />
        </Segment>
      </Segment.Group>
    </>
  )

}

export default FormTableListData