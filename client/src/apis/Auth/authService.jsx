import axios from 'axios';

// Function to handle login success
export const apiLoginSuccess = (id, tokenLogin) => new Promise(async (resolve, reject) => {
    try {
        let response = await axios({
            method: 'post',
            url: `${import.meta.env.VITE_URL_SERVER}/api/auth/login-success`,
            data: { id, tokenLogin },
            withCredentials: true  // Set withCredentials here
        });
        resolve(response);
    } catch (error) {
        reject(error);
    }
});

export const apiLoginWithEmail = async (email, password) => {
    try {
        const response = await axios.post( `${import.meta.env.VITE_URL_SERVER}/api/auth/email-login`, {
            email,
            password
        }, { withCredentials: true });
        return response;
    } catch (error) {
        if (error.response && error.response.data) {
            throw new Error(error.response.data.message || 'An error occurred');
        }
        throw new Error('An error occurred');
    }
};



export const apiRegisterWithEmail = async (name, email, password) => {
    try {   
        const response = await axios.post(`${import.meta.env.VITE_URL_SERVER}/api/auth/email-register`, {
            name,
            email,
            password
        });
        return response;
    } catch (error) {
        console.error('Registration error:', error.response?.data || error.message);
        throw error;
    }
};
export const apiResetPassword = async (email) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_URL_SERVER}/api/auth/otp-reset-password`, { email });
        return response;
    } catch (error) {
        console.error('Reset password error:', error.response?.data || error.message);
        throw error;
    }
}
export const apiLogOut = async () => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_URL_SERVER}/api/auth/logout`, { withCredentials: true });
        return response;
    } catch (error) {
        console.error('Logout error:', error.response?.data || error.message);
        throw error;
    }
};
export const apiRefreshToken = async () => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_URL_SERVER}/api/auth/refresh`, null, { withCredentials: true });
        return response;
    } catch (error) {
        console.error('Refresh token error:', error.response?.data || error.message);
        throw error;
    }
}
// No need to set .default.withCredentials separately
// The withCredentials is set directly in the axios call
