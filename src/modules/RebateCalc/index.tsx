import moment from 'moment'
import dynamic from 'next/dynamic'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { FormEvent, FunctionComponent, useState } from 'react'
import { rebateCalcApi } from '../../api/RebateCalcApi'
import { RootState } from '../../stores'
import modal from '../../utils/modal'
import FormRebateCalcSearch from './FormRebateCalcSearch'

const FormTableRebateCalc = dynamic(import('./FormTableRebateCalc'), { ssr: false })

const Wrapper = styled('div')`
  .ui.grid > .row {
    & > .column {
      margin-bottom: 10px;
    }
    & > .column:last-child {
      margin-bottom: 0;
    }
  }
  & > :first-child, :last-child {
    margin-bottom: 40px;
  }
`

// End styled-components -----------------------------

export interface RebateData {
  amount?: any
  comp_id?: any
  industry_id?: any
  rebate_type?: any
  rebate_desc_th?: any
}

export interface StateForm {
  month: string
  round: string
  baseLine: Date
}

export interface StateError {
  month: string
  round: string
}

interface RebateCalcProps {
  utk: string
  comps: string
}

// End typescript defined ----------------------------

const initState: StateForm = {
  month: '',
  round: '',
  baseLine: undefined
}

const initError: StateError = {
  month: '',
  round: ''
}

const RebateCalc: FunctionComponent<RebateCalcProps> = ({
  utk,
  comps
}) => {
  const [form, setForm] = useState<StateForm>(initState)
  const [error, setError] = useState<StateError>(initError)
  const [rebate, setRebate] = useState<RebateData[]>([])

  /** Handler FormRebateCalcSearch */

  const validateForm = () => {
    const formError: StateError = { ...error }

    if (!form.month) {
      formError.month = 'กรุณาเลือก เดือน!'
    }
    if (!form.round) {
      formError.round = 'กรุณาเลือก รอบ!'
    }

    if (Object.keys(formError).some(key => formError[key] !== '')) {
      setError(formError)
      return false
    }
    return true
  }

  const handleFormRebateCalcSearchChange = (key: keyof StateForm, value) => {
    setForm({ ...form, [key]: value })
    setError({ ...error, [key]: '' })
  }

  const handleFormRebateCalcSearchSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const isValid = validateForm()

    if (!isValid) {
      return
    }

    await modal.fetching()
    const response = await rebateCalcApi.getRebateByPeriod(form.month, form.round, comps, utk)

    if (response.isSuccess) {
      modal.close()
      setRebate(response.data)
    } else {
      modal.error(response.error.message, () => setRebate([]))
    }

  }

  /** Handler FormTableRebateCalc */

  const handleFormTableRebateCalcSend = async () => {
    const confirm = await modal.confirm('ยืนยันการส่งข้อมูลไประบบ SAP')

    if (!confirm.value) {
      return
    }

    const params = { data: rebate, baseLine: moment(form.baseLine).format('YYYY-MM-DD') }

    modal.fetching({ title: <p>กำลังส่งข้อมูล</p> })

    const response = await rebateCalcApi.sendRebateByPeriod(params, utk)

    if (response.isSuccess) {
      modal.open({ type: 'success', title: 'บันทึกข้อมูล Success' })
    } else {
      modal.error(response.error.message)
    }
  }

  return (
    <Wrapper>
      <FormRebateCalcSearch
        form={form}
        error={error}
        onSubmit={handleFormRebateCalcSearchSubmit}
        onFormChange={handleFormRebateCalcSearchChange}
      />
      {rebate.length > 0 &&
        <FormTableRebateCalc
          rebate={rebate}
          baseLine={form.baseLine}
          onSend={handleFormTableRebateCalcSend}
          onBaseLineChange={data => handleFormRebateCalcSearchChange('baseLine', data)}
        />
      }
    </Wrapper>
  )
}

const mapStateToProps = ({ auth }: RootState) => ({
  utk: auth.token,
  comps: auth.user.info.comp_id
    .split(',')
    .map(comp => `'${comp}'`)
    .join(',')
})

export default connect(mapStateToProps, null)(RebateCalc)