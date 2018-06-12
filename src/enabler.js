import { DepGraph } from 'dependency-graph'

export default function(store) {

  const dag = new DepGraph()

  buildDag()

  store.dependsOn = function(antecedent) {

  }

  function getKeys (value) {
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

  function getAntecedents(module, dependent) {
    let antecedents = {}
    if(arguments.length == 2) {
      antecedents = store.state.dependencies.config[module][dependent]
    }
    else if(arguments.length == 1) {
      let dependent = arguments[0]
      antecedents = store.state.dependencies.config[dependent]
    }
    else {
      return [];
    }
    if (typeof antecedents !== 'undefined') {
      return getKeys(antecedents)
    }
  }

  function getAntecedentConfig(module, dependent, antecedent) {
    let config = store.state.dependencies.config
    let args   = arguments
    if(arguments.length == 3) { // 3 args
      return config[module][dependent][antecedent]
    }
    else if(arguments.length == 2) { // 2 args
      let d = args[0], a = args[1]
      return config[d][a]
    }
    else {
      return {}
    }
  }


  //TODO interogate dependents and antecedents for type (action or getter)
  //TODO subscribeActions where needed
  //TODO dependsOn implementation
  function buildDag() {
    let config  = store.state.dependencies.config
    if(!!config.modules) {
      let modules = getKeys(config)
      modules.forEach(m => {
        if(m !== 'modules') {
          let dependents = getKeys(config[m])
          dependents.forEach(d => {
            let name = m+'/'+d
            dag.addNode(name)
            let antecedents = getAntecedents(m,d)
            antecedents.forEach(a => {
              let data = getAntecedentConfig(m,d,a)
              dag.addNode(a,data)
              dag.addDependency(name,a)
            })
          })
        }
      })
    }
    else {
      let dependents = getKeys(config)
      dependents.forEach(d => {
        if(d != 'modules') {
          let name = d
          dag.addNode(name)
          let antecedents = getAntecedents(d)
          antecedents.forEach(a => {
            let data = getAntecedentConfig(d,a)
            dag.addNode(a,data)
            dag.addDependency(name,a)
          })
        }
      })
    }
    store._dag = dag;
    console.log(dag.overallOrder())
  }

}
