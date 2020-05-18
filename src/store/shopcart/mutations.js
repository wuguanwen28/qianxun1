export const mutations = {

	manage(state) {
		state.isEdit = !state.isEdit;
	},
	
	//改数据
	changeData(state, data) {
		state[data.key] = data.value;
	},
	
	//懒加载数据
	loadShopcartData(state, data) {
		state.loadCount += 1;
		data *= state.loadCount;
		for(let i = 0; i < data; i++) {
			if(state.allShopcartData.length <= data + i) {
				break;
			}
			state.shopcartData.push(state.allShopcartData[data + i]);
		}
	},

	//全选
	allSelect(state, data) {

		state.shopcartData.forEach(v => {
			v.isChecked = !data
		})
	},

	//删除shopcartData数组的元素
	removeShopcartData(state, data) {

		for(let i = state.shopcartData.length - 1; i >= 0; i--) {
			if(data.indexOf(state.shopcartData[i].sid) > -1) {
				state.shopcartData.splice(i, 1);
			}
		}

	},
	
	//置空数据
  emptyData(state) {
    state.isFinished = false;
    state.shopcartData = [];
    state.allShocartData = [];
    state.isEdit = false;
    state.loadCount = 0;
  }
}