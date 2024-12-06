import actionTypes from "../actions/actionTypes";

const initState = {
    isLoggedIn: false,
    typeLogin: false,
    accesstoken: null,
    userData: {},  // Add userData state
    error: null,
    isAdmin: false,
    is_active: true,
};

const authReducer = (state = initState, action) => {
    switch (action.type) {
        case actionTypes.LOGIN_SUCCESS:
            return {
                ...state,
                isLoggedIn: action.data ? true : false,
                typeLogin: false,
                accesstoken: action.data.accesstoken,
                userData: action.data.userData,  // Store user data (Google or email)
                error: null,
                isAdmin: action.data.isAdmin,
                is_active: action.data.is_active,
            }
        case actionTypes.LOGIN_FAILURE:
            return {
                ...initState,
                error: action.error
            };
        case actionTypes.LOGOUT:
            return {
                ...initState
            }
        case actionTypes.EMAIL_LOGIN_SUCCESS:
            return {
                ...state,
                isLoggedIn: true,
                accesstoken: action.data.accesstoken,
                userData: action.userData || {},  // Update userData
                typeLogin: true,
                error: null,
                isAdmin: action.data.isAdmin,
                is_active: action.data.is_active,
            };
        case actionTypes.EMAIL_LOGIN_FAILURE:
            return {
                ...state,
                isLoggedIn: false,
                accesstoken: null,
                userData: {},  // Reset userData
                typeLogin: true,
                error: action.error,
            };
        case actionTypes.USER_REGISTER_SUCCESS:
            return {
                ...state,
                userData: action.userData || {},  // Update userData
            };
        case actionTypes.USER_REGISTER_FAILURE:
            return {
                ...state,
                userData: {},  // Reset userData
                error: action.error,
            };
        case actionTypes.USER_UPDATE_SUCCESS:
            return {
                ...state,
                userData: action.data.userData || {},  // Update userData

            };
        case actionTypes.USER_UPDATE_FAILURE:
            return {
                ...state,
                userData: {},  // Reset userData
                error: action.error,
            };
        case actionTypes.UPDATE_USER_DATA:
            return {
                ...state,
                userData: action.data.userData || {},  // Update userData
            };
        case actionTypes.RESET_PASSWORD_SUCCESS:
            return {
                ...state,
                userData: action.data.userData || {},  // Update userData
            };
        case actionTypes.RESET_PASSWORD_SUCCESS:
            return {
                ...state,
                userData: {},  // Reset userData
                error: action.error,
            };
        case actionTypes.CHANGE_PASSWORD_SUCCESS:
            console.log('CHANGE_PASSWORD_SUCCESS action:', action.payload.userData.response);
            return {
                ...state,
            };
        case actionTypes.CHANGE_PASSWORD_FAILURE:
            return {
                ...state,
                userData: {},  // Reset userData
                error: action.error,
            };
        case actionTypes.RESET_PASSWORD_FAILURE:
            return {
                ...state,
                userData: {},  // Reset userData
                error: action.error,
            };
        default:
            return state;
    }

}

export default authReducer