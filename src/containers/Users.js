import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import axios from 'axios';
import ProgressCentered from "../components/ProgressCentered";
import { getUsersAction } from "../actions";
import Grid from "@material-ui/core/Grid";
import NewUserForm from "../components/NewUserForm";
import User from "../components/User";
import Button from "@material-ui/core/Button";
import ButtonGroup from '@material-ui/core/ButtonGroup';

const useStyles = makeStyles(theme => ({
  button: {
    width: "350px",
    height: "70px",
    margin: "30px auto",
    backgroundColor: "#a3339e",
    color: "#ffffff",
    borderRadius: "8px",
    display: "flex",
    justifyContent: "center",
    "&:hover": {
      backgroundColor: "#a3339e"
    }
  },
  root: {
    backgroundColor: "#f5f5f5"
  },
  error: {
    minHeight: "60vh"
  },
  pagination: {
    margin: "25px"
  }
}));

export default function Users() {
  const chunkSize = 5;
  const classes = useStyles();
  const history = useHistory(); 
  const { page } = useParams();
  const pageNumber = Number(page);
  const dispatch = useDispatch();
  const startSlice = pageNumber * chunkSize;
  const endSlice = chunkSize + startSlice;

  const store = useSelector(state => ({
    users: state.users,
    numberOfPage: state.numberOfPage 
  }));

  const  [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState({
    name:'',
    surname: '',
    desc: ''
  });
  const [errors, setErrors] = useState({
    name: '',
    surname: '',
    desc: ''
  });

  useEffect(() => {
    getUsersPage(pageNumber);
  },[pageNumber]);

  const getUsersDispatch = () => {
    const getUsersAsync = () => {
      return dispatch => dispatch(getUsersAction());
    };
    dispatch(getUsersAsync());
  };

  const getUsersPage = async (index) => {
    setIsLoading(true);
    if (store.users.length === 0) {
      await getUsersDispatch();
    }
    history.push(`/page/${index}`);
    setIsLoading(false);
  };

  const handleChangeInput = (event, inputId) => {
    setUser({ ...user, [inputId]: event.target.value });
  };

  const nextPage = () => {
    history.push(`/page/${pageNumber + 1}`);
  };

  const backPage = () => {
    history.push(`/page/${pageNumber - 1}`);
  };

  const handleDeleteUser = async (id) => {
    const response = await axios.delete(`http://77.120.241.80:8911/api/user/${id}`);
    if(response.status === 200){
      getUsersDispatch();
    }
  };

  const userReset = () => {
    setUser({
      name:'',
      surname: '',
      desc: ''
    });
  };

  const resetErrors = () => {
    setErrors({
      name: '',
      surname: '',
      desc: ''
    });
  };

  const editingUser = (user) => {
    setUser(user);
  };

  const handleEditUser = (id) => {
    axios.put(`http://77.120.241.80:8911/api/user/${id}`, user)
      .then(() => {
        resetErrors();
        getUsersDispatch();
      })
      .catch((error)=> {
        setErrors(error.response.data.errors);
      });
  };

  const createUser = () => {
    axios.post('http://77.120.241.80:8911/api/users', user)
      .then(() => {
        userReset();
        resetErrors();
        getUsersDispatch();
      })
      .catch((error)=> {
        setErrors(error.response.data.errors);
      });
  };

  if (isLoading) {
    return <ProgressCentered />;
  };

  return (
    <div className={classes.root}>
      <div>
        <Grid
          item
          container
          direction="row"
          justify="center"
          alignItems="center"
        >
          {store.users.slice(startSlice, endSlice).map(user => 
            <User
              handleChangeInput={handleChangeInput}
              user={user}
              key={user.id}
              editingUser={editingUser}
              handleDeleteUser={handleDeleteUser}
              handleEditUser={handleEditUser}
              errors={errors}
              userReset={userReset}
              resetErrors={resetErrors}
            />)}
        </Grid>
        <Grid
          item
          container
          direction="row"
          justify="center"
          alignItems="center"
        >
          <ButtonGroup
            color="secondary"
            aria-label="large outlined secondary button group"
            className={classes.pagination}
          >
            <Button
              onClick={backPage}
              // is first page
              disabled={pageNumber === 0}
            >
              Назад
            </Button>
            {new Array(store.numberOfPage).fill(null).map((value, index) => (
              <Button
                onClick={() => getUsersPage(index)}
                style={{ backgroundColor: (pageNumber === index) ? 'blue' : '' }}
                key={index}
                value={index}
              >
                {index + 1}
              </Button>
            ))}
            <Button
              onClick={nextPage}
              // is last page
              disabled={pageNumber + 1 === store.numberOfPage}
            >
              Вперед
            </Button>
          </ButtonGroup>
        </Grid>
      </div>
      <NewUserForm
        handleChangeInput={handleChangeInput}
        createUser={createUser}
        errors={errors}
        userReset={userReset}
        resetErrors={resetErrors}
        getUsersAction={getUsersDispatch}
      />
    </div>
  );
};
