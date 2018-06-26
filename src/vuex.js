export default function (store) {

  // Vuex mods
  // 'genericSubscribe' definition lifted from vuex/src/store.js
  // because it not exported and required to create _getterSubscribers
  // store.genericSubscribe = function (fn, subs) {
  //   if (subs.indexOf(fn) < 0) {
  //     subs.push(fn)
  //   }
  //   return () => {
  //     const i = subs.indexOf(fn)
  //     if (i > -1) {
  //       subs.splice(i, 1)
  //     }
  //   }
  // }
  // store._getterSubscribers = []
  // store.subscribeGetter = function(fn) {
  //   return store.genericSubscribe(fn, store._getterSubscribers)
  // }

  store.isObject = function (obj) {
    return obj !== null && typeof obj === 'object'
  }

  store.assert = function (condition, msg) {
    if (!condition) throw new Error(`[vuex] ${msg}`)
  }

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

  store.dispatch =  function (_type, _payload) {
    // check object-style dispatch
    const {
      type,
      payload
    } = store.unifyObjectStyle(_type, _payload)

    console.log('Executing dispatch override for ['+type+']')

    const action = { type, payload }
    const entry = this._actions[type]
    if (!entry) {
      if (process.env.NODE_ENV !== 'production') {
        console.error(`[vuex] unknown action type: ${type}`)
      }
      return
    }

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
}
