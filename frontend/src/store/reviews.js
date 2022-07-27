import { csrfFetch } from './csrf';

//Type Producer
const LOAD_SPOT_REVIEWS = 'reviews/LOAD_SPOT_REVIEWS';
const ADD_REVIEW_TO_SPOT = 'reviews/ADD_REVIEW_TO_SPOT';

//Action Creators
const getSpotReviewsAction = (payload) => {
  return {
    type: LOAD_SPOT_REVIEWS,
    payload
  };
};


// Thunk - Get all Reviews by Spot Id
export const getSpotReviews = (spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}/reviews`)
  const data = await response.json();
  dispatch(getSpotReviewsAction(data));
  return data;
};


const initialState = {};

const reviewsReducer = (state = initialState, action) => {
    const imageArr = [];
    const newState = {}
    switch (action.type) {
      case LOAD_SPOT_REVIEWS:
          action.payload.result.forEach(each => imageArr[each.id] = each)
          newState = {...imageArr};
      return newState;

    default:
      return state;
  }
};

export default reviewsReducer;
