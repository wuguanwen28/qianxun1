//导入state
import { state } from './state'
import { mutations } from './mutations'

export const homeModule = {
  namespaced: true,
  state,
  mutations
}