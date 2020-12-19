import React, { useState } from "react";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import SidebarChat from "./SidebarChat";
import ChatArea from "./ChatArea";
import db from "./firebase";
import { CardContent, Grid } from "@material-ui/core";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import Post from "./Post";
import ImageUpload from "./ImageUpload";
import NGO_Profile from "./NGO_Profile";
import { useStateValue } from "./StateProvider";

const useStyles = makeStyles({
  chat__section: {
    height: "100%",
    display: "flex",
    padding: 5,
  },
});

function ChatBody() {
  const classes = useStyles();

  const [{ user }, dispatch] = useStateValue();

  return (
    <div>
      {/*................. contents inside the drawer........... */}
      <CardContent className={classes.chat__section}>
        <Divider />

        {!user ? (
          <h1 style={{ textAlign: "center" }}> Login </h1>
        ) : (
          <Router>
            <SidebarChat />
            <Switch>
              <Route path="/rooms/:roomId">
                <ChatArea />
              </Route>
              <Route path="/">
                <ChatArea />
              </Route>
            </Switch>
          </Router>
        )}

        {/* ---------- my code for react router dom----------  */}
      </CardContent>
    </div>
  );
}

export default ChatBody;
