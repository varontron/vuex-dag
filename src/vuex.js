const vuex = {
  /**
   * THIS OBJECT IS REPLACED AT RUNTIME WITH THE ACTUAL VUEX STORE
   */
  store: {
    state: null,

    dispatch () {
      if (process.env.NODE_ENV !== 'production') {
        console.error('[vuex-dag] Plugin not initialized!')
      }
    },

    mapGetters () {
      if (process.env.NODE_ENV !== 'production') {
        console.error('[vuex-dag] Plugin not initialized!')
      }
    }
  }
}

export function dispatch(...args) {
  vuex.store.dispatch(...args)
}

export function mapGetters(...args) {
  vuex.store.mapGetters(...args);
}

export default vuex
