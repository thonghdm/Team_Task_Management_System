import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { apiLogOut, apiRefreshToken } from '~/apis/Auth/authService'
import actionTypes from '~/redux/actions/actionTypes'

export const useRefreshToken = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const refreshToken = async () => {
        try {
            const { data: { token, userData } } = await apiRefreshToken();
            dispatch({
                type: actionTypes.LOGIN_SUCCESS,
                data: { accesstoken: token, typeLogin: true, userData },
            });
            return token;
        } catch (refreshError) {
            if (refreshError.response?.status === 403) {
                toast.error("Your session has expired, please log in again.");
                dispatch({ type: actionTypes.LOGOUT });
                navigate('/');
            } else {
                toast.error(refreshError.response?.data.message || 'Error refreshing token!');
            }
            throw refreshError;
        }
    };

    return refreshToken;
};