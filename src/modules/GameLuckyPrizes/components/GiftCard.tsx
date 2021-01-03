import { FunctionComponent, useEffect, useRef, useState } from "react";
import { Grid } from "semantic-ui-react";
import styled from "styled-components";
import { deviceBreakPoint } from "../../../utils/css";

interface Props {
	status: 'win' | 'lost' | string
	promotionCode: string
	description: string
}
const Wrapper = styled('div')`
box-shadow: 0px 0px 41px -7px rgba(0, 0, 0, 0.15);
`
const Img = styled('img')`
	width: 200px;
	animation:digdig 1s infinite;
	margin: auto;
	display: block;
	@keyframes digdig {
		0%, 100% {
			transform: rotate(-5deg);
	}
	50% {
		transform: rotate(5deg);
	}
	}
	@media ${deviceBreakPoint.tablet} {
		position: relative;
		margin: auto;
		padding-top:1rem;
		width: 50%;
	}
`
const PromotionCode = styled('div')`
	margin: 1rem auto;
	padding: 15px;
	width: fit-content;
	height: fit-content;
	font-size: 20px;
	font-weight: 600;
	background-color:black;
	color: white;

`
const Description = styled('div')`
	font-family:Kanit, sans-serif;
	padding:0 5rem 1rem;
	text-align: center;
	@media ${deviceBreakPoint.tablet} {
		padding:0 1rem 1rem;
	}
`
const GiftCard: FunctionComponent<Props> = ({ promotionCode, description, status }) => {

	return (
		<Wrapper>
			{status === 'win' ?
				<>
					<Img src={"/images/winPrizes.png"}></Img>
					<PromotionCode>{promotionCode}</PromotionCode>
					<Description>{description}</Description>
				</> :
				<>
					<Img src={"/images/bad.png"}></Img>
					<Description>เสียใจด้วยคุณไม่ได้รางวัล</Description>
				</>
			}
		</Wrapper>
	)
}

export default GiftCard