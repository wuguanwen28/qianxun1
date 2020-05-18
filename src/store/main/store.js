//导入state
import {state} from './state'
import {mutations} from './mutations'

export const mainModule = {
  namespaced: true,
  state,
  mutations
}