// plugin
import enable from './enabler'

function enhanceVuex (store) {
  // Vuex mods
  // 'genericSubscribe' definition listed from vuex/src/store.js
  // required to create _getterSubscribers
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
  store._getterSubscribers = []
  store.subscribeGetter = function(fn) {
    return store.genericSubscribe(fn, store._getterSubscribers)
  }
}

function plugin (store) {
  // add dag functionality
  enhanceVuex(store)
  enable(store)
}

export default {
  plugin
}
