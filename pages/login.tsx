import React, { Component, useEffect, useState } from 'react'
import { Button, Checkbox, Form, Grid, Image } from 'semantic-ui-react'
import router from 'next/router'
import { authApi } from '../src/api/AuthApi'
import userToken from '../src/utils/userToken'

export default function login({
	todoAuth, auth
}) {
	useEffect(() => {
		const token = userToken.getUserToken()
		if (token) {
			router.push('/')
		}
	}, [])
	const [userLogin, setUserLogin] = useState({
		email: '',
		password: ''
	})
	const onChange = (e) => {
		const { name, value } = e.target
		setUserLogin({
			...userLogin,
			[name]: value
		})
	}
	const onClickLogin = async () => {
		const { email, password } = userLogin
		const result: any = await authApi.login(email, password)
		userToken.setUserToken(result.access_token)
		router.push('/')
	}
	return (
		<div className="centered">
			<Image src="https://www.scb10x.com/android-chrome-192x192.png" style={{ margin: '0 auto' }} />
			<Form>
				<Form.Field>
					<label>อีเมลล์</label>
					<input placeholder='อีเมลล์' onChange={onChange} name="email" value={userLogin.email} />
				</Form.Field>
				<Form.Field>
					<label>รหัสผ่าน</label>
					<input placeholder='รหัสผ่าน' onChange={onChange} name="password" value={userLogin.password} type="password" />
				</Form.Field>
				<Button type='submit' onClick={onClickLogin} className="btn-center">เข้าสู่ระบบ</Button>
			</Form>
			<Button onClick={() => { router.push('/register') }} className="btn-center my-2">สร้างบัญชีผู้ใช้</Button>
		</div>
	)
}
