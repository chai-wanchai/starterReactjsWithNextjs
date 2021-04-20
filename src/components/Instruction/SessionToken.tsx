import React from 'react'
import { Card, Header } from 'semantic-ui-react'

export default function SessionToken() {
	return (
		<div>
			<Card className="center">
					<Header>การเชื่อมต่อ Line Zipmex Bot กับ Zipmex</Header>
				<div>
					<ol className="order-line-height">
						<li>เข้าที่หน้า <a href="https://trade.zipmex.co.th/accounts/sign-in">Login Zipmex</a> ทำบนคอมพิวเตอร์เท่านั้น</li>
						<li>เมื่อ Login สำเร็จให้กด F12 เข้าที่ Tab Application</li>
						<li>เลือกที่ Storage {'==>'} Local Storage {'==>'} https://trade.zipmex.co.th </li>
						<li>คัดลอก zmToken กับ token มาวางใส่ในหน้าเว็บเพื่อทำการเชื่อมข้อมูล</li>
					</ol>
				</div>


			</Card>
		</div>
	)
}
