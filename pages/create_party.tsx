import React from 'react'
import { Button } from 'semantic-ui-react'
import CreateParty from '../src/components/Party/CreateParty'
import router from 'next/router'
export default function CreatePartyPage() {
	return (
		<div>
			<div className="nav">
				<Button icon="arrow left" onClick={() => { router.push('/') }} floated="left"></Button>
				<span>สร้างปาร์ตี้</span>
			</div>
			<div className="centered">
				<CreateParty />
			</div>
		</div>
	)
}
