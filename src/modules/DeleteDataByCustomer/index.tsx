import moment from 'moment'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { Menu } from 'semantic-ui-react'
import { FormEvent, FunctionComponent, useState } from 'react'
import { RootState } from '../../stores'
import { deleteDataByRebateTypeApi } from '../../api/DeleteDataByRebateTypeApi'
import modal from '../../utils/modal'
import FormSearchRebateType from './FormSearchRebateType'
import FormTableListDataNoDetail from './FormTableListDataNoDetail'
import FormTableListDataWithDetail from './FormTableListDataWithDetail'

const Wrapper = styled('div')`
  .ui.grid > .row > .column {
    margin-bottom: 10px;
  }
  & > :first-child, :last-child {
    margin-bottom: 40px;
  }
`

// End styled-component ---------------------------

interface ResponseData {
  data_id?: any
  template_type?: '1' | '2'
  destination_type?: 'R3' | 'S4'
  customer_id?: any
  amount?: any
  rebate_type?: any
  comp_id?: any
  period?: any
  period_group?: any
  industry_id?: any
  comp_affi?: any
  prod_hier?: any
  plant?: any
  rate?: any
  step?: any
  unit?: any
  quantity?: any
  receive_month?: any
  product_desc?: any
}

export interface StateForm {
  rebateType: string
  period: Date | string
  periodGroup: string
}

export interface StateError extends StateForm {
  period: string
}

export interface StateListNoDetail {
  id: any
  erp: 'R3' | 'S4'
  customerId: string
  amount: number
  rebateType: string
  companyId: string
  period: string
  section: string
  compAffi: string
  productHierachy: string
  plant: string
}

export interface StateListWithDetail {
  id: any
  erp: 'R3' | 'S4'
  customerId: string
  amount: number
  rebateType: string
  companyId: string
  period: string
  section: string
  compAffi: string
  productHierachy: string
  plant: string
  rate: string
  unit: string
  step: string
  quantity: number
  receiveMonth: string
  productDescription: string
}

interface EditDataByCustomerProps {
  utk?: string
}

// End typescript defined -------------------------

const initForm: StateForm = {
  rebateType: '',
  period: undefined,
  periodGroup: ''
}

const initError: StateError = { ...initForm, period: '' }

const DeleteDataByCustomer: FunctionComponent<EditDataByCustomerProps> = ({
  utk
}) => {
  const [viewTab, setViewTab] = useState<1 | 2>(1)
  const [form, setForm] = useState({ ...initForm })
  const [error, setError] = useState({ ...initError })
  const [listNoDetail, setListNoDetail] = useState<StateListNoDetail[]>([])
  const [listWithDetail, setListWithDetail] = useState<StateListWithDetail[]>([])

  const handleDeleteDataByRebateType = async () => {
    const confirm = await modal.confirm('ยืนยันการลบข้อมูล !')

    if (!confirm.value) {
      return
    }

    const params = {
      rebate_type: form.rebateType,
      period_group: form.periodGroup,
      period: moment(form.period).format('MMYY'),
      template_type: viewTab.toString()
    }
    
    const response = await deleteDataByRebateTypeApi.deleteByRebateType(params, utk)

    if (response.isSuccess) {
      await modal.open({ type: 'success', title: 'ลบข้อมูล Success' })
      setViewTab(1)
      setForm({ ...initForm })
      setError({ ...initError })
      setListNoDetail([])
      setListWithDetail([])
    } else {
      modal.error(response.error.message)
    }
  }

  /** Handler FormSearchRebateType */

  const validateFormSearch = () => {
    const formError = { ...initError }

    if (!form.rebateType) {
      formError.rebateType = 'โปรดระบุ Rebate Type'
    }

    if (typeof form.period === 'undefined') {
      formError.period = 'กรุณาระบุ เดือนปี'
    }

    if (!form.periodGroup) {
      formError.periodGroup = 'กรุณาระบุ รอบที่'
    }

    if (Object.keys(formError).some(key => formError[key] !== '')) {
      setError(formError)
      return false
    }
    return true
  }

  const handleFormSearchRebateTypeClear = () => {
    setForm(initForm)
    setError(initError)
  }

  const handleFormSearchRebateTypeChange = (key: keyof StateForm, value) => {
    setForm({ ...form, [key]: value })
    setError({ ...error, [key]: '' })
  }

  const handleCreateList = (data: ResponseData[]) => {
    const tempNoDetail: StateListNoDetail[] = []
    const tempWithDetail: StateListWithDetail[] = []

    data.forEach(item => {
      if (item.template_type === '1') {
        tempNoDetail.push({
          id: item.data_id,
          erp: item.destination_type,
          customerId: item.customer_id,
          companyId: item.comp_id,
          section: item.industry_id,
          amount: parseFloat(item.amount),
          rebateType: item.rebate_type,
          period: item.period,
          compAffi: item.comp_affi,
          plant: item.plant,
          productHierachy: item.prod_hier,
        })
      }
      if (item.template_type === '2') {
        tempWithDetail.push({
          id: item.data_id,
          erp: item.destination_type,
          customerId: item.customer_id,
          companyId: item.comp_id,
          section: item.industry_id,
          amount: parseFloat(item.amount),
          rebateType: item.rebate_type,
          period: item.period,
          compAffi: item.comp_affi,
          plant: item.plant,
          productHierachy: item.prod_hier,
          rate: item.rate,
          unit: item.unit,
          step: item.step,
          quantity: parseFloat(item.quantity),
          receiveMonth: item.receive_month,
          productDescription: item.product_desc, 
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

  const handleSearchDataByRebateType = async () => {
    modal.fetching()

    const params = {
      rebate_type: form.rebateType,
      period_group: form.periodGroup,
      period: moment(form.period).format('MMYY'),
    }

    const response = await deleteDataByRebateTypeApi.getDataByRebateType(params, utk)

    if (response.isSuccess) {
      if (response.data.length === 0) {
        modal.open({
          title: 'ไม่พบข้อมูล Rebate Type',
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

  const handleFormSearchRebateTypeSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!validateFormSearch()) {
      return
    }

    handleSearchDataByRebateType()
  }

  return (
    <Wrapper>
      <FormSearchRebateType
        form={form}
        error={error}
        onSubmit={handleFormSearchRebateTypeSubmit}
        onFormClear={handleFormSearchRebateTypeClear}
        onFormChange={handleFormSearchRebateTypeChange}
      />
      {(listNoDetail.length > 0 || listWithDetail.length > 0) &&
        <>
          <Menu pointing secondary color='blue'>
            <Menu.Item
              link
              name='ข้อมูลแบบไม่มีรายละเอียด'
              active={viewTab === 1}
              onClick={() => setViewTab(1)}
            />
            <Menu.Item
              link
              name='ข้อมูลแบบมีรายละเอียด'
              active={viewTab === 2}
              onClick={() => setViewTab(2)}
            />
          </Menu>
          {viewTab === 1 && listNoDetail.length > 0 &&
            <FormTableListDataNoDetail
              list={listNoDetail}
              onDelete={handleDeleteDataByRebateType}
            />
          }
          {viewTab === 2 && listWithDetail.length > 0 &&
            <FormTableListDataWithDetail
              list={listWithDetail}
              onDelete={handleDeleteDataByRebateType}
            />
          }
        </>
      }
    </Wrapper>
  )
}

const mapStateToProps = ({ auth }: RootState) => ({
  utk: auth.token
})

export default connect(mapStateToProps, null)(DeleteDataByCustomer)