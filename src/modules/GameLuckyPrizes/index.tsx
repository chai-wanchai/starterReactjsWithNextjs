import React, { FunctionComponent, useRef, useState } from "react"
import styled from "styled-components"
import PopupPrizes from "./components/PopupPrizes"
interface Props {
	gameId: string
}
const Tittle = styled('h1')`
	font-family: 'Helvetica Neue', sans-serif; 
	font-size: 5rem; 
	font-weight: bold; 
	text-align: center;
	color: white;
`
const GiftImg = styled('div')`
	height: 50%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	text-align: center;
	cursor: pointer;
	@keyframes bigSize {
		0%, 100% {
			width: 300px;
			transform: rotate(-10deg);
	 }
	 50% {
		width: 350px;
	  transform: rotate(10deg);
	 }
	}
	img {
		width: 300px;
		animation:bigSize 1s infinite;
	}
`
const Wrapper = styled('div')`
  background-image : url("/images/yellow-bg.jpg");
  height: 100vh;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  position: fixed;
  width:100%;
`
const GamePrizes: FunctionComponent<Props> = ({gameId}) => {
	const refGift = useRef(null);
	const [open, setOpen] = useState(false)
	const [giftImg, setGiftImg] = useState('/images/gift.png')
	const onClickPrizes = () => {
		setOpen(true)
	}
	return (
		<Wrapper>
			<Tittle>Game Prizes</Tittle>
			<PopupPrizes isOpen={open} setOpen={setOpen} />
			<GiftImg onClick={onClickPrizes} ref={refGift}>
				<img src={giftImg}></img>
			</GiftImg>
			<div style={{ textAlign: 'center', marginTop: '2.8rem', fontFamily: 'Kanit, sans-serif', fontSize: '2rem' }}>
				คุณมีสิทธิ์เล่น  1  ครั้ง
			</div>
		</Wrapper>
	)
}

export default GamePrizes