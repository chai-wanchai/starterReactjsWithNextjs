import BaseApi from './BaseApi'

class GameApi extends BaseApi {
	public getGameGift = (body: { gameId: string }) => {
    return this.appPost('api/game-gift', body)
	}
	public checkGamePlayed = (body: { gameId: string })=> {
    return this.appPost('api/game-gift/check-played', body)
	}
}
export const gameApi = new GameApi()

export default gameApi