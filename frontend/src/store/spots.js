import { csrfFetch } from './csrf';

//Type Producer
const LOAD_SPOTS = 'spots/LOAD_SPOTS';
const GET_A_SPOT = 'spots/GET_A_SPOT';


//Action Creators
const loadSpots = (payload) => {
  return {
    type: LOAD_SPOTS,
    payload
  };
};

const getSpot = (payload) => {
  return {
    type: GET_A_SPOT,
    payload
  };
};


// Thunk - Get a Spot by ID
export const getOneSpot = (id) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${id}`)
  const data = await response.json();
  dispatch(getSpot(data));
  return data;
};

// Thunk - Get all Spots
export const getSpots = () => async (dispatch) => {
  const response = await csrfFetch("/api/spots")
  const data = await response.json();
  dispatch(loadSpots(data));
  return data;
};



const initialState = {};

const spotsReducer = (state = initialState, action) => {
    let newState;
    switch (action.type) {
        case LOAD_SPOTS:
            const spotsArr = {}
            action.payload.result.forEach(each => spotsArr[each.id] = each)
            newState = {...spotsArr};
        return newState;
        case GET_A_SPOT:
          newState = {...action.payload};
      return newState;
    default:
      return state;
  }
};

export default spotsReducer;
