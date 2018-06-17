// does nothing at the moment. needs to dispatch the action
// TODO enable actionHandler to dispatch the action passed to it
// TODO figure out how to handle payloads (maybe default values?)
export function actionHandler(store, action) {
  if(Object.keys(store._dag.nodes).includes(action.type)) {
    console.log(['in dag:', action.type])
    console.log(['deps of ['+action.type+']:', store._dag.dependenciesOf(action.type)])
  }
}

// processor for getter calls (currently only works with pathify's store.get)
// checks value for 'undefined' or falsey and uses pathify's set to
// store the default value defined in the 'dependencies' configuration
export function getterHandler(store, path) {
  if(Object.keys(store._dag.nodes).includes(path)) {
    let val = store.get(path, store.state);
    if(val == 'undefined' || !!!val )
    {
      store.set(path, store._dag.getNodeData(path).default)
    }
    console.log(['in dag:', path, store.get(path), val])
    console.log(['deps of ['+path+']:', store._dag.dependenciesOf(path)])
  }
}
