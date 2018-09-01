import React from "react";
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import withStyles from "@material-ui/core/styles/withStyles";
import LinearProgress from "@material-ui/core/LinearProgress";

const styles = theme => ({
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: "center",
    color: theme.palette.text.secondary
  },
  linear: {
    margin: "0 14% 0 14%",
    [theme.breakpoints.up("md")]: {
      margin: "0"
    }
  }
});

function DisplayYear(props) {
  const { classes, total, current } = props;
  const active = total.indexOf(current);
  return (
    <Paper className={classes.paper}>
      <LinearProgress
        className={classes.linear}
        variant="determinate"
        color="primary"
        value={100 * ((total.indexOf(current) + 1) / total.length)}
      />
      <Tabs
        value={active}
        indicatorColor="primary"
        textColor="primary"
        centered
        onChange={props.goToYear}
      >
        {total.map(year => {
          return <Tab label={year} key={year} />;
        })}
      </Tabs>
    </Paper>
  );
}

export default withStyles(styles)(DisplayYear);
