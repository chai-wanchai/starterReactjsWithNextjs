import React, { useState } from 'react'
import { Button, Form } from 'semantic-ui-react'
import partyApi from '../../api/PartyApi'
import modal from '../../utils/modal'
import router from 'next/router'
export default function CreateParty() {
	const [partyInfo, setPartyInfo] = useState({
		name: '',
		limit: 0
	})
	const onChange = (e) => {
		const { name, value } = e.target
		setPartyInfo({
			...partyInfo,
			[name]: value
		})
	}
	const onClickCreate = async () => {
		const res = await partyApi.createParty(partyInfo)
		if (res.error) {
			modal.error(res.error.message)
		} else {
			router.push('/')
		}
	}
	return (
		<>
			<Form>
				<Form.Field>
					<label>ชื่อปาร์ตี้</label>
					<input placeholder='ชื่อปาร์ตี้' onChange={onChange} name="name" value={partyInfo.name} />
				</Form.Field>
				<Form.Field>
					<label>จำนวนคนที่ขาด</label>
					<input placeholder='จำนวนคนที่ขาด' onChange={onChange} name="limit" value={partyInfo.limit} type="number" />
				</Form.Field>
				<Button type='submit' onClick={onClickCreate} className="btn-center">สร้างปาร์ตี้</Button>
			</Form>
		</>
	)
}
