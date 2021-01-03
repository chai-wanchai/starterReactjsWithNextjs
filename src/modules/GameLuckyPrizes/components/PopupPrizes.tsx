import { FunctionComponent, useEffect, useRef, useState } from "react";
import { Modal, ModalProps } from "semantic-ui-react";
import GiftCard from './GiftCard'
interface Props {
	isOpen: boolean
	setOpen?: (open: boolean) => void
	modalProps?: ModalProps
	giftData: any
}
const PopupPrizes: FunctionComponent<Props> = ({ isOpen, setOpen, modalProps, giftData }) => {
	const [gift, setGift] = useState({ promotionCode: null, description: null, status: 'lost' })
	useEffect(() => {
		setOpen(isOpen)
		if (giftData) {
			setGift({ status: 'win', ...giftData })
		} else {
			setGift({ status: 'lost', ...gift })
		}
	}, [isOpen])
	return (
		<>
			<Modal
				onOpen={() => setOpen(true)}
				open={isOpen}
				{...modalProps}>
				<Modal.Content>
					<Modal.Description>
						<GiftCard promotionCode={gift.promotionCode} status={gift.status} description={gift.description}></GiftCard>
					</Modal.Description>
				</Modal.Content>
			</Modal>
		</>
	)
}

export default PopupPrizes