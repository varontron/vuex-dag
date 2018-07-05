
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

// evaluates value of property and only returns false if value is falsey
// or if spec.every is true
export function isValid (store, node) {

  const spec = store._dag.getNodeData(node)

  if(typeof spec !== 'undefined') {
    const keys = Object.keys(spec)
    if(keys.includes('every') && !!spec.every) return false
  }

  const value  = store.get(node)
  if(typeof value === 'undefined') return false
  if(value === null) return false
  if((Array.isArray(value) || typeof value == 'string') && value.length == 0) return false
  if(Object.keys(value).length == 0) return false
  return true
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

// returns getter nodes dependent on node
export function getDependents(store, node) {
  // return immediately if node is not in dag
  if (!hasNode(store, node)) { return }
  // return filtered list of getters only (i.e., not actions)
  return getIncomingEdgeTargets(store,node)
         .filter(n => { return getType(store,n) !== 'action' })
}

// wrapper for dependency-graph api called on store
export function getAntecedentsOf (store, node) {
  return store._dag.dependenciesOf(node)
}

// wrapper for dependency-graph api called on store
export function hasNode (store, node) {
  return store._dag.hasNode(node)
}

// commits active raw antecedents to store
export function setRawAntecedents (store, antecedents) {
  store.set('dependencies/active@antecedents.raw',antecedents)
}

// getter
export function getRawAntecedents (store) {
  return store.get('dependencies/active@antecedents.raw')
}

// commits raw antecedent snapshot to store. used as a loop limit
// to determine if 'depencies/active' should be reset
export function setRawAntecedentsSnapshot (store, type) {
  let snap = [...type,  ...getRawAntecedents(store)]
  store.set('dependencies/active@antecedents.snapshot', snap)
}

// getter
export function getRawAntecedentsSnapshot (store) {
  return store.get('dependencies/active@antecedents.snapshot')
}

// commits active processed antecedents to track progress
export function setProcessedAntecedents (store, antecedents) {
  store.set('dependencies/active@antecedents.processed',antecedents)
}

// getter
export function getProcessedAntecedents (store) {
  return store.get('dependencies/active@antecedents.processed')
}

// mutates the specified
export function removeRawAntecedent (store, array) {

}

// compares contents of arrays 'a' and 'b' to ensure both contain all
// the same values and only the same values
export function arrayContentsAreEqual(a,b) {
  if(a === 'undefined' || b === 'undefined' || a.length == 0 || b.length == 0 ) return false
  if (a.length != b.length) return false
  return !!a.map(a1 => b.includes(a1)).reduce((acc,cur) => acc*cur)
}

// clears all arrays in the 'dependencies/active' module
export function resetAntecedents(store) {
  store.set('dependencies/active@antecedents.raw',[])
  store.set('dependencies/active@antecedents.processed',[])
  store.set('dependencies/active@antecedents.snapshot',[])
}

// returns all nodes which depend on node
export function getIncomingEdgeTargets (store, node) {
  return store._dag.incomingEdges[node]
}

// currently unused
export function getOutgoingEdgeTargets (store, node) {
  return store._dag.outgoingEdges[node]
}

// currently unused


export function antecedentIsQueued (store, antecedent) {
  return getRawAntecedents(store).includes(antecedent)
}

// currently unused
export function getSpec (store, node) {
  return store._dag.getNodeData(node)
}
