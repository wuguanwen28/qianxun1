export const state = {

	cellData: [{
			title: '个人信息',
			name: 'PersonalData',
			icon: 'contact'
		},
		{
			title: '我的收藏',
			name: 'Like',
			icon: 'star-o'
		},
		{
			title: '地址管理',
			name: 'Address',
			icon: 'location-o'
		},
		{
			title: '帐号管理',
			name: 'Account',
			icon: 'warning-o'
		}

	],

	userInfo: {
		nickName: "",
		userImg: "",
		userBg: "",
		desc: "",
		vip: 0
	},
	
	actions:[
		{name: '查看大头像'},
		{name: '查看背景图'}
	]
		

}