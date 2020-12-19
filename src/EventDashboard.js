import React, { useState, useEffect, Component } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Container, Grid } from "@material-ui/core";
import { useStateValue } from "./StateProvider";
import Post from "./Post";
import Event from "./Event";
import AddEvent from "./AddEvent";
import db from "./firebase";
import { NavigateBeforeRounded, NavigateNextRounded } from "@material-ui/icons";

const useStyles = makeStyles({
  EventDashboard: {
    maxWidth: 1500,
    margin: "auto",
  },
  addEvent: {
    position: "-webkit- sticky" /* Safari */,
    position: "sticky",
    top: 70,
  },
});

function EventDashboard() {
  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
  };

  const classes = useStyles();
  /* ----user---- */
  const [{ user }, dispatch] = useStateValue();
  /* ---user ----- */

  /* setting up posts */

  const [events, setEvents] = useState([]);

  useEffect(() => {
    db.collection("events")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        setEvents(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            event: doc.data(),
          }))
        );
      });
  }, []);
  /* end posts section */

  return (
    <Grid container direction="row" justify="flex-start" maxWidth="xl">
      <Grid xs={3} className={classes.addEvent}>
        <AddEvent />
      </Grid>
      <Grid xs={9}>
        <Container className={classes.EventDashboard}>
          <Slider {...settings}>
            {/* setting up posts... looping through posts */}

            {events.map(({ id, event }) => (
              <Event
                key={id}
                eventName={event.eventName}
                eventId={id}
                eventDate={new Date(event.date?.toDate()).toUTCString()}
                user={user}
                creatorId={event.creatorId}
                profileURL={event.profileURL}
                username={event.username}
                description={event.description}
                imageUrl={event.imageUrl}
                location={event.location}
                time={new Date(event.timestamp?.toDate()).toUTCString()}
              />
            ))}
            {/* end setup of posts */}
          </Slider>
        </Container>
      </Grid>
    </Grid>
  );
}

export default EventDashboard;
