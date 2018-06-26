import { isValid, getType, getRawAntecedents, setRawAntecedents, setProcessedAntecedents, getProcessedAntecedents  } from './util.js'
import { isNull, isUndefined, isEmpty, isInvalid } from './module'

export function antecedentHandler (store, prevNode) {
  let rawAnts = getRawAntecedents(store)
  let nextNode = rawAnts.shift()
  setRawAntecedents(store,rawAnts)
  setProcessedAntecedents(store, [...getProcessedAntecedents(store),nextNode])
  console.log('Excuting antecendentHandler for ['+nextNode+']')
  console.log('  nextNode type is: '+store._dag.getNodeData(nextNode).type)
  console.log('  prevNode type is: '+store._dag.getNodeData(prevNode).type)
  if(store._dag.getNodeData(nextNode).type === 'action' && store._dag.getNodeData(prevNode).type ===  'getter')
    console.log('   THIS IS A SCENARIO IN WHICH CONDITIONAL PROCESSING SHOULD BE EMPLOYED')
  if(getType(store,nextNode) === 'action') {
    let action = store._actions[nextNode]
    if(Array.isArray(action))
      action = action[0]
    return action

    //TODO check for conditional execution rules so actions won't fire unless rules
    //     stipulate they must, e.g., antecedent getter == undefined, null, "", [], or {}
    //TODO enable configuration of action antecedent getters to be passed as payload to action
  }
  else // getter
  {
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
