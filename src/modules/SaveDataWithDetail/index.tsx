import moment from 'moment'
import dynamic from 'next/dynamic'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { FunctionComponent, useEffect, useState } from 'react'
import { RootState } from '../../stores'
import { maxNumber, maxDecimal, checkNumber } from '../../utils/dataUtils'
import { saveDataWithDetailApi } from '../../api/SaveDataWithDetailApi'
import modal from '../../utils/modal'
import FormSaveDataWithDetail from './FormSaveDataWithDetail'

const FormTableListData = dynamic(import('./FormTableListData'), { ssr: false })

const Wrapper = styled('div')`
  .ui.grid > .row > .column {
    margin-bottom: 10px;
  }
  & > :first-child, :last-child {
    margin-bottom: 40px;
  }
`

// End styled-components -----------------------

export interface StateForm {
  erp: string
  unit: string
  step: number
  rate: string
  amount: number
  section: string
  compAffi: string
  quantity: number
  companyId: string
  customerId: string
  rebateType: string
  periodGroup: string
  period: Date | string
  productHierachy: string
  productDescription: string
  receiveMonth: Date | string
  plant: string
}

export interface StateError {
  erp: string
  unit: string
  step: string
  rate: string
  amount: string
  period: string
  section: string
  compAffi: string
  quantity: string
  companyId: string
  customerId: string
  rebateType: string
  periodGroup: string
  receiveMonth: string
  productHierachy: string
  productDescription: string
  plant: string
}

export interface StateList extends StateForm {
  duplicate: boolean
  selected: boolean
  period: string
  receiveMonth: string
  error?: {
    step: boolean
    unit: boolean
    rate: boolean
    amount: boolean
    period: boolean
    section: boolean
    compAffi: boolean
    quantity: boolean
    companyId: boolean
    customerId: boolean
    rebateType: boolean
    periodGroup: boolean
    receiveMonth: boolean
    productHierachy: boolean
    productDescription: boolean
    plant: boolean
  }
}

interface DataUploadExcel {
  detail: {
    COMPANY: string
    CUSTOMER_ID: string
    REBATE_TYPE: string
    PERIOD: string
    SECTION_ID: string
    AMOUNT: number
    COMP_AFFI: string
    RECEIVE_MONTH: string
    PRODUCT_DESC: string
    UNIT: string
    QUANTITY: number
    STEP: number
    RATE: string
    DIST_CHANNEL: number
    PERIOD_GROUP: number
    PROD_HIER: string
    PLANT
  }[]
}

interface SaveDataWithDetailProps {
  utk?: string
  user?: {
    erp: string
  }
  master?: {
    company: any[]
    customer: {
      R3: any[]
      S4: any[]
    },
    rebateType: any[]
  }
}

// End typescript defined -----------------------------

const initState: StateForm = {
  erp: '',
  step: 0,
  unit: '',
  rate: '',
  amount: 0,
  section: '',
  quantity: 0,
  compAffi: '',
  companyId: '',
  customerId: '',
  rebateType: '',
  periodGroup: '',
  period: undefined,
  productHierachy: '',
  productDescription: '',
  receiveMonth: undefined,
  plant: ''
}

const initError: StateError = {
  ...initState,
  step: '',
  period: '',
  amount: '',
  quantity: '',
  receiveMonth: ''
}

const initListError: StateList['error'] = {
  step: false,
  unit: false,
  rate: false,
  amount: false,
  period: false,
  section: false,
  compAffi: false,
  quantity: false,
  companyId: false,
  customerId: false,
  rebateType: false,
  periodGroup: false,
  receiveMonth: false,
  productHierachy: false,
  productDescription: false,
  plant: false
}

