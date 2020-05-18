export const mutations = {

	changeData(state, data) {
		state[data.key] = data.value;
	},

	removeOrderData(state, index) {
		state.orderData.splice(index, 1);
	},
	
	//置空
	emptyData(state) {
		state.orderData = [];
	},

}