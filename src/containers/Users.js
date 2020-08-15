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
  const dispatch = useDispatch();
  const startSlice = +page * chunkSize;
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
    getUsersPage(+page);
  },[page]);

  const getUsersDispatch = () => {
    const getUserAsync = () => {
      return dispatch => dispatch(getUsersAction());
    };
    dispatch(getUserAsync());
  };

  const getUsersPage = async (index) => {
    setIsLoading(true);
    if (store.users.length === 0) {
      await getUsersDispatch();
    }
    history.push(`/page/${index}`);
    setIsLoading(false);
  };

  const handleChangeInput = (event, name) => {
    const newUser = { ...user };
    newUser[name] = event.target.value;
    setUser(newUser);
  }

  const nextPage = () => {
    history.push(`/page/${+page + 1}`);
  }

  const backPage = () => {
    history.push(`/page/${+page - 1}`);
  }

  const handleDeleteUser = async (id) => {
    await axios.delete(`http://77.120.241.80:8911/api/user/${id}`);
    getUsersDispatch();
  }

  const userReset = () => {
    setUser({
      name:'',
      surname: '',
      desc: ''
    });
    setErrors({
      name: '',
      surname: '',
      desc: ''
    });
  }

  const editingUser = (user) => {
    setUser({
      name: user.name,
      surname: user.surname,
      desc: user.desc
    });
  }

  const handleEditUser = async (id) => {
    const {
      name, surname, desc,
    } = user;
    const formData = {
      name,
      surname,
      desc
    };
    await axios.put(`http://77.120.241.80:8911/api/user/${id}`, formData)
      .then((data) => {
        if (data.errors) {
          let newErrors = { ...errors };
          newErrors = data.errors;
          setErrors(newErrors);
        }
        return data.success;
      });
      getUsersDispatch();
  }

  const createUser = () => {
    const formData = new FormData();
    const id = store.users.length > 0 ? store.users[store.users.length - 1].id++:1;
    const {
      name, surname, desc,
    } = user;
    formData.append('id', id);
    formData.append('name', name);
    formData.append('surname', surname);
    formData.append('desc', desc);
    axios.post('http://77.120.241.80:8911/api/users', formData)
      .then((data) => {
        if (data.errors) {
          let newErrors = { ...errors };
          newErrors = data.errors;
          setErrors(newErrors);
          return;
        }
      getUsersDispatch();
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
            <Button onClick={backPage} disabled={+page === 0 ? true : false }>
              Назад
            </Button>
            {new Array(store.numberOfPage).fill(null).map((value, index) => (
              <Button
                onClick={() => getUsersPage(index)}
                style={{ backgroundColor: (+page === +index) ? 'blue' : '' }}
                key={index}
                value={index}
              >
                {index + 1}
              </Button>
            ))}
            <Button onClick={nextPage} disabled={+page + 1 === store.numberOfPage ? true : false }>
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
        getUsersAction={getUsersDispatch}
      />
    </div>
  );
};
