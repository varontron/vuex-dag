import { make } from 'vuex-pathify'

export const isNull = true
export const isEmpty = true
export const isUndefined = true
export const isInvalid = true

export default {
  namespaced: true,
  state: {
    config: {},
    active: {
      "antecedents":{
        "raw":[],
        "processed":[],
        "snapshot":[]
      }
    }
  }
}
