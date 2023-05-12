import { csrfFetch } from "./csrf";

//actions ->
const LOAD_REVIEWS = '/reviews/loadReviews';
const CREATE_REVIEW = '/reviews/createReview';
const LOAD_USER_REVIEWS = '/reviews/loadUserReviews';
const REMOVE_REVIEW = '/reviews/removeReview';

//action creators ->
const loadReviews = (reviews) => {
    return {
        type: LOAD_REVIEWS,
        reviews
    }
}

const createReview = (review) => {
    return {
        type: CREATE_REVIEW,
        review
    }
}

const loadUserReviews = (reviews) => {
    return {
        type: LOAD_USER_REVIEWS,
        reviews
    }
}

const removeReview = (reviewId) => {
    return {
        type: REMOVE_REVIEW,
        reviewId
    }
}

//thunk action creators ->
export const getReviews = (spotId) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${spotId}/reviews`);
    const data = await res.json();
    dispatch(loadReviews(data));
    return data;
}

export const postReview = (review, spotId) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${spotId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(review)
    });
    if (res.ok) {
        const data = await res.json();
        dispatch(createReview(data));
        return data;
    }
}

export const getUserReviews = () => async (dispatch) => {
    const res = await csrfFetch(`/api/reviews/current`);
    const data = await res.json();
    dispatch(loadUserReviews(data));
    return data;
}

export const deleteReview = (reviewId) => async (dispatch) => {
    const res = await csrfFetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE'
    });
    if (res.ok) {
        const data = await res.json();
        dispatch(removeReview(reviewId));
        return data;
    }
}

//reducer ->
const initialState = { spot: {}, user: {}};

const reviewsReducer = (state = initialState, action) => {
    let newState;
    switch (action.type) {
        case LOAD_REVIEWS:
            newState = {...state, spot: {}, user: {...state.user}};
            action.reviews.Reviews.forEach(review => newState.spot[review.id] = review)
            return newState;
        case CREATE_REVIEW:
            newState = {...state, spot: {...state.spot}, user: {}};
            newState.spot[action.review.id] = action.review;
            return newState;
        case LOAD_USER_REVIEWS:
            newState = {...state, spot: {...state.spot}, user: {}};
            action.reviews.Reviews.forEach(review => newState.user[review.id] = review);
            return newState;
        case REMOVE_REVIEW:
            newState = {...state, spot: {...state.spot}, user: {...state.user}};
            delete newState.spot[action.reviewId];
            delete newState.user[action.reviewId];
            return newState;
        default:
            return state;
    }
}

export default reviewsReducer;
