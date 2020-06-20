import styled from 'styled-components'
import { useRouter } from 'next/router'
import { connect } from 'react-redux'
import { FunctionComponent, FormEvent, useState } from 'react'
import { userProfileApi } from '../../api/UserProfileApi'
import { RootState } from '../../stores'
import modal from '../../utils/modal'
import FormEditUser from './FormEditUser'
import FormTableUser from './FormTableUser'

const Wrapper = styled('div')`
  .ui.grid > .row > .column {
    margin-bottom: 10px;
  }
  & > :first-child, :last-child {
    margin-bottom: 40px;
  }
`

// End styled-component ---------------------------

export interface UserProfile {
  user_id?: any
  user_fname?: any
  user_lname?: any
  email?: any
  role_id?: any
  comp_id?: any
  section_id?: any
  created_date?: any
  created_by?: any
  updated_date?: any
  updated_by?: any
  last_log_on?: any
  template_type?: any
  destination_type?: any
}

export interface StateForm {
  uid: string
  email: string
  company: any[]
  lastName: string
  firstName: string
  erp: number | string
  role: number | string
}

export interface StateError {
  uid: string
  erp: string
  role: string
  email: string
  company: string
  lastName: string
  firstName: string
}

interface EditUserProps {
  utk: string
  user: UserProfile[]
}

// End typescript defined -------------------------

const initState: StateForm = {
  uid: '',
  email: '',
  lastName: '',
  firstName: '',
  company: [],
  erp: null,
  role: null,
}

const initError: StateError = {
  ...initState,
  company: '',
  erp: '',
  role: ''
}

const EditUser: FunctionComponent<EditUserProps> = ({
  utk,
  user
}) => {
  const router = useRouter()
  const [form, setForm] = useState<StateForm>(initState)
  const [error, setError] = useState<StateError>(initError)
  const [selected, setSelected] = useState<UserProfile>({})
  const [userProfile, setUserProfile] = useState<UserProfile[]>([ ...user ])

  /** Handler FormEditUser */

  const validateForm = () => {
    const formError: StateError = { ...error }

    if (!form.uid) { // uid require
      formError.uid = 'กรุณาระบุ ไอดีผู้ใช้งาน'
    }
    if (form.uid.length > 20) { // uid maximum length
      formError.uid = 'โปรดระบุมากสุด 20 ตัวอักษร'
    }
    if (
      typeof selected.user_id === 'undefined' &&
      userProfile.find(uProfile => uProfile.user_id === form.uid)
    ) {
      formError.uid = 'ไอดีนี้ถูกใช้งานแล้ว โปรดแก้ไขข้อมูล'
    }
    if (form.firstName.length > 50) { // firstName maximum length
      formError.firstName = 'โปรดระบุมากสุด 50 ตัวอักษร'
    }
    if (form.lastName.length > 100) { // lastName maximum length
      formError.lastName = 'โปรดระบุมากสุด 100 ตัวอักษร'
    }
    if (form.email.length > 50) { // email maximum length
      formError.email = 'โปรดระบุมากสุด 50 ตัวอักษร'
    }
    if (form.company.length === 0) { // company require
      formError.company = 'กรุณาเลือก company'
    }
    if (!form.erp) { // erp require
      formError.erp = 'กรุณาเลือก erp'
    }
    if (!form.role) { // role require
      formError.role = 'กรุณาเลือก role'
    }

    if (Object.keys(formError).some(key => formError[key] !== '')) {
      setError(formError)
      return false
    }
    return true
  }

  const handleFormEditUserClear = () => {
    setForm(initState)
    setError(initError)
    setSelected({})
  }

  const handleFormEditUserChange = (key: keyof StateForm, value) => {
    setForm({ ...form, [key]: value })
    setError({ ...error, [key]: '' })
  }

  const handleFormEditUserSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const isValid = validateForm()

    if (!isValid) {
      return
    }

    const val = {
      user_id: form.uid,
      email: form.email,
      role_id: form.role,
      comp_id: form.company.join(','),
      user_lname: form.lastName,
      user_fname: form.firstName,
      destination_type: form.erp,
    }

    if (typeof selected.user_id !== 'undefined') {
      const result = userProfile.map(uProfile =>
        uProfile.user_id ===  selected.user_id ? val : uProfile
      )
      setUserProfile(result)
      setSelected(val)
    } else {
      setUserProfile([ val, ...userProfile ])
      setForm(initState)
    }
  }

  /** Handler FormTableUser */

  const handleFormTableUserCheck = (val: any) => {
    const result = userProfile.find(u => u.user_id === val)

    setError(initError)

    if (selected.user_id === result.user_id) {
      setSelected({})
      setForm(initState)
    } else {
      setSelected({ ...result })
      setForm({
        uid: result.user_id,
        firstName: result.user_fname,
        lastName: result.user_lname,
        email: result.email,
        company: result.comp_id.split(','),
        erp: result.destination_type,
        role: result.role_id
      })
    }
  }

  const handleFormUserSave = async () => {
    const confirm = await modal.confirm('ยืนยันการบันทึกข้อมูลผู้ใช้')

    if (!confirm.value) {
      return
    }

    const response = await userProfileApi.saveUserProfile(selected, utk)

    if (response.isSuccess) {
      await modal.open({ type: 'success', title: 'บันทึกข้อมูล Success' })
      router.reload()
    } else {
      modal.error(response.error.message)
    }

  }

  const handleFormTableUserDelete = async () => {

    const confirm = await modal.confirm('ยืนยันการลบข้อมูลผู้ใช้')

    if (!confirm.value) {
      return
    }
    
    const response = await userProfileApi.deleteUserProfile(selected.user_id, utk)

    if (response.isSuccess) {
      await modal.open({ type: 'success', title: 'บันทึกข้อมูล Success' })
      router.reload()
    } else {
      modal.error(response.error.message)
    }

  }

  return (
    <Wrapper>
      <FormEditUser
        form={form}
        error={error}
        onClear={handleFormEditUserClear}
        onSubmit={handleFormEditUserSubmit}
        onFormChange={handleFormEditUserChange}
        isFillForm={typeof selected.user_id !== 'undefined'}
      />
      <FormTableUser
        profile={selected}
        user={userProfile}
        onFormSave={handleFormUserSave}
        onFormCheck={handleFormTableUserCheck}
        onFormDelete={handleFormTableUserDelete}
      />
    </Wrapper>
  )
}

const mapStateToProps = ({ auth }: RootState) => ({
  utk: auth.token
})

export default connect(mapStateToProps, null)(EditUser)