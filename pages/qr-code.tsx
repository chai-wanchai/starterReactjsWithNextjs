import { Component } from 'react'
import { RebateAppPageProps, RebateAppContext } from '../src/intefaces'
import QRCode from '../src/modules/QRCode'
interface QRCodePageProps {
}

class QRCodePage extends Component<QRCodePageProps> {
	// static getInitialProps = (ctx: RebateAppContext) => withAuth(ctx).then<RebateAppPageProps>((props) => ({
	//   ...props,
	//   layout: 'main'
	// }))

	render() {
		return (
			<>
				<QRCode />
			</>
		)
	}
}

export default QRCodePage