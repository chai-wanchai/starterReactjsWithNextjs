import BaseApi from './BaseApi'

class QRApi extends BaseApi {
	public getGR = () => {
    return this.appGet('/api/qr-code')
	}
}
export const QrApi = new QRApi()

export default QrApi