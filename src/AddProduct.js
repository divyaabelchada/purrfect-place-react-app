import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { useStateValue } from "./StateProvider";
import { Button, Container, Input, TextField } from "@material-ui/core";
import { storage, db } from "./firebase";
import React, { useState } from "react";
import firebase from "firebase";
import { ImageOutlined } from "@material-ui/icons";

const useStyles = makeStyles({
  root: {
    margin: 10,
    maxWidth: 350,
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

function AddProduct() {
  const [{ user }, dispatch] = useStateValue();

  const classes = useStyles();

  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    const uploadTask = storage.ref(`productImages/${image.name}`).put(image);
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
          .ref("productImages")
          .child(image.name)
          .getDownloadURL()
          .then((url) => {
            const res = db
              .collection("products")
              .add({
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                description: description,
                price: price,
                category: category,
                imageUrl: url,
                username: user?.displayName,
                profileUrl: user?.photoURL,
                ownerId: user?.uid,
              })
              .catch((error) => alert(error.message));
            //post image inside db
            setProgress(0);
            setDescription("");
            setPrice("");
            setCategory("");
            setImage(null);
          });
      }
    );
  };

  return (
    <Card className={classes.root}>
      <CardContent>
        <Typography variant="h6">Lets start your business </Typography>
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
            label="Add description"
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <br></br>
          <TextField
            style={{ width: "100%" }}
            id="standard-basic"
            label="Enter price"
            required
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <br></br>
          <TextField
            style={{ width: "100%" }}
            id="standard-basic"
            label="Enter Category"
            required
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
          <br></br>
          <input
            type="file"
            style={{ marginTop: 20 }}
            required="true"
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

export default AddProduct;

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
