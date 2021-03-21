import React, { useState } from 'react'
import { Button, Checkbox, Form, Grid } from 'semantic-ui-react'
import { authApi } from '../src/api/AuthApi'
import modal from '../src/utils/modal'
import router from 'next/router'
export default function register() {
	const [userInfo, setUserInfo] = useState({
		email: '',
		password: '',
		confirm_password: '',
		consent_accept: false
	})
	const onChange = (e) => {
		const { name, value } = e.target
		console.log(name, value)
		setUserInfo({
			...userInfo,
			[name]: value
		})
	}
	const acceptConsent = (e, data) => {
		setUserInfo({
			...userInfo,
			consent_accept: data.checked
		})
	}
	const onClickInfo = async () => {
		const { email, password, confirm_password, consent_accept } = userInfo
		if (password.trim() === confirm_password.trim()) {
			if (consent_accept) {
				const reqBody = {
					"username": email,
					"password": password,
					"consent": `ฉันยอมรับเงื่อนไขและข้อตกลงเกี่ยวกับการใช้งาน ณ วันที่ ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()} ด้วยอีเมลล์ ${email}`
				}
				const result = await authApi.registerUser(reqBody)
				router.push('/login')
			} else {
				modal.error('กรุณายอมรับเงื่อนไขการใช้งาน')
			}

		} else {
			modal.error('Password ไม่ตรงกัน กรุณากรอกใหม่อีกครั้ง')
		}
	}
	return (
		<Grid centered columns={2}>
			<Grid.Column>
				<h4>สร้างบัญชีผู้ใช้</h4>
				<Form>
					<Form.Field>
						<label>อีเมลล์</label>
						<input placeholder='อีเมลล์' onChange={onChange} name="email" value={userInfo.email} />
					</Form.Field>
					<Form.Field>
						<label>รหัสผ่าน</label>
						<input placeholder='รหัสผ่าน' type="password" onChange={onChange} name="password" value={userInfo.password} />
					</Form.Field>
					<Form.Field>
						<label>ยืนยันรหัสผ่าน</label>
						<input placeholder='ยืนยันรหัสผ่าน' type="password" onChange={onChange} name="confirm_password" value={userInfo.confirm_password} />
					</Form.Field>
					<Form.Field>
						<Checkbox label='ฉันยอมรับเงื่อนไขและข้อตกลงเกี่ยวกับการใช้งาน' onChange={acceptConsent} />
					</Form.Field>
					<Button type='submit' onClick={onClickInfo}>ยืนยัน</Button>
				</Form>
			</Grid.Column>
		</Grid>
	)
}
