import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import DeleteIcon from '@material-ui/icons/Delete';
import NewUserForm from './NewUserForm';

const useStyles = makeStyles(theme => ({
  root: {
    minWidth: 200
  },
  userName: {
    fontSize: 20
  },
  paper: {
    display: "flex",
    flexWrap: "wrap",
    "& > *": {
      margin: "10px 10px",
      width: "500px",
      height: "auto"
    }
  },
}));

export default function Product({
  user,
  handleDeleteUser,
  handleChangeInput,
  handleEditUser,
  errors,
  userReset,
  editingUser
}) {
  const classes = useStyles();

  return (
    <div className={classes.paper}>
      <Card className={classes.root}>
        <CardContent>
          <Grid container>
            <Grid item
              xs={6}
              container
              direction="column"
              justify="space-between"
              alignItems="flex-start"
            >
              <Typography>
                <span className={classes.userName}>{`Name: ${user.name}`}</span>
              </Typography>
              <Typography>
                <span className={classes.userName}>{`Surname: ${user.surname}`}</span>
              </Typography>
            </Grid>
            <Grid
              item
              xs={4}
              container
              direction="column"
              justify="center"
              alignItems="center"
            >
              <Typography className={classes.userName}>
                {user.desc}
              </Typography>
            </Grid>
            <Grid
              item
              xs={2}
              container
              direction="column"
              justify="center"
              alignItems="center"
            >
              <NewUserForm
                user={user}
                handleChangeInput={handleChangeInput}
                errors={errors}
                userReset={userReset}
                handleEditUser={handleEditUser}
                editingUser={editingUser}
              />
              <Button onClick={() => handleDeleteUser(user.id)}>
                <DeleteIcon />
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </div>
  );
}
