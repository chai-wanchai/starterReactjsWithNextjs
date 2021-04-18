import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import { Button, Card, Form } from 'semantic-ui-react'
import { authApi } from '../src/api/AuthApi'
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
			setUserInfo({ ...userInfo, profile: user.data })
		} catch (error) {
			console.log(error)
		}
	}
	const onChange = (e, { name, value }) => {
		let state = { ...userInfo }
		state[name] = value
		setUserInfo(state)
	}
	const onSubmit = async () => {
		const { profile, token, zmToken } = userInfo
		const login = await authApi.zipmexToken(profile.userId, token, zmToken)
		console.log(login)
	}
	return (
		<div style={{ backgroundColor: '#152b43', height: '100vh', padding: '2rem' }}>
			 <Head>
        <title>Zipmex & Line</title>
      </Head>
			<img src={`https://miro.medium.com/max/940/1*-EMpvyu_z4W60PVYMkU49Q.png`} style={{ display: 'flex', margin: 'auto' }}></img>
			{/* <img src={userInfo.profile?.pictureUrl} style={{ display: 'flex', margin: 'auto', width: '50%' }}></img> */}
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
