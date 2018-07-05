import { getKeys } from './util'

export default function (store) {

  // adding internal vuex function
  store.isObject = function (obj) {
    return obj !== null && typeof obj === 'object'
  }

  // adding internal vuex function
  store.assert = function (condition, msg) {
    if (!condition) throw new Error(`[vuex] ${msg}`)
  }

  // adding internal vuex function
  store.unifyObjectStyle = function (type, payload, options) {
    if (store.isObject(type) && type.type) {
      options = payload
      payload = type
      type = type.type
    }

    if (process.env.NODE_ENV !== 'production') {
      store.assert(typeof type === 'string', `expects string as the type, but found ${typeof type}.`)
    }

    return { type, payload, options }
  }

  // overriding 'dispatch' to enable return of promiseChain from
  // _actionSubscribers, and to execute it before the originally dispatched
  // action
  store.dispatch = function (_type, _payload) {
    // check object-style dispatch
    const {
      type,
      payload
    } = store.unifyObjectStyle(_type, _payload)

    //console.log('Executing dispatch override for ['+type+']')

    const action = { type, payload }
    const entry = this._actions[type]
    if (!entry) {
      if (process.env.NODE_ENV !== 'production') {
        console.error(`[vuex] unknown action type: ${type}`)
      }
      return
    }

    // customization begins here
    let promiseChain
    this._actionSubscribers.forEach(sub => promiseChain = sub(action, this.state))
    if(typeof promiseChain === 'undefined') {
      promiseChain = new Promise((resolve,reject) => {resolve()})
    }
    return promiseChain.then(() => {
      return entry.length > 1
        ? Promise.all(entry.map(handler => handler(payload)))
        : entry[0](payload)
    })
  }

  store.genericSubscribe = function (fn, subs) {
    if (subs.indexOf(fn) < 0) {
      subs.push(fn)
    }
    return () => {
      const i = subs.indexOf(fn)
      if (i > -1) {
        subs.splice(i, 1)
      }
    }
  }

  // TODO implement dependsOn
  // intended to enable dependencies to be added directly to actions
  store.dependsOn = function (antecedent) { }

}
