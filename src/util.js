
const localDeps = []

// returns an array of key values (lifted from vuex-pathify)
export function getKeys (value) {
  return !value                        // value is falsey
    ? []                               // empty array
    : Array.isArray(value)             // check Array
      ? value.map(key => String(key))  // convert values to Strings
      : typeof value === 'object'      // check object
        ? Object.keys(value)           // get keys
        : typeof value === 'string'    // check string
          ? value.match(/\w+/g) || []  // word chars or empty array
          : []                         // empty array
}

// determines if the intended dag entry points to an action or
export function getType (store, node) {
  if(!!store._dag && !!store._dag.getNodeData(node).type)
    return store._dag.getNodeData(node).type
  else if(!!store._actions[node])
    return 'action'
  else {
    return 'getter'
  }
}

export function setLocalDependencies (dependencies, rootNode) {
  localDeps.length = 0;
  dependencies.forEach(i => localDeps.push(i))
  localDeps.push(rootNode)
  return localDeps
}
