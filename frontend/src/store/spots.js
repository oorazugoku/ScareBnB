import { csrfFetch } from './csrf';

//Type Producer
const LOAD_SPOTS = 'spots/LOAD_SPOTS';


//Action Creators
const loadSpots = (payload) => {
  return {
    type: LOAD_SPOTS,
    payload
  };
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
            newState = {...state, ...spotsArr};
        return newState;
    default:
      return state;
  }
};

export default spotsReducer;
