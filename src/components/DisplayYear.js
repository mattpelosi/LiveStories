import React from "react";
import Typography from "@material-ui/core/Typography";

function DisplayYear(props) {
  return (
    <Typography variant="headline" component="h3">
      {props.year}
    </Typography>
  );
}

export default DisplayYear;
