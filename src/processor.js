import { setLocalDependencies, getType } from './util.js'
import { actionHandler, getterHandler } from './handlers.js'

// actions and getters appear in DAG in proper order and must
// me processed as such, as denoted by 'dag.dependenciesOf(node)'
// thus the action and getter handler delegation must be handled in a
// single loop
export function getDagProcessor (store)
{
  return function processDag (type, state) {
    let t
    if(store._dag.hasNode(type)) { // getter
      t = type
    }
    else if(store._dag.hasNode(type.type)) { // action
      t = type.type
    }
    else {
      return
    }
    // loop protection
    let localDeps   = setLocalDependencies(store._dag.dependenciesOf(t),t)
    let handledDeps = []

    // iterate over
    while(localDeps.length > 0)
    {
      t = localDeps.shift()
      if(!handledDeps.includes(t))
      {
        if(getType(store, t) == 'action')
          actionHandler(store,t)
        else {
          getterHandler(store,t)
        }
        handledDeps.push(t)
        console.log('processed [' + t + ']')
      }
    }
  }
}
