import { isValid, getType, getDependents, getRawAntecedents, setRawAntecedents, setProcessedAntecedents, getProcessedAntecedents  } from './util.js'

export function antecedentHandler (store, prevNode) {
  let rawAnts = getRawAntecedents(store)
  let nextNode = rawAnts.shift()
  setRawAntecedents(store,rawAnts)
  setProcessedAntecedents(store, [...getProcessedAntecedents(store),nextNode])
  if(getType(store,nextNode) === 'action') {

    // we only want to process the next action if the things that depend on it
    // aren't set. So we need to get the incoming edges (dependents) and check
    // for validity
    let depAnts = getDependents(store,nextNode)
    if(depAnts.every(a => isValid(store,a))) { return }

    let action = store._actions[nextNode]
    if(Array.isArray(action))
      action = action[0]
    return action

    //TODO enable configuration of action antecedent getters to be passed as payload to action
  }
  // else getter
  return

  /*
   * nothing to do here...yet
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
   *       "viz/ActionA": ["viz/GetterD",'viz/ActionB'],
   *       "viz/GetterD": "viz/ActionC"
   *     },
   *     active: { ... }
   *   }
   * }
   */
}
