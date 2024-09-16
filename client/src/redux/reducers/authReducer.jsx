import actionTypes from "../actions/actionTypes";

const initState = {
    isLoggedIn: false,
    typeLogin: false,
    token: null,
    userData: {},  // Add userData state
    error: null,
};

const authReducer = (state = initState, action) => {
    switch (action.type) {
        case actionTypes.LOGIN_SUCCESS:
            return {
                ...state,
                isLoggedIn: action.data ? true : false,
                typeLogin: false,
                token: action.data
            }
        case actionTypes.LOGOUT:
            return {
                ...initState
            }
        case actionTypes.EMAIL_LOGIN_SUCCESS:
            return {
                ...state,
                isLoggedIn: true,
                token: action.data,
                userData: action.userData || {},  // Update userData
                typeLogin: true,
                error: null,
            };
        case actionTypes.EMAIL_LOGIN_FAILURE:
            return {
                ...state,
                isLoggedIn: false,
                token: null,
                userData: {},  // Reset userData
                typeLogin: true,
                error: action.error,
            };
        default:
            return state;
    }

}

export default authReducer