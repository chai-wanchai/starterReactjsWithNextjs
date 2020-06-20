import styled from 'styled-components'
import { connect } from 'react-redux'
import { useRouter } from 'next/router'
import { FormEvent, FunctionComponent, useState } from 'react'
import { rebateTypeApi } from '../../api/RebateTypeApi'
import { RootState } from '../../stores'
import modal from '../../utils/modal'
import FormRebateType from './FormRebateType'
import FormTableRebateType from './FormTableRebateType'

const Wrapper = styled('div')`
  .ui.grid {
    & .row > .column {
      margin-bottom: 10px;
    }
    & > .row:first-child {
      padding: 10px 0 0;
    }
    & > .row:last-child {
      padding: 0 0 10px;
    }
  }
  & > :first-child, :last-child {
    margin-bottom: 40px;
  }
`

// End styled-component ---------------------------

export interface RebateData {
  rebate_type?: any
  rebate_desc_th?: any
  rebate_desc_en?: any
  rebate_owner?: boolean
  prod_hier?: any
  comp_resp?: any
  created_date?: any
  created_by?: any
  updated_date?: any
  updated_by?: any
}

export interface StateForm {
  rebateType: string
  compResponse: number | string
  rebateDesTH: string
  rebateDesEN: string
}

export interface StateError extends StateForm {
  compResponse: string
}

interface RebateTypeProps {
  utk: string
  rebate: RebateData[]
}

// End typescript defined -------------------------

const initState: StateForm = {
  rebateType: '',
  compResponse: null,
  rebateDesTH: '',
  rebateDesEN: '',
}

const initError: StateError = {
  ...initState,
  compResponse: '',
}

const RebateType: FunctionComponent<RebateTypeProps> = ({
  utk,
  rebate
}) => {
  const router = useRouter()
  const [form, setForm] = useState<StateForm>(initState)
  const [error, setError] = useState<StateError>(initError)
  const [selected, setSelected] = useState<RebateData>({})
  const [rebateType, setRebateType] = useState<RebateData[]>([ ...rebate ])

  /** Handler FormRebateType */

  const validateForm = () => {
    const formError: StateError = { ...error }

    if (!form.rebateType) {
      formError.rebateType = 'กรุณาระบุ Rebate Type'
    }
    if (form.rebateType.length > 3) {
      formError.rebateType = 'โปรดระบุมากสุด 3 ตัวอักษร'
    }
    if (
      typeof selected.rebate_type === 'undefined' &&
      rebate.find(item => form.rebateType === item.rebate_type)
    ) {
      formError.rebateType = 'Rebate Type นี้ถูกใช้งานแล้ว โปรดแก้ไขข้อมูล'
    }
    if (!form.compResponse) {
      formError.compResponse = 'กรุณาเลือก Comp. Response'
    }
    if (!form.rebateDesTH) {
      formError.rebateDesTH = 'กรุณาระบุ Rebate Description THAI'
    }
    if (form.rebateDesTH.length > 100) {
      formError.rebateDesTH = 'โปรดระบุมากสุด 100 ตัวอักษร'
    }

    if (Object.keys(formError).some(key => formError[key] !== '')) {
      setError(formError)
      return false
    }
    return true
  }

  const handleFormRebateTypeClear = () => {
    setForm(initState)
    setError(initError)
    setSelected({})
  }

  const handleFormRebateTypeChange = (key: keyof StateForm, value) => {
    setForm({ ...form, [key]: value })
    setError({ ...error, [key]: '' })
  }

  const handleFormRebateTypeSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const isValid = validateForm()

    if (!isValid) {
      return
    }

    const result: RebateData = {
      rebate_owner: true,
      rebate_type: form.rebateType,
      rebate_desc_th: form.rebateDesTH,
      rebate_desc_en: form.rebateDesEN,
      comp_resp: form.compResponse
    }

    handleFormTableRebateTypeSave(result)
  }

  /** Handler FormTableRebateType */

  const handleFormTableRebateTypeCheck = (val: any) => {
    const result = rebateType.find(item => item.rebate_type === val)

    setError(initError)

    if (selected.rebate_type === result.rebate_type) {
      setSelected({})
      setForm(initState)
    } else {
      setSelected({ ...result })
      setForm({
        rebateType: result.rebate_type,
        compResponse: result.comp_resp,
        rebateDesTH: result.rebate_desc_th,
        rebateDesEN: result.rebate_desc_en
      })
    }
  }

  const handleFormTableRebateTypeSave = async (value: RebateData) => {

    const confirm = await modal.confirm('ยืนยันการบันทึกข้อมูลผู้ใช้')

    if (!confirm.value) {
      return
    }

    const response = await rebateTypeApi.saveRebateType(value, utk)

    if (response.isSuccess) {
      await modal.open({ type: 'success', title: 'บันทึกข้อมูล Success' })
      router.reload()
    } else {
      modal.error(response.error.message)
    }
  }

  const handleFormTableRebateTypeDelete = async () => {

    const confirm = await modal.confirm('ยืนยันการลบข้อมูลผู้ใช้')

    if (!confirm.value) {
      return
    }
    
    const response = await rebateTypeApi.deleteRebateType(selected.rebate_type, utk)

    if (response.isSuccess) {
      await modal.open({ type: 'success', title: 'บันทึกข้อมูล Success' })
      router.reload()
    } else {
      modal.error(response.error.message)
    }

  }

  return (
    <Wrapper>
      <FormRebateType
        form={form}
        error={error}
        onClear={handleFormRebateTypeClear}
        onSubmit={handleFormRebateTypeSubmit}
        onFormChange={handleFormRebateTypeChange}
        isFillForm={typeof selected.rebate_type !== 'undefined'}
      />
      <FormTableRebateType
        rebate={rebateType}
        selected={selected}
        onFormCheck={handleFormTableRebateTypeCheck}
        onFormDelete={handleFormTableRebateTypeDelete}
      />
    </Wrapper>
  )
}

const mapStateToProps = ({ auth }: RootState) => ({
  utk: auth.token
})

export default connect(mapStateToProps, null)(RebateType)