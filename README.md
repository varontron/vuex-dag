# vuex-dag
A vuex plugin which builds and enables execution of a dependency graph of getters and actions.

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
