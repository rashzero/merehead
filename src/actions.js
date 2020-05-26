import { GET_USERS } from "./actionTypes";

export const getUsersAction = () => async dispatch => {
  const responseUsers = await fetch("http://77.120.241.80:8911/api/users");
  const users = await responseUsers.json();

  dispatch({
    type: GET_USERS,
    payload: { 
      users,
      error: '',
    }
  });
};

