import { setRawAntecedents, getRawAntecedents, setProcessedAntecedents, getProcessedAntecedents, getAntecedentsOf, setRawAntecedentsSnapshot, getRawAntecedentsSnapshot, getType, arrayContentsAreEqual, resetAntecedents } from './util.js'
import { antecedentHandler } from './handlers.js'

// actions and getters appear in DAG in proper order and must
// me processed as such, as denoted by 'dag.dependenciesOf(node)'
// thus the action and getter handler delegation must be handled in a
// single loop
export function getDagProcessor (store)
{
  return function processDag (node, state) {

    // define type of node
    let _node, _prevNode
    if(store._dag.hasNode(node)) { // getter
      _node = node
    }
    else if(store._dag.hasNode(node.type)) { // action
      _node = node.type
    }
    else {
      return
    }

    console.log("in subscriber for ["+_node+"]")

    // loop protection
    let rawAnts  = getRawAntecedents(store)
    let procAnts = getProcessedAntecedents(store)
    let snap     = getRawAntecedentsSnapshot(store)
    if(rawAnts.length == 0 && !arrayContentsAreEqual(procAnts, snap))
    {
      setRawAntecedents(store, getAntecedentsOf(store,_node).reverse())
      setRawAntecedentsSnapshot(store, [_node])
      rawAnts = getRawAntecedents(store)
      procAnts = getProcessedAntecedents(store)
    }

    const dagFn = function(callbacks) {
      if(typeof callbacks === 'undefined') {
        return () => { new Promise((resolve,reject) => {resolve()}) }
      }
      return callbacks.reduce(
        (promiseChain,currentAction) => { return promiseChain.then(currentAction) },
        Promise.resolve([]))
    }

    const antecedentFuncs = []

    // iterate over rawDeps, but only unprocessed ones
    // and in reverse order from last antecedent
    _prevNode = _node
    while(rawAnts.length > 0)
    {
      _node = rawAnts[0]
      console.log('calling handler for [' + _node + ']')
      // if(getType(store, _node) === 'action')  //TODO test for action type?
      // {
        let antecedent =  antecedentHandler(store,_prevNode)
        if(typeof antecedent === 'undefined') {
          antecedent = () => { new Promise((resolve,reject) => {resolve()}) }
        }
        antecedentFuncs.push(antecedent)
        console.log('called handler for [' + _node + ']')
      // }
      // else
      // {
      //   console.log('skipped handler for [' + _node + ']')
      // }
      _prevNode = _node
    }

    resetAntecedents(store)

    return dagFn(antecedentFuncs)
  }
}
