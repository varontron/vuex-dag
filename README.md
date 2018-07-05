# vuex-dag
A vuex plugin which builds and enables execution of a dependency graph of getters and actions.


#### Dependency Configuration Specification
```
vuex-action       = string ;
vuex-getter       = string ;
vuex-property     = string ;
dependent         = vuex-action | vuex-getter | vuex-property ;
antecedent-name   = vuex-action | vuex-getter | vuex-property ;   
antecedent-spec   = "{", "every", ":", "true" "}" ;
antecedent-object = "{", antecedent-name, ":", antecedent-spec, "}" ;
single-antecedent = antecedent-name | antecedent-object ;
antecendent-list  = "[", single-antecedent, [ { ",", single-antecedent } ], "]" ;
antecedent        = single-antecedent | antecedent-list ;
dependency        = dependent, ":", antecedent ;  
```
#### Dependency configuration logic

![](https://github.com/varontron/vuex-dag/blob/master/vuex-dag-configuration.png)

##### without modules (i.e., using paths)
```javascript
"dependencies": {
     "config": {
       "modules": false,
       "moduleA/getterA": [{ dependency }, { dependency },... ],
       "moduleA/actionA": [],
       "moduleB/getterB": [],
       "moduleB/actionB": []
     },
     "active": { //dynamically populated
       // branch-id is an integer
        "branch-id": [...dependenciesOf(node)]
     }
}
```
##### with modules  
```javascript
"dependencies": {
     "config": {
       "modules": true,
       "moduleA": {
         "getterA": [],
         "actionA": []
       },
       "moduleB": {
         "getterB": [],
         "actionB": []
       }
     },
     "active": { //dynamically populated
       // branch-id is an integer
        "branch-id (e.g., 99999)": [...dependenciesOf(node)]
     }
}
```
