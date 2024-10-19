import { apiLoginSuccess, apiLoginWithEmail, apiRegisterWithEmail} from '~/apis/Auth/authService';
import actionTypes from './actionTypes'
import {apiGetOne} from '~/apis/User/userService';

export const loginSuccess = (id, tokenLogin) => async (dispatch) => {
    try {
        let response = await apiLoginSuccess(id, tokenLogin)
        if (response?.data.err === 0) {
            let accesstoken = response.data.accesstoken;
            let googleData = await apiGetOne(accesstoken);  
            if (googleData?.data.err === 0) {
                dispatch({
                    type: actionTypes.LOGIN_SUCCESS,
                    data: {
                        accesstoken,
                        userData: googleData.data.response  // Store Google user data here
                    }
                });
            }
        } else {
            dispatch({
                type: actionTypes.LOGIN_FAILURE,
                error: response.data.msg || 'Login failed'
            })
        }
    } catch (error) {
        dispatch({
             type: actionTypes.LOGIN_FAILURE,
            error: error.message || 'Login failed'
        })
    }
}


export const loginWithEmail = (email, password) => async (dispatch) => {
    try {
        dispatch({ type: actionTypes.LOGIN_REQUEST });

        let response = await apiLoginWithEmail(email, password);
        if (response) {
            dispatch({
                type: actionTypes.EMAIL_LOGIN_SUCCESS,
                data: {accesstoken: response.data.userWithToken.accessToken},
                userData: response.data.userWithToken // Save user data if needed
            });
            return response
        } else {
            dispatch({
                type: actionTypes.EMAIL_LOGIN_FAILURE,
                error: response?.data?.message || 'Login failed'
            });
            return null
        }

    } catch (error) {
        dispatch({
            type: actionTypes.EMAIL_LOGIN_FAILURE,
            error: error.message || 'An error occurred'
        });
    }
};

export const registerWithEmail = (name, email, password) => async (dispatch) => {
    try {
        dispatch({ type: actionTypes.LOGIN_REQUEST });

        const response = await apiRegisterWithEmail(name, email, password);
        
        if (response && response.data && response.data.userWithToken) {
            dispatch({
                type: actionTypes.USER_REGISTER_SUCCESS,
                payload: {
                    token: response.data.userWithToken.accessToken,
                    user: response.data.userWithToken
                }
            });
        } else {
            throw new Error('Invalid response format');
        }
    } catch (error) {
        dispatch({
            type: actionTypes.USER_REGISTER_FAILURE,
            payload: error.response?.data?.message || error.message || 'Registration failed'
        });
    }
};


// http://localhost:5000/api/auth/login

export const logout = () => async (dispatch) =>{
    try{
        dispatch({ type: actionTypes.LOGOUT });
        const response = await apiLogOut();
    }
    catch(error){
        console.error('Logout error:', error.response?.data || error.message);
        throw error;
    }
}
