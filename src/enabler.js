import { DepGraph } from 'dependency-graph'
import { getKeys, getType } from './util.js'
import { getDagProcessor } from './processor.js'


export default function(store) {

  const PathifyArtiface = require('vuex-pathify')
  const dag             = new DepGraph()
  const actions         = store._actions
  const getters         = store.getters
  const dependencies    = store._modules.root._rawModule.dependencies || store.state.dependencies
  const config          = dependencies.config
  const useModules      = config.hasOwnProperty('modules') && !!config.modules
  delete config.modules

  // meaty bit
  buildDag()
  makeMutations()
  subscribe()
  // end

  // TODO implement dependsOn
  // intended to enable dependencies to be added directly to actions
  store.dependsOn = function(antecedent) {

  }

  // builds the internal dag based on the 'dependencies' configuration
  //TODO dependsOn implementation
  function buildDag() {
    let modules, dependents, antecedents
    if(useModules) {
      modules = getKeys(config)
      modules.forEach(m => {
        dependents = getKeys(config[m])
        dependents.forEach(d => {
          let node = m+'/'+d
          dag.addNode(node,{type:getType(actions, node)})
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
        dag.addNode(d,{type:getType(actions, d)})
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
  function subscribe() {
    store.subscribeAction(getDagProcessor(store,actions))
    store.subscribeGetter(getDagProcessor(store,actions))
    Object.keys(store._wrappedGetters).forEach(f => {
      let fn = store._wrappedGetters[f]
      store._wrappedGetters[f] = function(store) {
        store._getterSubscribers.forEach(sub => sub(f, store.state))
        return fn(store)
      }
    })
  }

  function makeMutations() {

  }

  // gets the list of antecedents from the 'dependecies' config
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

  // adds the antecedent as defined in the 'dependencies' configuration into the dag
  function addAntecedent(module, dependent, antecedent) {
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
      data['type'] = getType(actions, a)
    dag.addNode(a,data)
    dag.addDependency(d,a)
  }
}
