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

    //console.log("in subscriber for ["+_node+"]")

    // loop protection
    let rawAnts  = getRawAntecedents(store)
    let procAnts = getProcessedAntecedents(store)
    let snap     = getRawAntecedentsSnapshot(store)
    if(rawAnts.length == 0 && !arrayContentsAreEqual(procAnts, snap))
    {
      setRawAntecedents(store, getAntecedentsOf(store,_node).reverse())
      setProcessedAntecedents(store, [_node])
      setRawAntecedentsSnapshot(store, [_node])
      rawAnts = getRawAntecedents(store)
      procAnts = getProcessedAntecedents(store)
    }

    // dagFn will take an array of promises and uses 'reduce' to chain them
    // together
    const dagFn = function(callbacks) {
      if(typeof callbacks === 'undefined') {
        return () => { new Promise((resolve,reject) => {resolve()}) }
      }
      return callbacks.reduce(
        (promiseChain,currentAction) => { return promiseChain.then(currentAction) },
        Promise.resolve([]))
    }

    const antecedentFuncs = []

    // iterate over rawAnts, but only unprocessed ones
    // and in reverse order from last antecedent

    // store the previous node
    _prevNode = _node
    while(rawAnts.length > 0)
    {
      _node = rawAnts[0]
      //console.log('calling handler for [' + _node + ']')

      let antecedent =  antecedentHandler(store,_prevNode)
      if(typeof antecedent === 'undefined') {
        antecedent = () => { new Promise((resolve,reject) => {resolve()}) }
      }
      antecedentFuncs.push(antecedent)
      //console.log('called handler for [' + _node + ']')

      // reset the previous node to the most recently processed
      _prevNode = _node
    }

    // clean the store
    resetAntecedents(store)

    // return the promise chain
    return dagFn(antecedentFuncs)
  }
}
