import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { green } from "@material-ui/core/colors";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import { useStateValue } from "./StateProvider";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import { FaPaw } from "react-icons/fa";
import { IconContext } from "react-icons";
import { db } from "./firebase";
import firebase from "firebase";

import { IoPawOutline } from "react-icons/io5";

export default function PawButton({ key, id, type }) {
  const [{ user }, dispatch] = useStateValue();
  const [checked, setChecked] = React.useState(false);

  const handleChange = (event) => {
    setChecked(event.target.checked);
  };

  const like = () => {
    if (!checked) {
      db.collection(type).doc(id).collection("likes").add({
        like: "true",
        username: user?.displayName,
      });
    }
  };

  return (
    <FormControlLabel
      control={
        <Checkbox
          onChange={handleChange}
          onClick={like}
          icon={
            <IconContext.Provider value={{ size: "35px" }}>
              <IoPawOutline />
            </IconContext.Provider>
          }
          checkedIcon={
            <IconContext.Provider value={{ size: "35px" }}>
              <FaPaw />
            </IconContext.Provider>
          }
          name="checkedH"
        />
      }
    />
  );
}
