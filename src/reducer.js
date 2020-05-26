import { GET_USERS } from "./actionTypes";

const initialState = {
  users: [],
};

function Reducer(state = initialState, action) {
  switch (action.type) {
    case GET_USERS:
      return action.payload;
    default:
      return state;
  }
}

export default Reducer;
