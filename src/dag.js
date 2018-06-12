// plugin
import vuex from './vuex'

// options
import enable from './enabler'
// import options from './options'
// import debug from './debug'

/**
 * Store plugin which updates the store object with set() and get() methods
 *
 * @param {Object} store  The store object
 */
function plugin (store) {

  // cache store instance
  vuex.store = store

  // add dag functionality
  enable(store)
}

export default {
//  options,
//  debug,
  plugin
}
