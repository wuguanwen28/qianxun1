export const state = {

  // 商品sids
  sids: [],
  
  orderData: [],
  
  orderDesc: {
  	count: 0,
  	total: 0
  },
  
  //是否选择地址
  isSelect: false,

  //地址数据
  list: [],

  addressData: {
    //当前地址
    address: '请选择收货地址',

    //收货人
    receiver: '',

    //手机号
    phone: ''
  }

}