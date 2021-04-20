import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import { Button, Card, Form } from 'semantic-ui-react'
import { authApi } from '../src/api/AuthApi'
import modal from '../src/utils/modal'
import SessionToken from '../src/components/Instruction/SessionToken'
import config from '../config'
export default function ZipmexSessionToken(props) {
	const [userInfo, setUserInfo] = useState({
		token: '',
		zmToken: '',
		profile: {
			displayName: "",
			language: "",
			pictureUrl: "",
			statusMessage: "",
			userId: ""
		}
	})
	useEffect(() => {
		let uid = ''
		if (props.router) {
			uid = props.router.query?.uid
			getUserProfile(uid)
		}
	}, [])
	const getUserProfile = async (uid: string) => {
		try {
			const user = await authApi.getUserProfile(uid)
			console.log(user)
			setUserInfo({ ...userInfo, profile: user })
		} catch (error) {
			modal.error(error.error.message)
		}
	}
	const onChange = (e, { name, value }) => {
		let state = { ...userInfo }
		state[name] = value
		setUserInfo(state)
	}
	const onSubmit = async () => {
		const { profile, token, zmToken } = userInfo
		try {
			const login = await authApi.zipmexToken(profile.userId, token, zmToken)
			modal.success(`การเชื่อมต่อ zipmex lime bot กับ zipmex สำเร็จ`,{text:`Email : ${login.data}`}).then(result=>{
				window.open(`https://line.me/R/ti/p/${config.zipmexBot?.line_id}`,'_self')
			})			
		} catch (error) {
			modal.error(error.error.message)
			console.log(error.error.message)
		}

	}
	return (
		<div style={{ backgroundColor: '#152b43', padding: '2rem' }}>
			<Head>
				<title>Zipmex & Line</title>
			</Head>
			{/* <img src={`https://miro.medium.com/max/940/1*-EMpvyu_z4W60PVYMkU49Q.png`} style={{ display: 'flex', margin: 'auto' }}></img> */}
			{/* <img src={userInfo.profile?.pictureUrl} style={{ display: 'flex', margin: 'auto', width: '50%' }}></img> */}
			<SessionToken/>
			<Card style={{ padding: '2rem', width: '80%', margin: '2rem auto' }}>
				<Form >
					<Form.Input label="token" name="token" onChange={onChange} value={userInfo.token}></Form.Input>
					<Form.Input label="zmToken" name="zmToken" onChange={onChange} value={userInfo.zmToken}></Form.Input>
					<Button style={{ backgroundColor: '#21bdca', color: 'white', display: 'flex', margin: 'auto' }} onClick={onSubmit}>ยืนยัน</Button>
				</Form>
			</Card>
		</div>

	)
}
