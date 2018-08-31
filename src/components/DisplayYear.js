import React from "react";
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import withStyles from "@material-ui/core/styles/withStyles";

const styles = theme => ({
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: "center",
    color: theme.palette.text.secondary
  }
});

function DisplayYear(props) {
  const { classes, total, current } = props;
  const active = total.indexOf(current);

  return (
    <Paper className={classes.paper}>
      <Tabs
        value={active}
        indicatorColor="primary"
        textColor="primary"
        centered
      >
        {total.map(year => {
          return <Tab label={year} />;
        })}
      </Tabs>
    </Paper>
  );
}

export default withStyles(styles)(DisplayYear);
