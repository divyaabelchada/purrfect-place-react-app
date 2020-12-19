import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Avatar, IconButton, Input } from "@material-ui/core";
import { BorderTop, Send } from "@material-ui/icons";
import { useParams } from "react-router-dom";
import db from "./firebase";
import clsx from "clsx";
import firebase from "firebase";
import { useStateValue } from "./StateProvider";

const useStyles = makeStyles({
  ChatArea: {
    flex: 0.65,
    display: "flex",
    flexDirection: "column",
    borderTop: "1px solid #f6f6f6",
  },
  header: {
    display: "flex",
    backgroundColor: "#ffffff",
  },
  profile: {
    margin: 10,
  },
  chat__info: {
    marginTop: 7,
    textAlign: "left",
  },
  chat__section: {
    flex: 1,
    padding: 5,
    overflowY: "scroll",
    backgroundColor: "#e8eaf6",
  },
  chat__receiver: {
    marginLeft: "auto",
    backgroundColor: "#ffebee",
  },
  chat__message: {
    maxWidth: 300,
    wordWrap: "break-word",
    backgroundColor: "#ffffff",
    borderRadius: 15,
    position: "relative",
    fontSize: 15,
    padding: 8,
    width: "fit-content",
    textAlign: "left",
    marginBottom: 10,
  },
  chat__name: {
    position: "absolute",
    top: "-13px",
    fontSize: "x-small",
    fontWeight: 600,
  },
  timestamp: {
    marginLeft: 10,
    fontSize: "x-small",
    color: "#757575",
  },
  input__section: {
    padding: 10,
    display: "flex",
    backgroundColor: "#fafafa",
  },
  input: {
    width: "100%",
    border: "none",
    height: 40,
    marginLeft: 6,
    marginBottom: 10,
  },
  submit__button: {
    border: "none",
  },
});

function ChatArea() {
  const classes = useStyles();
  const [{ user }, dispatch] = useStateValue();

  const [input, setInput] = useState("");
  const { friendId } = useParams();
  const [friendName, setFriendName] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (friendId) {
      db.collection("users")
        .doc(friendId)
        .onSnapshot((snapshot) => setFriendName(snapshot.data().name));

      db.collection("users")
        .doc(friendId)
        .collection("messages")
        .orderBy("timestamp", "asc")
        .onSnapshot((snapshot) =>
          setMessages(snapshot.docs.map((doc) => doc.data()))
        );
    }
  }, [friendId]);

  const sendMessage = (e) => {
    e.preventDefault();
    console.log("you types >> ", input);

    db.collection("users").doc(friendId).collection("messages").add({
      message: input,
      name: user.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });

    setInput("");
  };

  return (
    <div className={classes.ChatArea}>
      <div className={classes.header}>
        <Avatar className={classes.profile} src="" />
        <div className={classes.chat__info}>
          <h4 style={{ margin: 2 }}>{friendName}</h4>
          <p style={{ margin: 2 }}>
            {"Last seen"} {""}
            {new Date(
              messages[messages.length - 1]?.timestamp?.toDate()
            ).toUTCString()}{" "}
          </p>
        </div>
      </div>
      <div className={classes.chat__section}>
        {/* ----------------------------chat section-------------------------- */}

        {messages.map((message) => (
          <p
            className={clsx(classes.chat__message, {
              [classes.chat__receiver]: message.name == user.displayName,
            })}
          >
            <span className={classes.chat__name}> {message.name} </span>
            {message.message}
            <span className={classes.timestamp}>
              <br></br> {new Date(message.timestamp?.toDate()).toUTCString()}{" "}
            </span>
          </p>
        ))}
      </div>

      {/* ----------------------------chat section-------------------------- */}

      <div className={classes.input__section}>
        <Input
          className={classes.input}
          placeholder="Send Message"
          inputProps={{ "aria-label": "send message field" }}
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <IconButton
          disabled={!input}
          type="submit"
          onClick={sendMessage}
          className={classes.submit__button}
        >
          <Send style={{ color: "#304ffe" }} />
        </IconButton>
      </div>
    </div>
  );
}

export default ChatArea;
