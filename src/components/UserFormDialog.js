import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import Grid from "@material-ui/core/Grid";
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { makeStyles } from "@material-ui/core/styles";
import EditIcon from '@material-ui/icons/Edit';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles(theme => ({
  button: {
    width: "350px",
    height: "70px",
    margin: "25px",
    backgroundColor: "#a3339e",
    color: "#ffffff",
    borderRadius: "8px",
    display: "flex",
    justifyContent: "center",
    "&:hover": {
      backgroundColor: "#a3339e"
    }
  },
}));

export default function UserFormDialog(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClickEdit = (user) => {
    props.setUser(user);
    handleClickOpen();
  }

  const handleClose = () => {
    props.userReset();
    setOpen(false);
  };

  const handleButtonClick = async () => {
    const { user, handleEditUser, createUser } = props;
    let errors;
    if (user) {
      ({ errors } = await handleEditUser(user.id));
    } else {
      ({ errors } = await createUser());
    }
    if (!errors) setOpen(false);
  };

  return (
    <div>
      <center>
        {props.user ? 
          <Button onClick={() => handleClickEdit(props.user)}>
            <EditIcon /> 
          </Button>
          :
          <Button variant="outlined" className={classes.button} onClick={handleClickOpen}>
            Add new user
          </Button>
        }
      </center>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">
          <Grid container>
            <Grid item xs={11}>
              {props.user ? `Edit user - ${props.user.name} ${props.user.surname}` : "Add new user :)"}
            </Grid>
            <Grid item xs={1}>
              <Button onClick={handleClose}>
                <CloseIcon /> 
              </Button>
            </Grid>
          </Grid>
        </DialogTitle>
        <DialogContent>
          {
            ['name', 'surname', 'desc'].map(propName => (
              <TextField
                key={propName}
                error={!!props.errors[propName]}
                defaultValue={props.user ? props.user[propName] : ""}
                margin="dense"
                id={propName}
                label="Name"
                type="string"
                onChange={(event) => props.handleChangeInput(event, propName)}
                helperText={props.errors[propName]}
                fullWidth
              />
            ))
          }
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleButtonClick} color="primary">
            {props.user ? "Edit" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
