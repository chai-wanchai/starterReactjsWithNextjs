import * as express from 'express';
import { giftController } from '../controller/gift';
import { qrController } from '../controller/qrcode';
import AjaxResult from '../utils/AjaxResult';

const router = express.Router()
router.post('/game-gift', GameGift);
router.post('/game-gift/check-played', CheckGamePlayed)
router.get('/qr-code',QRCode)
async function GameGift(req: express.Request, res: express.Response, next: express.NextFunction) {
	const responseData  = new AjaxResult()
	const data = await giftController.getGiftData(req.body.gameId)
	responseData.data = data[Math.floor(Math.random() * data.length)]
	res.json(responseData)
}
async function CheckGamePlayed(req: express.Request, res: express.Response, next: express.NextFunction) {
	const responseData  = new AjaxResult()
	const data = await giftController.checkGiftPlayed(req.body.gameId)
	responseData.data = data
	res.json(responseData)
}
async function QRCode(req: express.Request, res: express.Response, next: express.NextFunction) {
	const responseData  = new AjaxResult()
	const domain = req.headers.referer.replace('/qr-code','/game-prize')
	const data = await qrController.generateQRCode(domain)
	responseData.data = data
	res.json(responseData)
}

export default router