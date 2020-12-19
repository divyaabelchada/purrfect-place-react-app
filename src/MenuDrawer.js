import React from "react";
import PropTypes from "prop-types";
import AppBar from "@material-ui/core/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import ActionsList from "./ActionsList";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { Box, Grid } from "@material-ui/core";
import Post from "./Post";
import ImageUpload from "./ImageUpload";
import NGO_Profile from "./NGO_Profile";
import SignUp from "./SignUp";
import Login from "./Login";
import { useStateValue } from "./StateProvider";

const drawerWidth = 200;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    width: "100%",
  },
  drawer: {
    [theme.breakpoints.up("sm")]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    [theme.breakpoints.up("sm")]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    width: "100%",
    padding: theme.spacing(2),
  },
  advertisement: {
    position: "relative",
    margin: 5,
    width: 250,
    height: 800,
    objectFit: "cover",
  },
  sponsoredText: {
    marginLeft: 5,
    fontSize: 15,
    position: "absolute",
    top: "160px",
  },
}));

function ResponsiveDrawer(props) {
  const { window } = props;
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div>
      <div className={classes.toolbar} />
      <Divider />
      <ActionsList />
    </div>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  /* ----user---- */
  const [{ user }, dispatch] = useStateValue();
  /* ---user ----- */

  return (
    <div className={classes.root}>
      <CssBaseline />

      <nav className={classes.drawer} aria-label="mailbox folders">
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Hidden smUp implementation="css">
          <Drawer
            container={container}
            variant="temporary"
            anchor={theme.direction === "rtl" ? "right" : "left"}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
      <main className={classes.content}>
        <div className={classes.toolbar} />

        {/* ----------Contents of the site ------------------------ */}

        {!user ? (
          <Login />
        ) : (
          <Grid className={classes.contents} container padding={0} spacing={1}>
            <Grid item xs={6}>
              <ImageUpload />
              <Post />
            </Grid>
            <Grid item xs={4}>
              <NGO_Profile />
            </Grid>
            {/* <Grid item xs={2}>
              <p className={classes.sponsoredText}> Sponsored *</p>
              <img
                className={classes.advertisement}
                src="https://images.squarespace-cdn.com/content/v1/5762a489d1758ead80c014f6/1545582197417-NF31O392ZBVG89ADYMOW/ke17ZwdGBToddI8pDm48kOUdG2mwAdTQKYFfsiJenr17gQa3H78H3Y0txjaiv_0fDoOvxcdMmMKkDsyUqMSsMWxHk725yiiHCCLfrh8O1z5QPOohDIaIeljMHgDF5CVlOqpeNLcJ80NK65_fV7S1UW0bLNJvPrEbOe3Qp8TZNs8XhmQKiESgnHGge8331qoktAUoe6UsRRprNaIS-9ZrxA/ATM_AdoptADog2018.jpg"
              />
            </Grid> */}
          </Grid>
        )}
      </main>
    </div>
  );
}

ResponsiveDrawer.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

export default ResponsiveDrawer;
