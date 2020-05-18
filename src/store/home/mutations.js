export const mutations = {

  changeData(state, data){
  	 state[data.key] = data.data;
  },
  
  changeProductsDatas(state, data){
  	state.ProductsDatas[data.type] = data.data;
  }

}
