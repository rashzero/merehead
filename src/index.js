import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import HeaderPanel from "./components/HeaderPanel";
import { Provider } from "react-redux";
import Users from "./containers/Users";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import store from "./store";

const App = () => {
  return (
    <div>
      <HeaderPanel />
      <Router>
        <Switch>
          <Route exact path="/">
            <Redirect to="/page/0" />
          </Route>
          <Route path="/page/:page" >
            <Users />
          </Route>
        </Switch>
      </Router>
    </div>
  );
};

ReactDOM.render(
  <Provider store={store}>{<App />}</Provider>,
  document.getElementById("container")
);
