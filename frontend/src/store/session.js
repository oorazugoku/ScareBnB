import { csrfFetch } from './csrf';

//Type Producer
const SET_USER = 'session/setUser';
const REMOVE_USER = 'session/removeUser';

//Action Creators
const setUser = (user) => {
  return {
    type: SET_USER,
    payload: user,
  };
};

const removeUser = () => {
  return {
    type: REMOVE_USER,
  };
};

// Thunk - Signup
export const signup = (user) => async (dispatch) => {
  const { username, email, password, firstName, lastName } = user;
  const response = await csrfFetch("/api/session/signup", {
    method: "POST",
    body: JSON.stringify({
      username,
      firstName,
      lastName,
      email,
      password,
    }),
  });
  const data = await response.json();
  dispatch(setUser(data.user));
  return response;
};

// Thunk - Logout
export const logout = () => async (dispatch) => {
    await csrfFetch('/api/session/logout', {
      method: 'DELETE'
    });
    dispatch(removeUser());
};

// Thunk - Login
export const login = (user) => async (dispatch) => {
  const { credential, password } = user;
  const response = await csrfFetch('/api/session/login', {
    method: 'POST',
    body: JSON.stringify({
      credential,
      password,
    }),
  });
  const data = await response.json();
  dispatch(setUser(data.user));
  return response;
};

// Thunk - Restore Session
export const restoreUser = () => async dispatch => {
    const response = await csrfFetch('/api/session');
    const data = await response.json();
    dispatch(setUser(data.user));
    return response;
  };

const initialState = { user: null };

const sessionReducer = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case SET_USER:
      newState = Object.assign({}, state);
      newState.user = action.payload;
      return newState;
    case REMOVE_USER:
      newState = Object.assign({}, state);
      newState.user = null;
      return newState;
    default:
      return state;
  }
};

export default sessionReducer;
