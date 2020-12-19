import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Avatar, CardContent, Divider, Typography } from "@material-ui/core";
import db from "./firebase";
import { Link } from "react-router-dom";

const useStyles = makeStyles({
  sidebar__chat: {
    padding: 5,
    flex: 1,
    fontSize: "0.9em",
    backgroundColor: "#fafafa",
    cursor: "pointer",
    borderBottom: "1px solid #bdbdbd",
    textAlign: "left",
    marginBottom: "1px",

    "&:hover": {
      background: "#efefef",
    },
  },
  small: {
    height: 20,
    width: 20,
  },
});

function Chat({ id, name }) {
  const classes = useStyles();
  const [messages, setMessages] = useState("");

  useEffect(() => {
    if (id) {
      db.collection("users")
        .doc(id)
        .collection("messages")
        .orderBy("timestamp", "desc")
        .onSnapshot((snapshot) =>
          setMessages(snapshot.docs.map((doc) => doc.data()))
        );
    }
  }, [id]);

  return (
    <Link
      style={{ textDecoration: "none", color: "black" }}
      to={`/friends/${id}`}
    >
      <div className={classes.sidebar__chat}>
        <h4 style={{ margin: 2 }}> {name} </h4>
        <p style={{ margin: 2 }}>{messages[0]?.message}</p>
      </div>
    </Link>
  );
}
export default Chat;
