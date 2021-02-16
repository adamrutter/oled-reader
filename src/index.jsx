import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom"
import App from "./components/App"
import Layout from "./components/Layout"
import React from "react"
import ReactDOM from "react-dom"

ReactDOM.render(
  <React.StrictMode>
    <Layout>
      <Router>
        <Switch>
          <Route exact path="/">
            <App />
          </Route>
          <Route path="*">
            <Redirect to="/" />
          </Route>
        </Switch>
      </Router>
    </Layout>
  </React.StrictMode>,
  document.getElementById("root")
)
