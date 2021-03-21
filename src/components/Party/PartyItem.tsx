import React from 'react'
import { Button, Card, Image } from 'semantic-ui-react'
import modal from '../../utils/modal'
interface IProps {
	id: number
	name: string
	limit: number
	join: number
	onClickJoin?: (data) => void
}
export default function PartyItem(props: IProps) {
	const { name, limit, join, onClickJoin, id } = props
	const onClick = async () => {
		const result = await modal.confirm(`คุณต้องการเข้าร่วมปาร์ตี้ :  ${name}`)
		if (result.value) {
			if (onClickJoin) {
				onClickJoin(id)
			}
		}
	}
	return (
		<Card style={{ margin: '1rem auto' }}>
			<Image src='https://react.semantic-ui.com/images/wireframe/image.png' wrapped ui={false} />
			<Card.Content>
				<Card.Header>{name}</Card.Header>
			</Card.Content>
			<Card.Content extra>
				<span>{`${join}/${limit}`}</span>
				<Button onClick={onClick} floated="right">Join</Button>
			</Card.Content>
		</Card>
	)
}
