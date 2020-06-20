import React, { Component } from 'react'
import { Menu } from 'semantic-ui-react'
import { IMenu } from '../../@types/menu'
interface IProps {
	menus: IMenu[]
	activeMenu: string
}
export default class MenuCustom extends Component<IProps, any> {
	state = {
		activeMenu: this.props.activeMenu
	}
	handleItemClick(e) {
		console.log(e.target.id)
		console.log(this.state)
		this.setState({ activeMenu: e.target.id })
	}
	render() {
		const { activeMenu, menus } = this.props
		return (
			<div style={{ padding: '0 10%', boxShadow: '0 1px 2px 0 rgba(34,36,38,.15)', height: '50px',position:'fixed',width:'100%' }}>
				<Menu pointing secondary color="red" style={{ height: 'inherit', border: 'none' }}>
					{menus.map(item => {
						return <Menu.Item
							name={item.menu_desc}
							id={item.menu_path}
							key={item.menu_id}
							active={this.state.activeMenu === item.menu_path}
							onClick={this.handleItemClick.bind(this)}
						/>
					})}
				</Menu>
			</div>
		)
	}
}
