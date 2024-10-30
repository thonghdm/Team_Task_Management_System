import { jwtDecode } from 'jwt-decode';
import axios from "axios";
import { apiRefreshToken } from '~/apis/Auth/authService';
import actionTypes from '~/redux/actions/actionTypes';

export const createAxios = (token,dispatch) => {
  const newInstance = axios.create();
  newInstance.interceptors.request.use(
    async (config) => {
      let date = new Date();
      const decodedToken = jwtDecode(token);
      if (decodedToken.exp < date.getTime() / 1000) {
        const response = await apiRefreshToken();
        dispatch({
          type: actionTypes.LOGIN_SUCCESS,
          data: {
            accesstoken: response.data.token,
            typeLogin: true,
            userData: response.data.userData,
          },
        });
        config.headers["authorization"] = "Bearer " + response.data.token;
      } else {
        config.headers["authorization"] = "Bearer " + token;
      }
      return config;
    },
    (err) => {
      return Promise.reject(err);
    }
  );
  return newInstance;
};
