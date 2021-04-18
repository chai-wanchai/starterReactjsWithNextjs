import { Container } from 'next/app'
import React, { useState } from 'react'
import { Card, Form } from 'semantic-ui-react'

export default function ZipmexSessionToken() {
	const [userInfo, setUserInfo] = useState({
		uid: '',
		session_token: '',
	})
	return (
		<Container>
			<img src={`https://miro.medium.com/max/940/1*-EMpvyu_z4W60PVYMkU49Q.png`} style={{ display: 'flex', margin: 'auto' }}></img>

			<Card style={{ padding: '2rem', width: '80%', margin: '2rem auto' }}>
				<Form>
					<Form.Input label="sess"></Form.Input>
				</Form>
			</Card>
		</Container>

	)
}
