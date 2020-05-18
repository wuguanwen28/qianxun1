import Vue from 'vue'
import Vuex from 'vuex'
import {registerModule} from './register/store.js'
import {loginModule} from './login/store.js'
import {mainModule} from './main/store.js'
import {homeModule} from './home/store.js'
import {shopcartModule} from './shopcart/store.js'
import {detailModule} from './detail/store.js'
import {myModule} from './my/store.js'
import {likeModule} from './like/store.js'
import {addressModule} from './address/store.js'
import {payModule} from './pay/store.js'
import {orderModule} from './order/store.js'
Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
  	registerModule,
  	loginModule,
  	mainModule,
  	homeModule,
  	shopcartModule,
  	detailModule,
  	myModule,
  	likeModule,
  	addressModule,
  	payModule,
  	orderModule
  }
})
