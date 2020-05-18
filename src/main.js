import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

//rem适配
import 'lib-flexible'

import axios from 'axios'
import VueAxios from 'vue-axios'

//导入操作cookies模块
import VueCookies from 'vue-cookies'

import VueJsonp from 'vue-jsonp'

//导入Vant组件
import {
	Button,
	Form,
	Field,
	Toast,
	Tabbar,
	TabbarItem,
	Swipe,
	SwipeItem,
	Image,
	Divider,
	Cell,
	CellGroup,
	Lazyload,
	Checkbox,
	Stepper,
	SwipeCell,
	SubmitBar,
	CouponCell,
	CouponList,
	Popup,
	Tab,
	Tabs,
	NavBar,
	GoodsAction,
	GoodsActionIcon,
	GoodsActionButton,
	Dialog,
	List,
	Icon,
	AddressList,
	AddressEdit,
	Card,
	ImagePreview,
	ActionSheet,
	Uploader,
	Empty
} from 'vant';

//注册Vant组件
Vue
	.use(Button)
	.use(Form)
	.use(Field)
	.use(Tabbar)
	.use(TabbarItem)
	.use(Swipe)
	.use(SwipeItem)
	.use(Image)
	.use(Divider)
	.use(Cell)
	.use(CellGroup)
	.use(Lazyload)
	.use(Checkbox)
	.use(Stepper)
	.use(SwipeCell)
	.use(SubmitBar)
	.use(Toast)
	.use(CouponCell)
	.use(CouponList)
	.use(Popup)
	.use(Tab)
	.use(Tabs)
	.use(NavBar)
	.use(GoodsAction)
	.use(GoodsActionIcon)
	.use(GoodsActionButton)
	.use(Dialog)
	.use(List)
	.use(Icon)
	.use(AddressList)
	.use(AddressEdit)
	.use(Card)
	.use(ImagePreview)
	.use(ActionSheet)
	.use(Uploader)
	.use(Empty)

Vue.use(VueAxios, axios)

Vue.use(VueCookies)

Vue.use(VueJsonp)

//设置基础请求路径
axios.defaults.baseURL = 'http://www.kangliuyong.com:10002'

//为vue原型添加一个属性
Vue.prototype.appkey = 'U2FsdGVkX1+DQ5SuVnCigKq/Gifc3gWYT1DDD5e/Jd8='

//为vue原型添加一个属性
//Vue.prototype.appkey = 'U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA='

//配置post请求头
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8'

Vue.config.productionTip = false

new Vue({
	router,
	store,
	render: h => h(App)
}).$mount('#app')