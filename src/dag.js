// plugin
import enableDag from './enabler'
import enhanceVuex from './vuex'
import dependencies from './module'

function plugin (store) {
  enhanceVuex(store)
  enableDag(store)
}

export default {
  dependencies,
  plugin
}
