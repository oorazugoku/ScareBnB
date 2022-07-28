import { csrfFetch } from './csrf';

//Type Producer
const LOAD_SPOT_REVIEWS = 'reviews/LOAD_SPOT_REVIEWS';
const ADD_REVIEW_TO_SPOT = 'reviews/ADD_REVIEW_TO_SPOT';
const DELETE_REVIEW = 'reviews/DELETE_REVIEW';
const EDIT_REVIEW = 'reviews/EDIT_REVIEW';

//Action Creators
const getSpotReviewsAction = (payload) => {
  return {
    type: LOAD_SPOT_REVIEWS,
    payload
  };
};

const addReviewAction = (payload) => {
  return {
    type: ADD_REVIEW_TO_SPOT,
    payload
  };
};

const deleteReviewAction = (payload) => {
  return {
    type: DELETE_REVIEW,
    payload
  };
};

const editReviewAction = (payload) => {
  return {
    type: EDIT_REVIEW,
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

// Thunk - Add Review to a Spot
export const addReview = (spotId, payload) => async (dispatch) => {
    const { review, stars } = payload
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
      method: 'POST',
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ stars, review })
    })
    const data = await response.json();
    dispatch(addReviewAction(data));
    return data;
  };

// Thunk - Delete a Review
export const deleteReview = (reviewId) => async (dispatch) => {
  const response = await csrfFetch(`/api/reviews/${reviewId}`, {
    method: 'DELETE'
  })
  const data = await response.json();
  dispatch(deleteReviewAction(data));
  return data;
};

// Thunk - Edit a Review
export const editReview = (reviewId, payload) => async (dispatch) => {
  const { review, stars } = payload
  const response = await csrfFetch(`/api/reviews/${reviewId}`, {
    method: 'PUT',
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ stars, review })
  })
  const data = await response.json();
  dispatch(editReviewAction(data));
  return data;
};


const initialState = {};

const reviewsReducer = (state = initialState, action) => {
    const reviewArr = [];
    let newState = {}
    switch (action.type) {
      case LOAD_SPOT_REVIEWS:
          action.payload.Reviews.forEach(each => reviewArr[each.id] = each)
          newState = {...reviewArr};
      return newState;

    default:
      return state;
  }
};

export default reviewsReducer;
