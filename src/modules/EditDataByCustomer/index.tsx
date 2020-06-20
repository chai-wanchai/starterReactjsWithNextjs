import dynamic from 'next/dynamic'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { Menu } from 'semantic-ui-react'
import { FunctionComponent, FormEvent, useState } from 'react'
import { RootState } from '../../stores'
import { RequestApiResponse } from '../../intefaces'
import { checkNumber, maxNumber, maxDecimal } from '../../utils/dataUtils'
import { editDataByCustomerApi } from '../../api/EditDataByCustomerApi'
import modal from '../../utils/modal'
import FormSearchCustomer from './FormSearchCustomer'

const FormTableListDataNoDetail = dynamic(import('./FormTableListDataNoDetail'), { ssr: false })
const FormTableListDataWithDetail = dynamic(import('./FormTableListDataWithDetail'), { ssr: false })

const Wrapper = styled('div')`
  .ui.grid > .row > .column {
    margin-bottom: 10px;
  }
  & > :first-child, :last-child {
    margin-bottom: 40px;
  }
`

// End styled-component ---------------------------

interface ResponeData {
  plant?: any
  amount?: any
  period?: any
  comp_id?: any
  data_id?: any
  comp_affi?: any
  prod_hier?: any
  customer_id?: any
  rebate_type?: any
  industry_id?: any // section
  period_group?: any
  process_flag?: any
  template_type?: '1' | '2'
  destination_type?: 'R3' | 'S4'
  rate: any
  unit: any
  step: any
  quantity: any
  product_desc: any
  receive_month: any
}

export interface StateListNoDetail {
  id: any
  erp: 'R3' | 'S4'
  active: boolean
  selected: boolean
  editable: boolean
  customerId: string
  amount: number
  rebateType: string
  companyId: string
  period: string
  section: string
  compAffi: string
  periodGroup: string
  productHierachy: string
  plant: string
  error?: {
    customerId: boolean
    amount: boolean
    rebateType: boolean
    companyId: boolean
    period: boolean
    section: boolean
    compAffi: boolean
    periodGroup: boolean
    productHierachy: boolean
    plant: boolean
  }
}

export interface StateListWithDetail {
  id: any
  erp: 'R3' | 'S4'
  active: boolean
  selected: boolean
  editable: boolean
  customerId: string
  amount: number
  rebateType: string
  companyId: string
  period: string
  section: string
  compAffi: string
  periodGroup: string
  productHierachy: string
  plant: string
  rate: string
  unit: string
  step: string
  quantity: number
  receiveMonth: string
  productDescription: string
  error?: {
    customerId: boolean
    amount: boolean
    rebateType: boolean
    companyId: boolean
    period: boolean
    section: boolean
    compAffi: boolean
    periodGroup: boolean
    productHierachy: boolean
    plant: boolean
    rate: boolean
    unit: boolean
    step: boolean
    quantity: boolean
    receiveMonth: boolean
    productDescription: boolean
  }
}

interface EditDataByCustomerProps {
  utk?: string
  master?: {
    company: any[]
    customer: {
      R3: any[]
      S4: any[]
    },
    rebateType: any[]
  }
}

// End typescript defined -------------------------

const initListNoDetailError: StateListNoDetail['error'] = {
  customerId: false,
  amount: false,
  rebateType: false,
  companyId: false,
  period: false,
  section: false,
  compAffi: false,
  periodGroup: false,
  productHierachy: false,
  plant: false
}

const initListWithDetailError: StateListWithDetail['error'] = {
  ...initListNoDetailError,
  rate: false,
  unit: false,
  step: false,
  quantity: false,
  receiveMonth: false,
  productDescription: false
}

