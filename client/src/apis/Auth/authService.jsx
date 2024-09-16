import axios from 'axios';

// Function to handle login success
export const apiLoginSuccess = (id, tokenLogin) => new Promise(async (resolve, reject) => {
    try {
        let response = await axios({
            method: 'post',
            url: 'http://localhost:5000/api/auth/login-success',
            data: { id, tokenLogin },
            withCredentials: true  // Set withCredentials here
        });
        resolve(response);
    } catch (error) {
        reject(error);
    }
});

export const apiLoginWithEmail = async (email, password) => {
    return await axios.post('http://localhost:5000/api/auth/email-login', {
        email,
        password
    });
};


// No need to set .default.withCredentials separately
// The withCredentials is set directly in the axios call
