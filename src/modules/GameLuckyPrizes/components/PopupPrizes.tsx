import { FunctionComponent, useEffect, useRef, useState } from "react";
import { Modal } from "semantic-ui-react";
import GiftCard from './GiftCard'
interface Props {
	isOpen: boolean
	setOpen?: (open: boolean) => void
}
const PopupPrizes: FunctionComponent<Props> = ({ isOpen,setOpen }) => {
	useEffect(() => {
		setOpen(isOpen)
	}, [isOpen])
	return (
		<>
			<Modal
				onClose={() => setOpen(false)}
				onOpen={() => setOpen(true)}
				open={isOpen}>
				<Modal.Content>
					<Modal.Description>
						<GiftCard promotionCode={"WELCOME2021"} status="lost"></GiftCard>
					</Modal.Description>
				</Modal.Content>
			</Modal>
		</>
	)
}

export default PopupPrizes