import { Component } from 'react'
import Game from '../src/modules/GameLuckyPrizes'
import Head from 'next/head'
import { RebateAppContext } from '../src/intefaces'
import gameApi from '../src/api/GameApi'


class GamePage extends Component<any> {
	static async getInitialProps(ctx: RebateAppContext) {
		const { gameId } = ctx.query
		let props: any = { gameId: gameId }
		if (!gameId) {
			return {
				error: 404
			}
		} else {
			const resGame = await gameApi.checkGamePlayed({ gameId: gameId.toString() })
			if (resGame.data) {
				props.gameData = resGame.data
			} else {
				props.gameData = null
			}
		}
		return props
	}

	render() {
		const { gameId, gameData } = this.props
		return (
			<>
				<Head>
					<title>Game Prizes</title>
				</Head>
				<Game gameId={gameId} gameData={gameData} />
			</>

		)
	}
}

export default GamePage