const SaveDataWithDetail: FunctionComponent<SaveDataWithDetailProps> = ({
  utk,
  user,
  master
}) => {
  const [list, setList] = useState<StateList[]>([])
  const [form, setForm] = useState<StateForm>(initState)
  const [error, setError] = useState<StateError>(initError)

  /** validate */

  const validateForm = () => {
    const formError: StateError = { ...error }

    if (!form.erp) {
      formError.erp = 'กรุณาเลือก ERP Type'
      setError(formError)
      return false
    }
    if (!form.customerId) {
      formError.customerId = 'กรุณาระบุ รหัสลูกค้า'
      setError(formError)
      return false
    }

    if (!form.rebateType) {
      formError.rebateType = 'กรุณาระบุ Rebate Type'
    }
    if (!form.compAffi) {
      formError.compAffi = 'กรุณาระบุ Comp Affi'
    }
    if (typeof form.period === 'undefined') {
      formError.period = 'กรุณาระบุ เดือนปี'
    }
    if (typeof form.receiveMonth === 'undefined') {
      formError.receiveMonth = 'กรุณาระบุ เดือนปี ที่รับสินค้า'
    }
    if (!form.productDescription) {
      formError.productDescription = 'กรุณาระบุ สินค้าที่บันทึกเอง'
    } else if (form.productDescription.length > 100) {
      formError.productDescription = 'โปรดระบุมากสุด 100 ตัวอักษร'
    }
    if ((!form.quantity && form.quantity !== 0) || form.quantity < 0) {
      formError.quantity = 'ปริมาณต้อง >= 0'
    } else if (!maxNumber(form.quantity, 11)) {
      formError.quantity = 'ไม่สามารถมีค่าเกิน 11 หลัก'
    } else if (!maxDecimal(form.quantity, 2)) {
      formError.quantity = 'ทศนิยมต้องไม่เกิน 2 หลัก'
    }
    if (!form.unit) {
      formError.unit = 'กรุณาระบุ หน่วย'
    } else if (form.unit.length > 10) {
      formError.unit = 'โปรดระบุมากสุด 10 ตัวอักษร'
    }
    if (form.step) {
      if (form.step < 0) {
        formError.step = 'ขั้นที่ต้อง >= 0'
      } else if (!maxNumber(form.step, 3)) {
        formError.step = 'ไม่สามารถมีค่าเกิน 3 หลัก'
      } else if (!maxDecimal(form.step, 0)) {
        formError.step = 'ไม่สามารถเป็นค่าทศนิยมได้'
      }
    }
    if (form.rate.length > 100) {
      formError.rate = 'โปรดระบุมากสุด 100 ตัวอักษร'
    }
    if ((!form.amount && form.amount !== 0) || form.amount < 0) {
      formError.amount = 'จำนวนเงินต้อง >= 0'
    } else if (!maxNumber(form.amount, 11)) {
      formError.amount = 'ไม่สามารถมีค่าเกิน 11 หลัก'
    } else if (!maxDecimal(form.amount, 2)) {
      formError.amount = 'ทศนิยมต้องไม่เกิน 2 หลัก'
    }
    if (!form.periodGroup) {
      formError.periodGroup = 'กรุณาระบุ รอบที่'
    }
    if (!form.productHierachy) {
      formError.productHierachy = 'กรุณาระบุ Product Hierachy'
    } else if (form.erp === 'R3' && form.productHierachy.length > 10) {
      formError.productHierachy = 'โปรดระบุมากสุด 10 ตัวอักษร'
    } else if (form.erp === 'S4' && form.productHierachy.length > 18) {
      formError.productHierachy = 'โปรดระบุมากสุด 18 ตัวอักษร'
    }
    if (form.plant && form.plant.length > 4) {
      formError.plant = 'โปรดระบุมากสุด 4 ตัวอักษร'
    }

    if (Object.keys(formError).some(key => formError[key] !== '')) {
      setError(formError)
      return false
    }
    return true
  }

  const validateTableWithMaster = (data: StateList) => {
    
    const error: StateList['error'] = { ...initListError }

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

    if (!master.company.find(item => item.id === data.compAffi && item.comp_type === 'A')) {
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

    if (
      !data.quantity ||
      typeof data.quantity !== 'number' ||
      data.quantity < 0
    ) {
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

    return error
  }

  const validateTableWithDuplicateList = (data: StateList, dataRef: StateList[]) => {

    const error: StateList['error'] = { ...data.error }

    const isDuplicate = dataRef.some(item =>
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

    if (isDuplicate) {
      Object.keys(error).forEach(key => {
        error[key] = true
      })
    }

    return error
  }

  /** Handler FormSaveDataWithDetail */

  const handleFormSaveDataWithDetailClear = () => {
    setForm(initState)
    setError(initError)
  }

  const handleFormSaveDataWithDetailChange = async (key: keyof StateForm, value) => {
    if (key === 'erp' && form.erp !== '') {
      const confirm = await modal.confirm('ยืนยันการเปลี่ยน ERP Type ?')

      if (!confirm.value) {
        return
      }

      setForm({ ...initState, [key]: value })
      setError(initError)
      return
    }

    setForm({ ...form, [key]: value })
    setError({ ...error, [key]: '' })
  }

  const handleFormSaveDataWithDetailSubmit = (e) => {
    e.preventDefault()

    const isValid = validateForm()

    if (!isValid) {
      return
    }

    const data: StateList = {
      ...form,
      section: null,
      selected: false,
      duplicate: false,
      period: moment(form.period).format('MMYY'),
      receiveMonth: moment(form.receiveMonth).format('MM/YYYY')
    }

    if (form.customerId.length === 10) {
      const customer = master.customer[form.erp].find(item => item.customer_id === form.customerId)
      data.section = customer ? customer.section_id : null
    }

    data.error = validateTableWithMaster(data)
    data.error = validateTableWithDuplicateList(data, list)

    if (Object.values(data.error).every(val => val)) {
      data.duplicate = true
    }

    setList([ ...list, data ])
    if (!data.error.section) {
      setForm({ ...form, section: data.section })
    }

  }

  const handleFormSaveDataWithDetailUpload = ({ detail }: DataUploadExcel) => {
    if (detail) {

      const result = []

      detail.forEach((item) => {

        const { erp } = form
        const CUSTOMER_ID = item.CUSTOMER_ID ? `${item.CUSTOMER_ID}` : ''
        const REBATE_TYPE = item.REBATE_TYPE ? `${item.REBATE_TYPE}` : ''
        const COMPANY = item.COMPANY ? `${item.COMPANY}` : ''
        const PERIOD = item.PERIOD ? `${item.PERIOD}` : ''
        const COMP_AFFI = item.COMP_AFFI ? `${item.COMP_AFFI}` : ''

        const data: StateList = {
          erp,
          selected: false,
          duplicate: false,
          companyId: COMPANY.trim(),
          unit: item.UNIT || '',
          step: item.STEP || 0,
          rate: item.RATE || '',
          amount: parseFloat(`${item.AMOUNT}`) || 0,
          section: item.SECTION_ID || '',
          compAffi: COMP_AFFI.trim(),
          quantity: parseFloat(`${item.QUANTITY}`) || 0,
          customerId: CUSTOMER_ID.trim(),
          rebateType: REBATE_TYPE.trim(),
          periodGroup: `${item.PERIOD_GROUP}` || '',
          period: PERIOD.trim(),
          productHierachy: item.PROD_HIER || '',
          productDescription: item.PRODUCT_DESC || '',
          receiveMonth: item.RECEIVE_MONTH || '',
          plant: item.PLANT || ''
        }

        data.error = validateTableWithMaster(data)
        data.error = validateTableWithDuplicateList(data, result)

        if (Object.values(data.error).every(val => val)) {
          data.duplicate = true
        }

        result.push(data)
      })

      setList(result)
    }
  }

  /** Handler FormTableListData */

  const handleFormTableListDataRemove = () => {
    setList(list.filter(item => !item.selected))
  }

  const handleFormTableListDataSelect = (id: number, val: boolean) => {
    list[id].selected = val
    setList([ ...list ])
  }

  const handleFormTableListDataSend = async () => {
    const confirm = await modal.confirm('ยืนยันการบันทึกข้อมูล !')

    if (!confirm.value) {
      return
    }

    const params = list.map((item, index) => ({
      no: index + 1,
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

    modal.fetching({ title: <p>กำลังส่งข้อมูล</p> })

    const response = await saveDataWithDetailApi.saveData(params, utk)

    if (response.isSuccess) {
      modal.open({ type: 'success', title: 'บันทึกข้อมูล Success' })
    } else {
      const { message } = response.error
      const [, , , listErroNoIdx] = message.split(' ')

      if (listErroNoIdx) {
        const listErroNoIdxArr = listErroNoIdx.split(',')
        const result = list.map((listObj, index) => {
          const no = index + 1
          const isDuplicate = listErroNoIdxArr.indexOf(no.toString()) !== -1
          const error: StateList['error'] = { ...initListError }

          if (isDuplicate) {
            Object.keys(error).forEach(key => {
              error[key] = true
            })
          }

          return {
            ...listObj,
            duplicate: isDuplicate,
            error
          }
        })
        setList(result)
      }
      modal.error(message)
    }
  }

  /** hook */

  useEffect(() => {
    if (user.erp !== 'ALL') {
      handleFormSaveDataWithDetailChange('erp', user.erp)
    }
  }, [user.erp])

  return (
    <Wrapper>
      <FormSaveDataWithDetail
        form={form}
        error={error}
        disableRadioR3={user.erp === 'S4'}
        disableRadioS4={user.erp === 'R3'}
        onClear={handleFormSaveDataWithDetailClear}
        onSubmit={handleFormSaveDataWithDetailSubmit}
        onFormChange={handleFormSaveDataWithDetailChange}
        onUploadFileExcel={handleFormSaveDataWithDetailUpload}
      />
      {list.length > 0 &&
        <FormTableListData
          list={list}
          onSend={handleFormTableListDataSend}
          onSelect={handleFormTableListDataSelect}
          onRemove={handleFormTableListDataRemove}
        />
      }
    </Wrapper>
  )
}

const mapStateToProps = ({ auth, master }: RootState) => ({
  utk: auth.token,
  user: {
    erp: auth.user.info.destination_type,
  },
  master: {
    customer: master.customer,
    company: master.raw.company,
    rebateType: master.raw.rebateType.filter(data =>
      auth.user.info.comp_id.split(',').indexOf(data.comp_resp) !== -1
    )
  }
})

export default connect(mapStateToProps, null)(SaveDataWithDetail)