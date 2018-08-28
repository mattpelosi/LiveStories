import React from "react";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import PauseIcon from "@material-ui/icons/Pause";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({
  button: {
    margin: theme.spacing.unit
  }
});

function PlayPauseButton(props) {
  return (
    <Button variant="fab" onClick={props.onClick}>
      {props.paused ? <PlayArrowIcon /> : <PauseIcon />}
    </Button>
  );
}

export default withStyles(styles)(PlayPauseButton);
