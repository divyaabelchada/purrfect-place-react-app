import "date-fns";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { useStateValue } from "./StateProvider";
import { Button, Container, TextField } from "@material-ui/core";
import { storage, db } from "./firebase";
import React, { useState } from "react";
import Grid from "@material-ui/core/Grid";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import firebase from "firebase";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from "@material-ui/pickers";

const useStyles = makeStyles({
  root: {
    margin: 20,
    maxWidth: 400,
    textAlign: "left",
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    padding: 20,
  },
  formControl: {
    margin: 5,
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: 20,
  },
});

function AddEvent() {
  const [{ user }, dispatch] = useStateValue();

  const classes = useStyles();

  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);
  const [eventName, setEventName] = useState("");
  const [location, setLocation] = useState("");

  const [type, setType] = useState("");

  const [selectedDate, setSelectedDate] = React.useState(
    new Date("2020-12-07T21:11:54")
  );

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    const uploadTask = storage.ref(`eventImages/${image.name}`).put(image);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        //progress logic.
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      (error) => {
        console.log(error);
        alert(error.message);
      },
      () => {
        //complete function
        storage
          .ref("eventImages")
          .child(image.name)
          .getDownloadURL()
          .then((url) => {
            const res = db
              .collection("events")
              .add({
                eventType: type,
                location: location,
                eventName: eventName,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                description: description,
                date: selectedDate,
                imageUrl: url,
                username: user?.displayName,
                profileUrl: user?.photoURL,
                creatorId: user?.uid,
              })
              .catch((error) => alert(error.message));
            //post image inside db
            setProgress(0);
            setDescription("");
            setType("");
            setSelectedDate(new Date("2020-12-07T21:11:54"));
            setImage(null);
          });
      }
    );
  };

  return (
    <Card className={classes.root}>
      <CardContent>
        <Typography variant="h6">Create an Event</Typography>
      </CardContent>
      <Container className={classes.form}>
        <form className={classes.form}>
          <progress
            style={{ width: "100%", height: 30 }}
            value={progress}
            max="100"
          />
          <TextField
            style={{ width: "100%" }}
            id="standard-basic"
            label="Event Name"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
          />
          <TextField
            style={{ width: "100%" }}
            id="standard-basic"
            label="Add description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <TextField
            style={{ width: "100%" }}
            id="standard-basic"
            label="Location?"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />

          <FormControl className={classes.formControl}>
            <Select
              value={type}
              onChange={(e) => setType(e.target.value)}
              displayEmpty
              className={classes.selectEmpty}
              inputProps={{ "aria-label": "Without label" }}
            >
              <MenuItem value="" disabled>
                Placeholder
              </MenuItem>
              <MenuItem value={"Volunteering event"}>
                Voluteering Event
              </MenuItem>
              <MenuItem value={"Fun event"}>Fun event</MenuItem>
              <MenuItem value={"Adoption event"}>Adoption event</MenuItem>
            </Select>
            <FormHelperText>Choose type</FormHelperText>
          </FormControl>

          <br></br>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Grid container justify="space-around">
              <KeyboardDatePicker
                style={{ width: "100%", height: 30 }}
                disableToolbar
                variant="inline"
                format="MM/dd/yyyy"
                margin="normal"
                id="date-picker-inline"
                label="Choose Event Date"
                value={selectedDate}
                onChange={handleDateChange}
                KeyboardButtonProps={{
                  "aria-label": "change date",
                }}
              />
            </Grid>
          </MuiPickersUtilsProvider>
          <br></br>
          <input
            style={{ marginTop: 20 }}
            type="file"
            onChange={handleChange}
          />
          <br></br>

          <Button
            style={{ marginTop: 20 }}
            onClick={handleUpload}
            variant="contained"
            color="primary"
            disableElevation
          >
            Upload
          </Button>
        </form>
      </Container>
    </Card>
  );
}

export default AddEvent;

{
  /* <div>
<h4> Image upload section </h4>

<progress value={progress} max="100" />
<input
  type="text"
  placeholder="Enter a caption"
  onChange={(event) => setCaption(event.target.value)}
/>
<input type="file" onChange={handleChange} />
<Button onClick={handleUpload}>Upload</Button>

{/*I want to have the following*/
}
{
  /* caption input */
}
{
  /* file picker - to pic an image */
}
{
  /* Location - later */
}
{
  /* Post button */
}
//</div> */}
