import moment from 'moment'
import dynamic from 'next/dynamic'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { FunctionComponent, useState, useEffect } from 'react'
import { RootState } from '../../stores'
import { checkNumber, maxNumber, maxDecimal } from '../../utils/dataUtils'
import { saveDataNoDetailApi } from '../../api/SaveDataNoDetailApi'
import modal from '../../utils/modal'
import FormSaveDataNoDetail from './FormSaveDataNoDetail'

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
  period: Date | string
  amount: number
  section: string
  compAffi: string
  companyId: string
  customerId: string
  rebateType: string
  periodGroup: string
  productHierachy: string
  plant: string
}

export interface StateError {
  erp: string
  period: string
  amount: string
  section: string
  compAffi: string
  companyId: string
  customerId: string
  rebateType: string
  periodGroup: string
  productHierachy: string
  plant: string
}

export interface StateList extends StateForm {
  duplicate: boolean
  selected: boolean
  period: string
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

interface DataUploadExcel {
  no_detail: {
    CUSTOMER_ID: string
    COMPANY: string
    REBATE_TYPE: string
    PERIOD: string
    SECTION_ID: string
    AMOUNT: number
    COMP_AFFI: string
    PERIOD_GROUP: number
    PROD_HIER: string
    PLANT: string
  }[]
}

interface SaveDataNoDetailProps {
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

// End typescript defined ----------------------

const initState: StateForm = {
  erp: '',
  amount: 0,
  section: '',
  compAffi: '',
  companyId: '',
  customerId: '',
  rebateType: '',
  periodGroup: '',
  period: undefined,
  productHierachy: '',
  plant: ''
}

const initError: StateError = { ...initState, period: '', amount: '' }

const initListError: StateList['error'] = {
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

const SaveDataNoDetail: FunctionComponent<SaveDataNoDetailProps> = ({
  utk,
  user,
  master,
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

    if (!form.companyId) {
      formError.companyId = 'กรุณาระบุ Company'
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
    if (!form.periodGroup) {
      formError.periodGroup = 'กรุณาระบุ รอบที่'
    }
    if (!form.amount || form.amount < 0) {
      formError.amount = 'จำนวนเงินต้อง > 0'
    } else if (!maxNumber(form.amount, 11)) {
      formError.amount = 'ไม่สามารถมีค่าเกิน 11 หลัก'
    } else if (!maxDecimal(form.amount, 2)) {
      formError.amount = 'ทศนิยมต้องไม่เกิน 2 หลัก'
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

    if (!master.company.find(item => item.id === data.compAffi && item.comp_type === 'A')) {
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

  /** Handler FormSaveDataNoDetail */

  const handleFormSaveDataNoDetailClear = () => {
    setForm(initState)
    setError(initError)
  }

  const handleFormSaveDataNoDetailChange = async (key: keyof StateForm, value) => {
    if (key === 'erp' && form.erp !== '') {
      const confirm = await modal.confirm('ยืนยันการเปลี่ยน ERP Type ?')

      if (!confirm.value) {
        return
      }

      setList([])
      setForm({ ...initState, [key]: value })
      setError(initError)
      return
    }

    setForm({ ...form, [key]: value })
    setError({ ...error, [key]: '' })
  }

  const handleFormSaveDataNoDetailSubmit = (e) => {
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
      period: moment(form.period).format('MMYY')
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

  const handleFormSaveDataNoDetailUpload = ({ no_detail }: DataUploadExcel) => {
    if (no_detail) {

      const result = []

      no_detail.forEach((item) => {

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
          customerId: CUSTOMER_ID.trim(),
          rebateType: REBATE_TYPE.trim(),
          section: item.SECTION_ID || '',
          amount: parseFloat(`${item.AMOUNT}`) || 0,
          companyId: COMPANY.trim(),
          period: PERIOD.trim(),
          compAffi: COMP_AFFI.trim(),
          periodGroup: `${item.PERIOD_GROUP}` || '',
          productHierachy: `${item.PROD_HIER}`  || '',
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
      template_type: '1', // `1` is template `No Detail`
      amount: item.amount,
      comp_affi: item.compAffi,
      period_group: item.periodGroup,
      prod_hier: item.productHierachy,
      plant: item.plant,
      process_flag: 'N'
    }))

    modal.fetching({ title: <p>กำลังส่งข้อมูล</p> })

    const response = await saveDataNoDetailApi.saveData(params, utk)

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
      handleFormSaveDataNoDetailChange('erp', user.erp)
    }
  }, [user.erp])

  return (
    <Wrapper>
      <FormSaveDataNoDetail
        form={form}
        error={error}
        disableRadioR3={user.erp === 'S4'}
        disableRadioS4={user.erp === 'R3'}
        onClear={handleFormSaveDataNoDetailClear}
        onSubmit={handleFormSaveDataNoDetailSubmit}
        onFormChange={handleFormSaveDataNoDetailChange}
        onUploadFileExcel={handleFormSaveDataNoDetailUpload}
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

export default connect(mapStateToProps, null)(SaveDataNoDetail)