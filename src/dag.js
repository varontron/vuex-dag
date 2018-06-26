// plugin
import enableDag from './enabler'
import enhanceVuex from './vuex'

function plugin (store) {
  enhanceVuex(store)
  enableDag(store)
}

export default {
  plugin
}
