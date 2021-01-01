import { Component } from 'react'
import Game from '../src/modules/GameLuckyPrizes'
import Head from 'next/head'


class GamePage extends Component<any> {


	render() {
		const { router } = this.props
		const { gameId } = router.query
		return (
			<>
				<Head>
					<title>Game Prizes</title>
				</Head>
				<Game gameId={gameId} />
			</>

		)
	}
}

export default GamePage