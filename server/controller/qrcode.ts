import QRCode from 'qrcode'

class QRCodeController {
	async generateQRCode(domain:string) {
		const gameId = this.uuidv4()
		const base64 = await QRCode.toDataURL(`${domain}/${gameId}`)
		return {
			qr: base64,
			gameId: gameId
		}
	}
	uuidv4() {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
			return v.toString(16);
		});
	}
	
}
export const qrController = new QRCodeController();