// plugin
//import * as Vuex from 'vuex'
import enable from './enabler'

/**
 * Store plugin which updates the store object with set() and get() methods
 *
 * @param {Object} store  The store object
 */
function plugin (store) {

  // Vuex mods
  // 'genericSubscribe' definition listed from vuex/src/store.js
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
  // TODO implement mapGetters

  //Pathify mods



  // add dag functionality
  enable(store)
}

export default {
//  options,
//  debug,
  plugin
}
