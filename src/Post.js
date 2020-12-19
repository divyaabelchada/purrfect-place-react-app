import { components } from "react";
import firebase from "firebase";
import db from "./firebase";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import Paper from "@material-ui/core/Paper";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Collapse from "@material-ui/core/Collapse";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import React, { useEffect, useState } from "react";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import PawButton from "./PawButton";
import SaveButton from "./SaveButton";
import { LinkedCameraSharp } from "@material-ui/icons";
import { doc } from "prettier";
import { Input } from "@material-ui/core";
import { Send } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: 20,
    maxWidth: 600,
    textAlign: "left",
  },
  media: {
    height: 0,
    paddingTop: "56.25%", // 16:9
  },
  caption: {
    textAlign: "left",
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  divider: {
    margin: theme.spacing(2, 0),
  },
  input: {
    width: "85%",
    border: "none",
    height: 40,
    marginLeft: 6,
    marginBottom: 10,
  },
  postComment__button: {
    border: "none",
  },
  /* expandOpen: {
    transform: 'rotate(180deg)',
  }, */
  /* avatar: {
    backgroundColor: red[500],
  }, */
}));

export default function Post({
  postId,
  user,
  profileURL,
  imageUrl,
  username,
  caption,
  time,
}) {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  {
    /*Comments section*/
  }
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");

  useEffect(() => {
    if (postId) {
      db.collection("posts")
        .doc(postId)
        .collection("comments")
        .orderBy("timestamp", "desc")
        .onSnapshot((snapshot) => {
          setComments(snapshot.docs.map((doc) => doc.data()));
        });
    }
  }, [postId]);

  const postComment = (event) => {
    event.preventDefault();
    db.collection("posts").doc(postId).collection("comments").add({
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      text: comment,
      username: user.displayName,
    });
    setComment("");
  };

  {
    /*Comments section end*/
  }

  const [likes, setLikes] = useState([]);

  useEffect(() => {
    if (postId) {
      db.collection("posts")
        .doc(postId)
        .collection("likes")
        .onSnapshot((snapshot) =>
          setLikes(snapshot.docs.map((doc) => doc.data()))
        );
    }
  }, [postId]);

  const [saves, setSaves] = useState([]);

  useEffect(() => {
    if (postId) {
      db.collection("posts")
        .doc(postId)
        .collection("saved")
        .onSnapshot((snapshot) =>
          setSaves(snapshot.docs.map((doc) => doc.data()))
        );
    }
  }, [postId]);

  return (
    <Card className={classes.root}>
      <CardHeader
        /* avatar={
          // profile picture ------------- optional.
          //redirect to user profile when that page is created.
          <Avatar
            src={profileURL}
            aria-label="profile"
            className={classes.avatar}
          ></Avatar>
        } */
        //username and timestamp--------------------------
        title={username}
        subheader={time}
      />
      <Divider className={classes.divider} />
      <CardMedia
        className={classes.media}
        //image url
        image={imageUrl}
        title={username}
      />
      <CardContent style={{ marginBottom: "5px" }}>
        <Grid container justify="flex-start">
          <Grid item xs={6} container direction="row">
            <PawButton key={postId} id={postId} type={"posts"} />
            <h4 style={{ marginTop: "auto", marginBottom: "auto" }}>
              {"liked by "}
              {likes.length}
              {" users"}
            </h4>
          </Grid>
          <Grid item xs={6} container direction="row">
            <SaveButton key={postId} id={postId} type={"posts"} />
            <h4 style={{ marginTop: "auto", marginBottom: "auto" }}>
              {"saved by "}
              {saves.length}
              {" users"}
            </h4>
          </Grid>
        </Grid>
      </CardContent>
      <Divider />
      <CardContent>
        <Grid container>
          <Grid item xs={9}>
            {/* Caption--------------------- */}

            <Typography className={classes.caption}>
              {username} : {caption}
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <IconButton
              className={clsx(classes.expand, {
                [classes.expandOpen]: expanded,
              })}
              onClick={handleExpandClick}
              aria-expanded={expanded}
              aria-label="show more"
            >
              <Typography>Comments</Typography>
              <ExpandMoreIcon />
            </IconButton>
          </Grid>
        </Grid>
      </CardContent>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <div>
            {comments.map((comment) => (
              <p>
                <b>{comment.username}</b> {comment.text}
              </p>
            ))}
          </div>
          <form>
            <Input
              className={classes.input}
              type="text"
              placeholder="Add a comment.."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <IconButton
              className={classes.postComment__button}
              disabled={!comment}
              type="submit"
              onClick={postComment}
            >
              <Send style={{ color: "#304ffe" }} />
            </IconButton>
          </form>
        </CardContent>
      </Collapse>
    </Card>
  );
}
