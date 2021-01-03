
class GiftController {
	async getGiftData(gameId: string) {
		return [
			{ promotionCode: 'DIRECT', description: 'รับส่วนลด 25% สูงสุด ฿200.00 เมื่อช้อปครบ ฿1,000.00 หมดเขต 05-01-2021 สำหรับคำสั่งซื้อที่ชำระเงินผ่าน Shopee, จำกัดการใช้โค้ด 1 คน/ครั้ง/เครื่อง และซื้อผ่านแอปเท่านั้น' }
			, { promotionCode: 'ddddd', description: 'รับส่วนลด 15% สูงสุด ฿120.00 เมื่อช้อปครบ ฿699.00 หมดเขต 01-01-2021 สำหรับคำสั่งซื้อที่ชำระเงินผ่าน Shopee, จำกัดการใช้โค้ด 1 คน/ครั้ง/เครื่อง และซื้อผ่านแอปเท่านั้น' }
			, null
			, { status: 'win-register', description: 'ลงทะเบียน' }
		]
	}
	async checkGiftPlayed(gameId: string) {
		if (gameId === '1234') {
			return { promotionCode: gameId.toUpperCase(), description: 'รับส่วนลด 25% สูงสุด ฿200.00 เมื่อช้อปครบ ฿1,000.00 หมดเขต 05-01-2021 สำหรับคำสั่งซื้อที่ชำระเงินผ่าน Shopee, จำกัดการใช้โค้ด 1 คน/ครั้ง/เครื่อง และซื้อผ่านแอปเท่านั้น' }
		}
		if (gameId === '56789') {
			return {
				status: 'lost'
			}
		}
		return null

	}
}
export const giftController = new GiftController();