import * as actionTypes from "./actionTypes";
import axios from "axios";
import jwt_decode from "jwt-decode";


const setCurrentUser = user => ({
    type: actionTypes.SET_CURRENT_USER,
    payload: user
});

export const login = userData => {
    return async dispatch => {
        try {
            let response = await axios.post("https://the-index-api.herokuapp.com/login/", userData);
            let user = await response.data;
            dispatch(setAuthToken(user.token));
        } catch (err) {
            console.log('An error occurred.', err);
        }
    };
};

export const signup = userData => {
    return async dispatch => {
        try {
            await axios.post("https://the-index-api.herokuapp.com/signup/", userData)
        } catch (error) {
            console.error(error.response.data);
        }
    };
};

export const logout = () => {
    setAuthToken();
    return setCurrentUser();
};

const setAuthToken = token => {
    return dispatch => {
        if (token) {
            axios.defaults.headers.common.Authorization = `JWT ${token}`;
            const decodedUser = jwt_decode(token);
            dispatch(setCurrentUser(decodedUser));
            localStorage.setItem("myToken", token);
        } else {
            delete axios.defaults.headers.common.Authorization;
            dispatch(setCurrentUser())
        }
    }
}
export const checkForExpiredToken = () => {
    return dispatch => {
        // Get token
        const token = localStorage.getItem("myToken");
        if (token) {
            const currentTime = Date.now() / 1000;
            // Decode token and get user info
            const user = jwt_decode(token);
            // Check token expiration
            if (user.exp >= currentTime) {
                // Set auth token header
                setAuthToken(token);
            } else {
                dispatch(logout());
            }
        }
    };
};


// const setCurrentUser = user => ({
//     type: actionTypes.SET_CURRENT_USER,
//     payload: user
// });