const EditDataByCustomer: FunctionComponent<EditDataByCustomerProps> = ({
  utk,
  master
}) => {
  const [viewTab, setViewTab] = useState<1 | 2>(1)
  const [customerId, setCustomerId] = useState('')
  const [errorCustomerId, setErrorCustomerId] = useState('')
  const [listNoDetail, setListNoDetail] = useState<StateListNoDetail[]>([])
  const [isVerifyListNoDetal, setIsVerifyListNoDetal] = useState(false)
  const [listWithDetail, setListWithDetail] = useState<StateListWithDetail[]>([])
  const [isVerifyListWithDetal, setIsVerifyListWithDetal] = useState(false)

  const handleClearState = () => {
    setViewTab(1)
    setCustomerId('')
    setErrorCustomerId('')
    setListNoDetail([])
    setIsVerifyListNoDetal(false)
    setListWithDetail([])
  }

  const handleFormTableListDelete = async (listId: any[]) => {
    const confirm = await modal.confirm('ยืนยันการลบข้อมูล !')

    if (!confirm.value) {
      return
    }

    const deleteRequset: Promise<RequestApiResponse>[] = listId.map(id => editDataByCustomerApi.deleteByDataId(id, utk))

    const response = await Promise.all(deleteRequset)

    if (response.every(res => res.isSuccess)) {
      await modal.open({ type: 'success', title: 'ลบข้อมูล Success' })
      setIsVerifyListNoDetal(false)
      setIsVerifyListWithDetal(false)
      handleSearchDataByCustomer()
    } else {
      modal.error(response.map(res => res.error.message).join(', '))
    }
  }

  /** Handler FormSearchCustomer */

  const validateFormSearch = () => {
    if (!customerId) {
      setErrorCustomerId('โปรดระบุ รหัสลูกค้า')
      return false
    }

    return true
  }

  const handleFormSearchChange = (data) => {
    setCustomerId(data)
    setErrorCustomerId('')
  }

  const handleCreateList = (data: ResponeData[]) => {
    const tempNoDetail: StateListNoDetail[] = []
    const tempWithDetail: StateListWithDetail[] = []

    data.forEach(item => {
      const comp = master.company.find(com =>
        com.id === item.comp_id
      )
      if (item.template_type === '1') {
        tempNoDetail.push({
          id: item.data_id,
          erp: item.destination_type,
          active: comp
            ? comp.is_actived === '1'
            : true,
          selected: false,
          editable: false,
          customerId: item.customer_id,
          companyId: item.comp_id,
          section: item.industry_id,
          amount: parseFloat(item.amount),
          rebateType: item.rebate_type,
          period: item.period,
          compAffi: item.comp_affi,
          plant: item.plant,
          productHierachy: item.prod_hier,
          periodGroup: `${item.period_group}`,
          error: { ...initListNoDetailError }
        })
      }
      if (item.template_type === '2') {
        tempWithDetail.push({
          id: item.data_id,
          erp: item.destination_type,
          active: comp
            ? comp.is_actived === '1'
            : true,
          selected: false,
          editable: false,
          customerId: item.customer_id,
          companyId: item.comp_id,
          section: item.industry_id,
          amount: parseFloat(item.amount),
          rebateType: item.rebate_type,
          period: item.period,
          compAffi: item.comp_affi,
          plant: item.plant,
          productHierachy: item.prod_hier,
          periodGroup: `${item.period_group}`,
          rate: item.rate,
          unit: item.unit,
          step: item.step,
          quantity: parseFloat(item.quantity),
          receiveMonth: item.receive_month,
          productDescription: item.product_desc, 
          error: { ...initListWithDetailError }
        })
      }
    })

    setListNoDetail(tempNoDetail)
    setListWithDetail(tempWithDetail)
    if (tempNoDetail.length > 0 && tempWithDetail.length > 0) {
      setViewTab(1)
    } else if (tempNoDetail.length > 0 && tempWithDetail.length === 0) {
      setViewTab(1)
    } else if (tempNoDetail.length === 0 && tempWithDetail.length > 0) {
      setViewTab(2)
    } else {
      setViewTab(1)
    }
  }

  const handleSearchDataByCustomer = async () => {
    modal.fetching()

    const response = await editDataByCustomerApi.getDataByCustomer(customerId, utk)

    if (response.isSuccess) {
      if (response.data.length === 0) {
        modal.open({
          title: 'ไม่พบข้อมูลรหัสลูกค้า',
          showConfirmButton: false,
          showCancelButton: true,
          cancelButtonText: 'Close'
        })
      } else {
        modal.close()
        handleCreateList(response.data)
      }
    } else {
      modal.error(response.error.message)
    }
  }

  const handleFormSearchCustomerSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!validateFormSearch()) {
      return
    }

    handleSearchDataByCustomer()
  }

  /** Handler FormTableListDataNoDetail */

  const validateFormTableListDataNoDetail = async (items: StateListNoDetail[]) => {
     // Check condition
    const listVerifyCondition: StateListNoDetail[] = []
    items.forEach(data => {
      const error = { ...initListNoDetailError }

      if (data.customerId.length === 10) {
        const customer = master.customer[data.erp].find(item => item.customer_id === data.customerId)
        error.customerId = customer ? false : true
        error.section = !error.customerId && data.section === customer.section_id ? false : true
      } else {
        error.customerId = true
        error.section = true
      }

      if (
        !data.amount ||
        typeof data.amount !== 'number' ||
        data.amount < 0
      ) {
        error.amount = true
      } else if (!maxNumber(data.amount, 11)) {
        error.amount = true
      } else if (!maxDecimal(data.amount, 2)) {
        error.amount = true
      }

      if (!master.rebateType.find(item => item.id === data.rebateType)) {
        error.rebateType = true
      }
  
      if (
        !master.company.find(item =>
          item.id === data.companyId &&
          item.comp_type === 'C' &&
          item.is_actived === '1'
        )
      ) {
        error.companyId = true
      }

      const periodMonth = data.period.slice(0, 2)
      const periodYear = data.period.slice(2, 4)
      if (!checkNumber(periodMonth) || !checkNumber(periodYear)) {
        error.period = true
      } else if (parseFloat(periodMonth) < 1 || parseFloat(periodMonth) > 12) {
        error.period = true
      }

      if (
        !master.company.find(item =>
          item.id === data.compAffi &&
          item.comp_type === 'A'
        )
      ) {
        error.compAffi = true
      }

      if (data.periodGroup !== '1' && data.periodGroup !== '2') {
        error.periodGroup = true
      }

      if (
        !data.productHierachy ||
        (data.erp === 'R3' && data.productHierachy.length > 10) ||
        (data.erp === 'S4' && data.productHierachy.length > 18)
      ) {
        error.productHierachy = true
      }

      if (data.plant && data.plant.length > 4) {
        error.plant = true
      }

      listVerifyCondition.push({ ...data, error })
    })
    if (
      listVerifyCondition.some(
        data => Object.keys(data.error).some(key => data.error[key])
      )
    ) {
      setListNoDetail(listVerifyCondition)
      setIsVerifyListNoDetal(false)
      return
    }
    // Check duplicate row
    const listVerifyDuplicate: StateListNoDetail[] = []
    listVerifyCondition.forEach(data => {
      const isDuplicate = listVerifyDuplicate.some(item =>
        item.customerId === data.customerId &&
        item.section === data.section &&
        item.rebateType === data.rebateType &&
        item.companyId === data.companyId &&
        item.period === data.period &&
        item.compAffi === data.compAffi &&
        item.periodGroup === data.periodGroup &&
        item.productHierachy === data.productHierachy &&
        item.plant === data.plant
      )
      const error = { ...data.error }
      if (isDuplicate) {
        Object.keys(error).forEach(key => {
          error[key] = true
        })
      }
      listVerifyDuplicate.push({ ...data, error })
    })
    if (
      listVerifyDuplicate.some(
        data => Object.keys(data.error).every(key => data.error[key])
      )
    ) {
      setListNoDetail(listVerifyDuplicate)
      setIsVerifyListNoDetal(false)
      return
    }

    // Check duplicate database
    modal.fetching()

    const params = listVerifyDuplicate
    .filter(item => item.selected)
    .map((item, index) => ({
      no: index + 1,
      data_id: item.id,
      destination_type: item.erp,
      industry_id: item.section,
      customer_id: item.customerId,
      comp_id: item.companyId,
      rebate_type: item.rebateType,
      period: item.period,
      template_type: '1', // `1` is template `No Detail`
      amount: item.amount,
      comp_affi: item.compAffi,
      period_group: item.periodGroup,
      prod_hier: item.productHierachy,
      plant: item.plant,
      process_flag: 'N'
    }))

    const response = await editDataByCustomerApi.verifyData(params, utk)

    if (response.isSuccess) {
      setIsVerifyListNoDetal(true)
      setListNoDetail(listVerifyDuplicate.map(item => ({ ...item, editable: false })))
      modal.close()
    } else {
      setIsVerifyListNoDetal(false)
      modal.error(response.error.message)
    }
  }

  const handleFormTableListDataNoDetailSave = async () => {
    const confirm = await modal.confirm('ยืนยันการบันทึกข้อมูล !')

    if (!confirm.value) {
      return
    }

    const params = listNoDetail
    .filter(item => item.selected)
    .map((item, index) => ({
      no: index + 1,
      data_id: item.id,
      destination_type: item.erp,
      industry_id: item.section,
      customer_id: item.customerId,
      comp_id: item.companyId,
      rebate_type: item.rebateType,
      period: item.period,
      template_type: '1', // `1` is template `No Detail`
      amount: item.amount,
      comp_affi: item.compAffi,
      period_group: item.periodGroup,
      prod_hier: item.productHierachy,
      plant: item.plant,
      process_flag: 'N'
    }))

    const response = await editDataByCustomerApi.updateAffiData(params, utk)

    if (response.isSuccess) {
      await modal.open({ type: 'success', title: 'บันทึกข้อมูล Success' })
      setIsVerifyListNoDetal(false)
      handleSearchDataByCustomer()
    } else {
      modal.error(response.error.message)
    }
  }

  /** Handler FormTableListDataWithDetail */

  const validateFormTableListDataWithDetail = async (items: StateListWithDetail[]) => {
    
    // Check condition
    const listVerifyCondition: StateListWithDetail[] = []
    items.forEach(data => {
      const error = { ...initListWithDetailError }

      if (data.customerId.length === 10) {
        const customer = master.customer[data.erp].find(item => item.customer_id === data.customerId)
        error.customerId = customer ? false : true
        error.section = !error.customerId && data.section === customer.section_id ? false : true
      } else {
        error.customerId = true
        error.section = true
      }
  
      if (
        !master.company.find(item =>
          item.id === data.companyId &&
          item.comp_type === 'C' &&
          item.is_actived === '1'
        )
      ) {
        error.companyId = true
      }
  
      if (!master.rebateType.find(item => item.id === data.rebateType)) {
        error.rebateType = true
      }

      // Format MMYY
      const periodMonth = data.period.slice(0, 2)
      const periodYear = data.period.slice(2, 4)
      if (!checkNumber(periodMonth) || !checkNumber(periodYear)) {
        error.period = true
      } else if (parseFloat(periodMonth) < 1 || parseFloat(periodMonth) > 12) {
        error.period = true
      }

      if (
        !master.company.find(item =>
          item.id === data.compAffi &&
          item.comp_type === 'A'
        )
      ) {
        error.compAffi = true
      }
  
      // Format MM/YYYY
      const receiveMonthM = data.receiveMonth.slice(0, 2)
      const receiveMonthY = data.receiveMonth.slice(3, 7)
      if (!checkNumber(receiveMonthM) || !checkNumber(receiveMonthY)) {
        error.receiveMonth = true
      } else if (parseFloat(receiveMonthM) < 1 || parseFloat(receiveMonthM) > 12) {
        error.receiveMonth = true
      }

      if (!data.productDescription || data.productDescription.length > 100) {
        error.productDescription = true
      }
  
      if (!data.quantity || typeof data.quantity !== 'number' || data.quantity < 0) {
        error.quantity = true
      } else if (!maxNumber(data.quantity, 11)) {
        error.quantity = true
      } else if (!maxDecimal(data.quantity, 2)) {
        error.quantity = true
      }
  
      if (!data.unit || data.unit.length > 10) {
        error.unit = true
      }

      if (data.step) {
        if (typeof data.step !== 'number' || data.step < 0) {
          error.step = true
        } else if (!maxNumber(data.step, 3)) {
          error.step = true
        } else if (!maxDecimal(data.step, 0)) {
          error.step = true
        }
      }
  
      if (data.rate.length > 100) {
        error.rate = true
      }

      if (!data.amount || typeof data.amount !== 'number' || data.amount < 0) {
        error.amount = true
      } else if (!maxNumber(data.amount, 11)) {
        error.amount = true
      } else if (!maxDecimal(data.amount, 2)) {
        error.amount = true
      }

      if (data.periodGroup !== '1' && data.periodGroup !== '2') {
        error.periodGroup = true
      }

      if (
        !data.productHierachy ||
        (data.erp === 'R3' && data.productHierachy.length > 10) ||
        (data.erp === 'S4' && data.productHierachy.length > 18)
      ) {
        error.productHierachy = true
      }

      if (data.plant && data.plant.length > 4) {
        error.plant = true
      }

      listVerifyCondition.push({ ...data, error })
    })
    if (listVerifyCondition.some(data => Object.keys(data.error).some(key => data.error[key]))) {
      setListWithDetail(listVerifyCondition)
      setIsVerifyListWithDetal(false)
      return
    }

    // Check duplicate row
    const listVerifyDuplicate: StateListWithDetail[] = []
    listVerifyCondition.forEach(data => {
      const isDuplicate = listVerifyDuplicate.some(item =>
        item.customerId === data.customerId &&
        item.section === data.section &&
        item.rebateType === data.rebateType &&
        item.companyId === data.companyId &&
        item.period === data.period &&
        item.compAffi === data.compAffi &&
        item.receiveMonth === data.receiveMonth &&
        item.periodGroup === data.periodGroup &&
        item.productHierachy === data.productHierachy &&
        item.plant === data.plant
      )
      const error = { ...data.error }
      if (isDuplicate) {
        Object.keys(error).forEach(key => {
          error[key] = true
        })
      }
      listVerifyDuplicate.push({ ...data, error })
    })
    if (listVerifyDuplicate.some(data => Object.keys(data.error).every(key => data.error[key]))) {
      setListWithDetail(listVerifyDuplicate)
      setIsVerifyListWithDetal(false)
      return
    }

    // Check duplicate database
    modal.fetching()

    const params = listVerifyDuplicate
    .filter(item => item.selected)
    .map((item, index) => ({
      no: index + 1,
      data_id: item.id,
      destination_type: item.erp,
      industry_id: item.section,
      customer_id: item.customerId,
      comp_id: item.companyId,
      rebate_type: item.rebateType,
      period: item.period,
      amount: item.amount,
      comp_affi: item.compAffi,
      period_group: item.periodGroup,
      receive_month: item.receiveMonth,
      product_desc: item.productDescription,
      unit: item.unit,
      quantity: item.quantity,
      step: item.step,
      rate: item.rate,
      prod_hier: item.productHierachy,
      plant: item.plant,
      template_type: '2', // `2` is template `With Detail`
      process_flag: 'N'
    }))

    const response = await editDataByCustomerApi.verifyData(params, utk)

    if (response.isSuccess) {
      setIsVerifyListWithDetal(true)
      setListWithDetail(listVerifyDuplicate.map(item => ({ ...item, editable: false })))
      modal.close()
    } else {
      setIsVerifyListWithDetal(false)
      modal.error(response.error.message)
    }
  }

  const handleFormTableListDataWithDetailSave = async () => {
    const confirm = await modal.confirm('ยืนยันการบันทึกข้อมูล !')

    if (!confirm.value) {
      return
    }

    const params = listWithDetail
    .filter(item => item.selected)
    .map((item, index) => ({
      no: index + 1,
      data_id: item.id,
      destination_type: item.erp,
      industry_id: item.section,
      customer_id: item.customerId,
      comp_id: item.companyId,
      rebate_type: item.rebateType,
      period: item.period,
      amount: item.amount,
      comp_affi: item.compAffi,
      period_group: item.periodGroup,
      receive_month: item.receiveMonth,
      product_desc: item.productDescription,
      unit: item.unit,
      quantity: item.quantity,
      step: item.step,
      rate: item.rate,
      prod_hier: item.productHierachy,
      plant: item.plant,
      template_type: '2', // `2` is template `With Detail`
      process_flag: 'N'
    }))

    const response = await editDataByCustomerApi.updateAffiData(params, utk)

    if (response.isSuccess) {
      await modal.open({ type: 'success', title: 'บันทึกข้อมูล Success' })
      setIsVerifyListWithDetal(false)
      handleSearchDataByCustomer()
    } else {
      modal.error(response.error.message)
    }
  }

  return (
    <Wrapper>
      <FormSearchCustomer
        customerId={customerId}
        errorCustomerId={errorCustomerId}
        onFormClear={handleClearState}
        onFormChange={handleFormSearchChange}
        onSubmit={handleFormSearchCustomerSubmit}
      />
      {(listNoDetail.length > 0 || listWithDetail.length > 0) &&
        <>
          <Menu pointing secondary color='blue'>
            {listNoDetail.length > 0 &&
              <Menu.Item
                link
                name='ข้อมูลแบบไม่มีรายละเอียด'
                active={viewTab === 1}
                onClick={() => setViewTab(1)}
              />
            }
            {listWithDetail.length > 0 &&
              <Menu.Item
                link
                name='ข้อมูลแบบมีรายละเอียด'
                active={viewTab === 2}
                onClick={() => setViewTab(2)}
              />
            }
          </Menu>
          {viewTab === 1 && listNoDetail.length > 0 &&
            <FormTableListDataNoDetail
              list={listNoDetail}
              enableSave={isVerifyListNoDetal}
              onDelete={handleFormTableListDelete}
              onCheck={validateFormTableListDataNoDetail}
              onSave={handleFormTableListDataNoDetailSave}
              onSelect={() => setIsVerifyListNoDetal(false)}
            />
          }
          {viewTab === 2 && listWithDetail.length > 0 &&
            <FormTableListDataWithDetail
              list={listWithDetail}
              enableSave={isVerifyListWithDetal}
              onDelete={handleFormTableListDelete}
              onCheck={validateFormTableListDataWithDetail}
              onSave={handleFormTableListDataWithDetailSave}
              onSelect={() => setIsVerifyListWithDetal(false)}
            />
          }
        </>
      }
    </Wrapper>
  )
}

const mapStateToProps = ({ auth, master }: RootState) => ({
  utk: auth.token,
  master: {
    customer: master.customer,
    company: master.raw.company,
    rebateType: master.raw.rebateType.filter(data =>
      auth.user.info.comp_id.split(',').indexOf(data.comp_resp) !== -1
    )
  }
})

export default connect(mapStateToProps, null)(EditDataByCustomer)