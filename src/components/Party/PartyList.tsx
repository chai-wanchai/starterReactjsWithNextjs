import React, { useEffect, useState } from 'react'
import { Button, Grid } from 'semantic-ui-react'
import partyApi from '../../api/PartyApi'
import PartyItem from './PartyItem'
import router from 'next/router'
import modal from '../../utils/modal'
export default function PartyList() {
	const [data, setData] = useState([])
	useEffect(() => {
		fetchData()
	},[])
	const fetchData = async () => {
		const { data } = await partyApi.getAllParty()
		setData(data)
	}
	const onClickJoin = async (id) => {
		const res = await partyApi.joinParty({ party_id: id })
		if(res.error){
			modal.error(res.error.message)
		}else{
			setData(res.data)
		}
	}

	return (
		<div>
			<div>
				<span>ปาร์ตี้ทั้งหมด</span>
				<Button floated="right" onClick={() => { router.push('/create_party') }}>สร้างปาร์ตี้</Button>
			</div>
			<Grid>
				<Grid.Row columns={2}>
					{data && data.map((item, index) => {
						const { party_name, limit, party_join, id } = item
						return (
							<Grid.Column key={`${id}-${index}`}>
								<PartyItem name={party_name} id={id} limit={limit} join={party_join.length}  onClickJoin={onClickJoin}></PartyItem>
							</Grid.Column>
						)
					})}


				</Grid.Row>
			</Grid>

		</div>
	)
}
