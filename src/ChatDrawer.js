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
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import SidebarChat from "./SidebarChat";
import ChatArea from "./ChatArea";
import db, { auth } from "./firebase";
import { Avatar, Button, CardContent, Grid, Icon } from "@material-ui/core";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";

import Post from "./Post";
import ImageUpload from "./ImageUpload";
import NGO_Profile from "./NGO_Profile";
import { useStateValue } from "./StateProvider";
import Dashboard from "./Dashboard";
import ProfileDashboard from "./ProfileDashboard";
import PropTypes from "prop-types";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import {
  AccountCircle,
  EventRounded,
  ExitToApp,
  ForumRounded,
  HomeRounded,
  StoreRounded,
} from "@material-ui/icons";
import { withStyles } from "@material-ui/core/styles";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import SignUp from "./SignUp";
import EventDashboard from "./EventDashboard";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import StoreDashboard from "./StoreDashboard";

const drawerWidth = 800;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    height: "100%",
  },
  appBar: {
    /* [theme.breakpoints.up('sm')]: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
      }, */
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    zIndex: theme.zIndex.drawer + 1,
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: drawerWidth,
  },
  title: {
    textAlign: "center",
    marginTop: 20,
  },
  hide: {
    display: "none",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: "flex-start",
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginRight: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: 0,
  },
  chat__section: {
    height: "100%",
    display: "flex",
    padding: 5,
  },
  chatButton: {
    marginTop: 20,
  },
  profile: {
    display: "flex",
  },
}));

/* -----------------code for tabs--------------- */

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`nav-tabpanel-${index}`}
      aria-labelledby={`nav-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `nav-tab-${index}`,
    "aria-controls": `nav-tabpanel-${index}`,
  };
}

function LinkTab(props) {
  return (
    <Tab
      component="a"
      onClick={(event) => {
        event.preventDefault();
      }}
      {...props}
    />
  );
}

/* ----------------end code for tabs ------------------- */

export default function ChatDrawer() {
  const [{ user }, dispatch] = useStateValue();

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  /* for alert box -logout */

  const [dialogueOpen, setDialogueOpen] = React.useState(false);
  const handleClickOpen = () => {
    setDialogueOpen(true);
  };

  const handleClose = () => {
    setDialogueOpen(false);
  };
  /* for logout alert */
  /* logout function */

  /* logout function */

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          <Grid container spacing={3}>
            <Grid item xs={3}>
              <Typography variant="h5" noWrap className={classes.title}>
                The Purrfect Place
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Tabs
                variant="fullWidth"
                centered
                value={value}
                onChange={handleChange}
                aria-label="nav tabs example"
              >
                <LinkTab
                  icon={<HomeRounded />}
                  label="Home"
                  href="/drafts"
                  {...a11yProps(0)}
                />
                <LinkTab
                  icon={<StoreRounded />}
                  label="Store"
                  href="/trash"
                  {...a11yProps(1)}
                />
                <LinkTab
                  icon={<EventRounded />}
                  label="Events"
                  href="/spam"
                  {...a11yProps(2)}
                />
                <LinkTab
                  icon={<AccountCircle />}
                  label="Profile"
                  href="/spam"
                  {...a11yProps(3)}
                />
              </Tabs>
            </Grid>
            <Grid justify="flex-end" className={classes.profile} item xs={2}>
              <IconButton
                onClick={handleClickOpen}
                aria-controls="customized-menu"
                aria-haspopup="true"
              >
                <Avatar src={user?.photoURL} />
              </IconButton>
              <div>
                <Dialog
                  open={dialogueOpen}
                  onClose={handleClose}
                  aria-labelledby="alert-dialog-title"
                >
                  <DialogTitle id="alert-dialog-title">
                    {"Do you want to logout :( ?"}
                  </DialogTitle>
                  <DialogActions>
                    <Button color="primary">Logout</Button>
                    <Button onClick={handleClose} color="primary" autoFocus>
                      Stay
                    </Button>
                  </DialogActions>
                </Dialog>
              </div>

              <Typography
                style={{
                  marginTop: "auto",
                  marginBottom: "auto",
                  fontSize: "1.2em",
                }}
              >
                {user?.displayName}
              </Typography>
            </Grid>
            <Grid item xs={1}>
              <Button
                color="inherit"
                endIcon={<ForumRounded />}
                size="large"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                style={{ marginTop: 17 }}
                className={clsx(open && classes.hide)}
              >
                Chats
              </Button>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: open,
        })}
      >
        <div className={classes.drawerHeader} />
        <div>
          <TabPanel value={value} index={0}>
            <Dashboard />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <StoreDashboard />
          </TabPanel>
          <TabPanel value={value} index={2}>
            <EventDashboard />
          </TabPanel>
          <TabPanel value={value} index={3}>
            <ProfileDashboard />
          </TabPanel>
        </div>
      </main>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="right"
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
          <h4>Chats</h4>
        </div>
        <Divider />

        {/*................. contents inside the drawer........... */}
        <CardContent className={classes.chat__section}>
          <Divider />

          {!user ? (
            <h1 style={{ textAlign: "center" }}> Login </h1>
          ) : (
            <Router>
              <SidebarChat />
              <Switch>
                <Route path="/friends/:friendId">
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
      </Drawer>
    </div>
  );
}
