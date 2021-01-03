import { FunctionComponent, useState } from "react"
import { Button, Divider } from "semantic-ui-react"
import styled from "styled-components"
import QrApi from "../../api/QRApi"
import { dataURLtoFile } from "../../utils/DataTofile"
interface Props {

}
const WrapperBackground = styled('div')`
  background-image : url("/images/bg-base.jpg");
  height: 100vh;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  position: fixed;
  width:100%;
`
const Title = styled('h1')`
	text-align:center;
	margin-top:2rem !important;
	font-size: 3rem;
  font-weight: 800;
`
const QRBox = styled('div')`
	box-shadow: 0px 0px 41px -7px rgba(0, 0, 0, 0.15);
	width: 300px;
	height: 300px;
	background-color: white;
	margin:auto;
`
const QRImg = styled('img')`
	width: 300px;
	height: 300px;
`
const QRCode: FunctionComponent<Props> = () => {
	const [qr, setGR] = useState({ src: null, gameId: null })
	const onGenerateQR = async () => {
		const response = await QrApi.getGR()
		if (response.isSuccess) {
			const { qr, gameId } = response.data
			setGR({ src: qr, gameId: gameId })
		}
	}
	const onSaveImg = async () => {
		if (qr.src) {
			const file = dataURLtoFile(qr.src, `${qr.gameId}`)
			const href = await URL.createObjectURL(file);
			const link = document.createElement('a');
			link.href = href;
			link.download = `${qr.gameId}.png`;
			link.click();
		}
	}
	return (
		<WrapperBackground>
			<Title>Generate QR Code</Title>
			<QRBox>
				<QRImg src={qr.src}></QRImg>
			</QRBox>
			<br />
			<div style={{ display: 'flex', justifyContent: 'center' }}>
				<Button onClick={onGenerateQR}>Generate</Button>
				<Button onClick={onSaveImg} color="green">Save</Button>
			</div>

		</WrapperBackground>
	)
}
export default QRCode