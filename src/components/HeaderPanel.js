import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  header: {
    display: "flex",
    fontSize: 36,
    justifyContent: "center"
  },
  appBar: {
    backgroundColor: "#a3339e"
  }
}));

export default function HeaderPanel(props) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static" className={classes.appBar}>
        <Typography className={classes.header}>
          Test
        </Typography>
      </AppBar>
    </div>
  );
}
