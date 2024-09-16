import { apiLoginSuccess, apiLoginWithEmail } from '~/apis/Auth/authService';
import actionTypes from './actionTypes'

export const loginSuccess = (id, tokenLogin) => async (dispatch) => {
    try {
        let response = await apiLoginSuccess(id, tokenLogin)
        if (response?.data.err === 0) {
            dispatch({
                type: actionTypes.LOGIN_SUCCESS,
                data: response.data.token
            })
        } else {
            dispatch({
                type: actionTypes.LOGIN_SUCCESS,
                data: null
            })
        }
    } catch (error) {
        dispatch({
            type: actionTypes.LOGIN_SUCCESS,
            data: null
        })
    }
}


export const loginWithEmail = (email, password) => async (dispatch) => {
    try {
        dispatch({ type: actionTypes.LOGIN_REQUEST });

        let response = await apiLoginWithEmail(email, password);
        

        if (response!==null) {
            dispatch({
                type: actionTypes.EMAIL_LOGIN_SUCCESS,
                data: response.data.userWithToken,
                userData: response.data.userWithToken // Save user data if needed

            });
            console.log(response.data.userWithToken);
        } else {
            dispatch({
                type: actionTypes.EMAIL_LOGIN_FAILURE,
                error: response?.data?.message || 'Login failed'
            });
        }

    } catch (error) {
        dispatch({
            type: actionTypes.EMAIL_LOGIN_FAILURE,
            error: error.message || 'An error occurred'
        });
    }
};

// http://localhost:5000/api/auth/login

export const logout = () => ({
    type: actionTypes.LOGOUT
})