import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Container, Typography } from "@material-ui/core";
import { useStateValue } from "./StateProvider";
import Post from "./Post";
import Product from "./Product";
import db from "./firebase";
import Event from "./Event";
import { NavigateBeforeRounded, NavigateNextRounded } from "@material-ui/icons";

const useStyles = makeStyles({
  Carousel: {
    maxWidth: 500,
    minWidth: 400,
    margin: "auto",
    marginBottom: 30,
  },
});

function Carousel() {
  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
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
      .where("creatorId", "==", user?.uid)
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
    <div>
      {/* <Typography style={{ textAlign: "left", margin: 0 }} variant="h5">
        Events created by you
      </Typography> */}
      <Container className={classes.Carousel}>
        <Slider {...settings}>
          {/* setting up posts... looping through posts */}

          {events.map(({ id, event }) => (
            <Event
              key={id}
              eventId={id}
              eventDate={new Date(event.date?.toDate()).toUTCString()}
              user={user}
              creatorId={event.creatorId}
              profileURL={event.profileURL}
              username={event.username}
              description={event.description}
              imageUrl={event.imageUrl}
              time={new Date(event.timestamp?.toDate()).toUTCString()}
            />
          ))}
          {/* end setup of posts */}
        </Slider>
      </Container>
    </div>
  );
}

export default Carousel;
