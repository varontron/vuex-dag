import { DepGraph } from 'dependency-graph'
import { getKeys, getType } from './util.js'
import { getDagProcessor } from './processor.js'

export default function(store) {
  const dependencies    = store._modules.root._rawModule.dependencies || store.state.dependencies
  if(!!!dependencies)
    return

  const dag             = new DepGraph()
  const actions         = store._actions
  const getters         = store.getters

  const config          = dependencies.config
  const useModules      = config.hasOwnProperty('modules') && !!config.modules
  delete config.modules

  // meaty bit
  buildDag()
  subscribe()
  // end

  // builds the internal dag based on the 'dependencies' configuration
  // internally m, d, & a will hold, if present, module, dependent, & antecedent
  function buildDag () {
    let modules, dependents, antecedents
    if(useModules) {
      modules = getKeys(config)
      modules.forEach(m => {
        dependents = getKeys(config[m])
        dependents.forEach(d => {
          let node = m+'/'+d
          let type = !!actions[node] ? 'action' : 'getter'
          dag.addNode(node,{ type })
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
        let type = !!actions[d] ? 'action' : 'getter'
        dag.addNode(d,{ type })
        antecedents = getAntecedents(d)
        antecedents.forEach(a => {
          addAntecedent(d,a)
        })
      })
    }
    store._dag = dag;
    console.log(['overallOrder:',dag.overallOrder()])
  }

  // registers action and getter handler functions for all nodes in the dag
  function subscribe () {
    store.subscribeAction(getDagProcessor(store)) // registers actual handler
  }



  // gets the list of antecedents from the 'dependecies' config
  // internally m and d will hold module if present, and dependent
  function getAntecedents (module, dependent) {
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
      if(typeof antecedents === 'object' || Array.isArray(antecedents))
        return getKeys(antecedents)
      else if (typeof antecedents ===  'string') {
        return [antecedents]
      }
    }
    else {
      return []
    }
  }

  // gets the configuration object associated to the antecedent
  // internally m, d, and a will hold module if present, dependent, and antecedent
  function getAntecedntConfig (module, dependent, antecedent) {
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

  // adds the antecedent as defined in the 'dependencies' configuration into the dag
  // internally m, d, and a will hold module if present, dependent, and antecedent
  function addAntecedent (module, dependent, antecedent) {
    let args = arguments, data = {}, m, d, a
    if(useModules) { // 3 args
      m = args[0], d = args[1], a = args[2]
      data = config[m][d][a] || {}
    }
    else { // 2 args
      d = args[0], a = args[1]
      data = config[d][a] || {}
    }
    if(!data.hasOwnProperty('type'))
      data['type'] = getType(store, a)
    dag.addNode(a,data)
    dag.addDependency(d,a)
  }

}
