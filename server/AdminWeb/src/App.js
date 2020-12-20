import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import ShoppingList from './components/Login/ShoppingList'
import {Provider} from 'react-redux';
import store from './store'
import Login from './views/Login/Login'
import {
  Switch,
  Route,
  Redirect
} from "react-router-dom";

// core components
import Admin from "layouts/Admin.js";

import "assets/css/material-dashboard-react.css?v=1.9.0";

function App() {
  return (
    <Provider store={store}>
    <Switch>
            
            <Route exact path="/" component={Login}>
             </Route>
            
              <Route exact path="/add" component={ShoppingList}>
              
              </Route>
              <Route exact path="/view" component={ShoppingList}>
              
              </Route>
              <Route path="/admin" component={Admin} />
              <Redirect from="/material-dashboard-react" to="/" />
          </Switch> 

     
     </Provider>
   );
 }
 export default App;