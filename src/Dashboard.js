import React, { useState, useEffect } from "react";
import { Box, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Post from "./Post";
import ImageUpload from "./ImageUpload";
import firebase from "firebase";
import NGO_Profile from "./NGO_Profile";
import SignUp from "./SignUp";
import Login from "./Login";
import { useStateValue } from "./StateProvider";
import ActionsList from "./ActionsList";
import db from "./firebase";
import Event from "./Event";
import Product from "./Product";
import { StickyContainer } from "react-sticky";

const useStyles = makeStyles({
  root: {
    display: "flex",
    width: "100%",
  },
  sticky: {
    position: "-webkit- sticky" /* Safari */,
    position: "sticky",
    top: 70,
    maxWidth: 450,
  },
  posts: {
    minWidth: 600,
  },
});

function Dashboard() {
  const classes = useStyles();

  /* ----user---- */
  const [{ user }, dispatch] = useStateValue();
  /* ---user ----- */

  /* setting up posts */

  const [posts, setPosts] = useState([]);

  useEffect(() => {
    db.collection("posts")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        setPosts(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            post: doc.data(),
          }))
        );
      });
  }, []);
  /* end posts section */

  return (
    <div>
      {!user ? (
        <Login />
      ) : (
        <div>
          <Grid
            container
            direction="row"
            justify="center"
            alignItems="flex-start"
            className={classes.root}
          >
            <Grid className={classes.posts}>
              {/* setting up posts... looping through posts */}

              {posts.map(({ id, post }) => (
                <Post
                  key={id}
                  postId={id}
                  user={user}
                  profileURL={post.profileURL}
                  username={post.username}
                  caption={post.caption}
                  imageUrl={post.imageUrl}
                  time={new Date(post.timestamp?.toDate()).toUTCString()}
                />
              ))}
              {/* end setup of posts */}
            </Grid>
            <Grid className={classes.sticky}>
              <ImageUpload />
            </Grid>
          </Grid>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
