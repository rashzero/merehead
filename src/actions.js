import { GET_USERS } from "./actionTypes";
import axios from 'axios';

export const getUsersAction = () => async dispatch => {
  const responseUsers = await axios.get("http://77.120.241.80:8911/api/users");
  const numberOfPage = Math.ceil(responseUsers.data.length / 5);
  dispatch({
    type: GET_USERS,
    payload: { 
      users: responseUsers.data,
      numberOfPage,
      error: ''
    }
  });
};

