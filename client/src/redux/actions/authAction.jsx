import { apiLoginSuccess, apiLoginWithEmail, apiRegisterWithEmail, apiLogOut} from '~/apis/Auth/authService';
import actionTypes from './actionTypes'

export const loginSuccess = (id, tokenLogin) => async (dispatch) => {
    try {
        let response = await apiLoginSuccess(id, tokenLogin)
        if (response?.data.err === 0) {
            dispatch({
                type: actionTypes.LOGIN_SUCCESS,
                data: response.data
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
        console.log('registerWithEmail response:', response);
        if (response && response.data) {
            dispatch({
                type: actionTypes.USER_REGISTER_SUCCESS,
                payload: {
                    user: response.data
                }
            });
            return {success: true}
        } else {
            throw new Error('Invalid response format');
        }
    } catch (error) {
        dispatch({
            type: actionTypes.USER_REGISTER_FAILURE,
            payload: error.response?.data?.error || error.message || 'Registration failed'
        });
        console.error('Registration error:', error.response?.data?.error || error.message);
        return {success: false, message: error.response?.data?.error || error.message || 'Registration failed'}
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
