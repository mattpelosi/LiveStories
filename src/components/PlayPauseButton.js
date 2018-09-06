import React from "react";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import PauseIcon from "@material-ui/icons/Pause";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
    color: "#3F51B5"
  }
});

function PlayPauseButton(props) {
  const { classes } = props;
  return (
    <Button
      size="large"
      className={classes.button}
      onClick={props.onClick}
      variant="outlined"
      data-test="button"
    >
      {props.paused ? <PlayArrowIcon /> : <PauseIcon />}
    </Button>
  );
}

export default withStyles(styles)(PlayPauseButton);
