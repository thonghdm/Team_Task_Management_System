import { apiLoginSuccess, apiLoginWithEmail, apiRegisterWithEmail, apiLogOut, apiResetPassword} from '~/apis/Auth/authService';
import { apiChangePassword, apiChangePasswordProfile } from '~/apis/User/userService';
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

export const resetPassword = (email) => async (dispatch) => {
    try {
        dispatch({ type: actionTypes.RESET_PASSWORD_REQUEST });        
        const response = await apiResetPassword(email);
        console.log('resetPassword response:', response);
        if (response && response.data) {
            dispatch({
                type: actionTypes.RESET_PASSWORD_REQUEST,
                payload: response.data
            });
            console.log('resetPassword responseeeeeeeee:', response);
            return { success: true };
        } else {
            throw new Error('Invalid response format');
        }
    } catch (error) {
        dispatch({
            type: actionTypes.RESET_PASSWORD_FAILURE,
            payload: error.response?.data?.error || error.message || 'Reset password failed'
        });
        return { 
            success: false, 
            message: error.response?.data?.error || error.message || 'Reset password failed'
        };
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
export const changePassword = (email, password) => async (dispatch) => {
    try {
        const response = await apiChangePassword(email, password);
        console.log('changePassword response:', response);
        console.log('changePassword responseresponse.data.response:', response.data);
        if (response && response.data) {
            dispatch({
                type: actionTypes.CHANGE_PASSWORD_SUCCESS,
                payload: {
                    userData: response.data
                }
            });
            return { success: true };
        } else {
            throw new Error('Invalid response format');
        }
    } catch (error) {
        dispatch({
            type: actionTypes.CHANGE_PASSWORD_FAILURE,
            payload: error.response?.data?.error || error.message || 'Change password failed'
        });
        return { 
            success: false, 
            message: error.response?.data?.error || error.message || 'Change password failed'
        };
    }
}
export const changePasswordProfile = (email, password, newPassword) => async (dispatch) => {
    try {
        const response = await apiChangePasswordProfile(email, password, newPassword);
        if (response && response.data ) {
            dispatch({
                type: actionTypes.CHANGE_PASSWORD_SUCCESS,
                payload: {
                    userData: response.data
                }
            });
            console.log('changePassword responseeeeeeeee:', response.data.msg);
            return { success: true,  message: response.data.msg };
        } else {
            throw new Error('Invalid response format');
        }
    } catch (error) {
        console.error('Change password error:', error.response?.data?.error || error.message);
        dispatch({
            type: actionTypes.CHANGE_PASSWORD_FAILURE,
            payload: error.response?.data?.error || error.message || 'Change password failed'
        });
        return { 
            success: false, 
            message: error.response?.data?.error || error.message || 'Change password failed'
        };
    }
}
