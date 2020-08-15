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

export default function NewUserForm(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClickEdit = (user) => {
    props.editingUser(user);
    handleClickOpen();
  }

  const handleClose = () => {
    props.userReset();
    setOpen(false);
  };

  return (
    <div>
      <center>
        {props.user ? 
          <Button onClick={() => handleClickEdit(props.user)}>
            <EditIcon /> 
          </Button> :
          <Button variant="outlined" className={classes.button} onClick={handleClickOpen}>
            Add new user
          </Button>
        }
      </center>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">
          <Grid container>
            <Grid item xs={11}>
              {props.user ? `Edit user - ${props.user.name} ${props.user.surname}`:"Add new user :)"}
            </Grid>
            <Grid item xs={1}>
              <Button onClick={handleClose}>
                <CloseIcon /> 
              </Button>
            </Grid>
          </Grid>
          
        </DialogTitle>
        <DialogContent>
          <TextField
            error={props.errors.name ? true : false}
            defaultValue={props.user?props.user.name:""}
            margin="dense"
            id="name"
            label="Name"
            type="string"
            onChange={(event) => props.handleChangeInput(event, "name")}
            helperText={props.errors.name}
            fullWidth
          />
          <TextField
            error={props.errors.surname?true:false}
            defaultValue={props.user?props.user.surname:""}
            margin="dense"
            id="surname"
            label="Surname"
            type="string"
            onChange={(event) => props.handleChangeInput(event, "surname")}
            helperText={props.errors.surname}
            fullWidth
          />
          <TextField
            error={props.errors.desc?true:false}
            defaultValue={props.user?props.user.desc:""}
            margin="dense"
            id="desc"
            label="Desc"
            type="string"
            onChange={(event) => props.handleChangeInput(event, "desc")}
            helperText={props.errors.desc}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={props.user ? () => props.handleEditUser(props.user.id) : props.createUser} color="primary">
            {props.user ? "Edit" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
