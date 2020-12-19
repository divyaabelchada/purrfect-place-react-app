import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { useStateValue } from "./StateProvider";
import { Button, Container, TextField } from "@material-ui/core";
import { storage, db } from "./firebase";
import React, { useState } from "react";
import firebase from "firebase";

const useStyles = makeStyles({
  root: {
    margin: 20,
    maxWidth: 600,
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
});

function ImageUpload() {
  const [{ user }, dispatch] = useStateValue();

  const classes = useStyles();

  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);
  const [imageSrc, setImageSrc] = useState("");

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    const uploadTask = storage.ref(`images/${image.name}`).put(image);
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
          .ref("images")
          .child(image.name)
          .getDownloadURL()
          .then((url) => {
            const res = db
              .collection("posts")
              .add({
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                caption: caption,
                imageUrl: url,
                username: user?.displayName,
                profileUrl: user?.photoURL,
              })
              .catch((error) => alert(error.message));
            //post image inside db
            setProgress(0);
            setCaption("");
            setImage(null);
          });
      }
    );
  };

  return (
    <Card className={classes.root}>
      <CardContent>
        <Typography variant="h6">Share your memories!</Typography>
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
            label="Share your experience"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />
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

export default ImageUpload;

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
