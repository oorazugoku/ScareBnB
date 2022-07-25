import { csrfFetch } from './csrf';

//Type Producer
const LOAD_SPOTS = 'spots/LOAD_SPOTS';
const GET_A_SPOT = 'spots/GET_A_SPOT';
const EDIT_SPOT = 'spots/EDIT_SPOT';
const CREATE_SPOT = 'spots/CREATE_SPOT';

//Action Creators
const getSpotsAction = (payload) => {
  return {
    type: LOAD_SPOTS,
    payload
  };
};

const getOneSpotAction = (payload) => {
  return {
    type: GET_A_SPOT,
    payload
  };
};

const editSpotAction = (payload) => {
  return {
    type: EDIT_SPOT,
    payload
  };
};

const createSpotAction = (payload) => {
  return {
    type: CREATE_SPOT,
    payload
  };
};


// Thunk - Get a Spot by ID
export const getOneSpot = (id) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${id}`)
  const data = await response.json();
  dispatch(getOneSpotAction(data));
  return data;
};

// Thunk - Get all Spots
export const getSpots = () => async (dispatch) => {
  const response = await csrfFetch("/api/spots")
  const data = await response.json();
  dispatch(getSpotsAction(data));
  return data;
};

// Thunk - Edit Spot by Id
export const editSpot = (payload) => async (dispatch) => {
  const { id, name, description, address, city, state, country, price } = payload
  const response = await csrfFetch(`/api/spots/${id}`, {
    method: 'PUT',
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ name, description, address, city, state, country, price })
  })
  const data = await response.json();
  dispatch(editSpotAction(data));
  return data;
};

// Thunk - Create a Spot
export const createSpot = (payload) => async (dispatch) => {
  const { name, description, address, city, state, country, price } = payload
  const response = await csrfFetch(`/api/spots`, {
    method: 'POST',
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ name, description, address, city, state, country, price })
  })
  const data = await response.json();
  dispatch(createSpotAction(data));
  return data;
};


const initialState = {};

const spotsReducer = (state = initialState, action) => {
    let newState;
    switch (action.type) {
      case LOAD_SPOTS:
          let spotsArr = {}
          action.payload.result.forEach(each => spotsArr[each.id] = each)
          newState = {...spotsArr};
      return newState;

      case GET_A_SPOT:
        newState = {...action.payload};
      return newState;

      case EDIT_SPOT:
        newState = {...action.payload.result};
      return newState;

      case CREATE_SPOT:
        newState = {...action.payload};
      return newState;

    default:
      return state;
  }
};

export default spotsReducer;
