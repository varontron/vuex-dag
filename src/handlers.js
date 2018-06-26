import { getType, getRawAntecedents, setRawAntecedents, setProcessedAntecedents, getProcessedAntecedents  } from './util.js'

export function antecedentHandler (store, prevNode) {
  let rawAnts = getRawAntecedents(store)
  let nextNode = rawAnts.shift()
  setRawAntecedents(store,rawAnts)
  setProcessedAntecedents(store, [...getProcessedAntecedents(store),nextNode])
  console.log('Excuting antecendentHandler for ['+nextNode+']')

  if(getType(store,nextNode) === 'action') {
    let action = store._actions[nextNode]
    if(Array.isArray(action))
      action = action[0]
    return action
    //TODO check for conditional execution rules so actions won't fire unless rules
    //     stipulate they must, e.g., antecedent getter == undefined, null, "", [], or {}
    //TODO enable configuration of action antecedent getters to be passed as payload to action
    //store.set('dependencies/active@entry', [this._actions[type],...store.get('dependencies/active@entry')])
    //store.set(nextNode+'!') // maybe this should be in a try/catch instead of an if
  }
  else // getter
  {
    console.log(store.get(nextNode)) // log getter value
    return

    /*
     * nothing to do here
     *
     * see README in https://github.com/varontron/vuex-dag or diagram at
     * https://github.com/varontron/vuex-dag/blob/master/vuex-dag-configuration.png
     * A getter that has no antecedent is a leaf node and the "null-value" logic
     * should be encapsulated in a getter function, e.g.,
     *
     * getters: {
     *  getLeafNodeProperty: function (state) {
     *    return state.leafNodeProperty || "default value"
     *  }
     * }
     *
     * If something more elaborate is required to return a default value, i.e.,
     * a "dynamic" default value, then an antecedent action should be
     * configured in the dag, e.g., viz/GetterD below
     *
     * const dependencies = {
     *   namespaced: true,
     *   state: {
     *     config: {
     *       modules: false,
     *       "viz/ActionA": {"viz/GetterD":"",'viz/ActionB':""},
     *       "viz/GetterD": "viz/ActionC",
     *     },
     *     active: {
     *       "antecedents":{
     *         "raw":[],
     *         "processed":[],
     *         "snapshot":[]
     *       }
     *     }
     *   }
     * }
     */
  }
}
