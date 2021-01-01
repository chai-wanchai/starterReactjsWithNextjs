import { FunctionComponent, useEffect, useRef, useState } from "react";
import { Grid } from "semantic-ui-react";
import styled from "styled-components";
import { deviceBreakPoint } from "../../../utils/css";

interface Props {
	status: 'win' | 'lost'
	promotionCode: string
	description?: string
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
	margin-left: 5rem;
	width: 50%;
}
`
const PromotionCode = styled('div')`
margin: 1rem auto;
padding: 15px;
border: 3px dotted;
width: fit-content;
height: fit-content;
font-size: 20px;
font-weight: 600;
background-color:whitesmoke;

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
					<Description>{description || 'รับส่วนลด 15% สูงสุด ฿120.00 เมื่อช้อปครบ ฿699.00 หมดเขต 01-01-2021 สำหรับคำสั่งซื้อที่ชำระเงินผ่าน Shopee, จำกัดการใช้โค้ด 1 คน/ครั้ง/เครื่อง และซื้อผ่านแอปเท่านั้น'}</Description>
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