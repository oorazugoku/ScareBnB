import { csrfFetch } from './csrf';

//Type Producer
const LOAD_IMAGES = 'spots/LOAD_IMAGES';
const ADD_IMAGES_TO_SPOT = 'spots/ADD_IMAGES_TO_SPOT';

//Action Creators
const getImagesAction = (payload) => {
  return {
    type: LOAD_IMAGES,
    payload
  };
};

const addImagesToSpotAction = (payload) => {
    return {
      type: ADD_IMAGES_TO_SPOT,
      payload
    };
  };


// Thunk - Get all Spots
export const getImages = () => async (dispatch) => {
  const response = await csrfFetch("/api/spots")
  const data = await response.json();
  dispatch(getImagesAction(data));
  return data;
};

// Thunk - Edit Spot by Id
export const addImagesToSpot = (id, url) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${id}/images`, {
    method: 'POST',
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ url })
  })
  const data = await response.json();
  dispatch(addImagesToSpotAction(data));
  return data;
};


const initialState = {};

const imagesReducer = (state = initialState, action) => {
    const imageArr = [];
    const newState = {}
    switch (action.type) {
      case LOAD_IMAGES:
          action.payload.result.forEach(each => imageArr[each.id] = each)
          newState = {...imageArr};
      return newState;

      case ADD_IMAGES_TO_SPOT:
        newState[action.payload.id] = action.payload
      return newState;

    default:
      return state;
  }
};

export default imagesReducer;
