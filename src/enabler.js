import { DepGraph } from 'dependency-graph'

export default function(store) {

  const dag          = new DepGraph()
  const actions      = store._actions
  const getters      = store.getters
  const dependencies = store._modules.root._rawModule.dependencies || store.state.dependencies
  const config       = dependencies.config
  const useModules   = config.hasOwnProperty('modules') && !!config.modules
  delete config.modules
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
    let args = arguments, antecedents = {}, m, d
    if(useModules) {
      m = args[0], d = args[1]
      antecedents = config[m][d]
    }
    else {
      d = args[0]
      antecedents = config[d]
    }
    if (typeof antecedents !== 'undefined') {
      return getKeys(antecedents)
    }
    else {
      return []
    }
  }

  function getAntecedentConfig(module, dependent, antecedent) {
    let args = arguments, m, d, a
    if(useModules) { // 3 args
      m = args[0], d = args[1], a = args[2]
      return config[m][d][a]
    }
    else { // 2 args
      d = args[0], a = args[1]
      return config[d][a]
    }
  }

  function addAntecedent(module, dependent, antecedent) {
    let args = arguments, data = {}, m, d, a
    if(useModules) { // 3 args
      m = args[0], d = args[1], a = args[2]
      data = config[m][d][a] || a
    }
    else { // 2 args
      d = args[0], a = args[1]
      data = config[d][a] || a
    }
    dag.addNode(a,data)
    dag.addDependency(d,a)
  }


  //TODO interogate dependents and antecedents for type (action or getter)
  //TODO subscribeActions where needed
  //TODO dependsOn implementation
  function buildDag() {
    let modules, dependents, antecedents
    if(useModules) {
      modules = getKeys(config)
      modules.forEach(m => {
        dependents = getKeys(config[m])
        dependents.forEach(d => {
          let node = m+'/'+d
          dag.addNode(node)
          antecedents = getAntecedents(m,d)
          antecedents.forEach(a => {
            addAntecedent(m,d,a)
          })
        })
      })
    }
    else {
      dependents = getKeys(config)
      dependents.forEach(d => {
        dag.addNode(d)
        antecedents = getAntecedents(d)
        antecedents.forEach(a => {
          addAntecedent(d,a)
        })
      })
    }
    store._dag = dag;
    console.log(dag.overallOrder())
  }

}
