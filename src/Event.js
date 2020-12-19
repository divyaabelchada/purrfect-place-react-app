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
import { CalendarTodayRounded, LinkedCameraSharp } from "@material-ui/icons";
import { doc } from "prettier";
import { Chip, Input } from "@material-ui/core";
import { Send } from "@material-ui/icons";
import FaceIcon from "@material-ui/icons/Face";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: 15,
    maxWidth: 500,
    textAlign: "left",
  },
  media: {
    height: 0,
    paddingTop: "56.25%", // 16:9
  },
  description: {
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

export default function Event({
  key,
  eventName,
  eventId,
  creatorId,
  location,
  eventDate,
  user,
  profileURL,
  imageUrl,
  username,
  description,
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
    if (eventId) {
      db.collection("events")
        .doc(eventId)
        .collection("comments")
        .orderBy("timestamp", "desc")
        .onSnapshot((snapshot) => {
          setComments(snapshot.docs.map((doc) => doc.data()));
        });
    }
  }, [eventId]);

  const postComment = (event) => {
    event.preventDefault();
    db.collection("events").doc(eventId).collection("comments").add({
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
    if (eventId) {
      db.collection("events")
        .doc(eventId)
        .collection("likes")
        .onSnapshot((snapshot) =>
          setLikes(snapshot.docs.map((doc) => doc.data()))
        );
    }
  }, [eventId]);

  const [saves, setSaves] = useState([]);

  useEffect(() => {
    if (eventId) {
      db.collection("events")
        .doc(eventId)
        .collection("saved")
        .onSnapshot((snapshot) =>
          setSaves(snapshot.docs.map((doc) => doc.data()))
        );
    }
  }, [eventId]);

  return (
    <Card className={classes.root}>
      <CardHeader
        avatar={
          // profile picture ------------- optional.
          //redirect to user profile when that page is created.
          <Avatar
            src={profileURL}
            aria-label="profile"
            className={classes.avatar}
          ></Avatar>
        }
        //username and timestamp--------------------------
        title={username}
        subheader={location}
      />
      <Chip
        color="primary"
        variant="outlined"
        style={{ marginLeft: 10, marginTop: 10, padding: 5 }}
        icon={<CalendarTodayRounded />}
        label={"Date: " + eventDate}
      />
      <Divider className={classes.divider} />
      <CardMedia
        className={classes.media}
        //image url
        image={imageUrl}
        title={username}
      />
      <Typography
        style={{
          marginTop: 5,
          paddingLeft: 15,
          color: "#ffffff",
          backgroundColor: "#3F51B5",
        }}
        variant="h5"
      >
        {eventName}
      </Typography>
      <CardContent style={{ marginBottom: "5px" }}>
        <Grid container justify="space-evenly">
          <Grid item xs={6} container direction="row">
            <PawButton key={eventId} id={eventId} type={"events"} />
            <h4 style={{ marginTop: "auto", marginBottom: "auto" }}>
              {"liked by "}
              {likes.length}
              {" users"}
            </h4>
          </Grid>
          <Grid item xs={6} container direction="row">
            <SaveButton key={eventId} id={eventId} type={"events"} />
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

            <Typography className={classes.description}>
              {username} : {description}
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
