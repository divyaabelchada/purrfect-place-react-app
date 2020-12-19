import "./App.css";
import ChatBody from "./ChatBody";
import ChatDrawer from "./ChatDrawer";
import ActionsList from "./ActionsList";
import MenuDrawer from "./MenuDrawer";
import { useStateValue } from "./StateProvider";
import Login from "./Login";
import Dashboard from "./Dashboard";
import SignUp from "./SignUp";
import NGO_Profile from "./NGO_Profile";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  app: {},
});

function App() {
  /* ----user---- */
  const [{ user }, dispatch] = useStateValue();
  /* ---user ----- */

  const classes = useStyles();

  return (
    <Router>
      <div className={classes.app}>
        <Switch>
          <Route path="/signup">
            <SignUp />
          </Route>
          <Route path="/chatDrawer">
            <ChatDrawer />
          </Route>
          <Route path="/">
            {!user ? (
              <Login />
            ) : (
              <div>
                <ChatDrawer />
              </div>
            )}
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
