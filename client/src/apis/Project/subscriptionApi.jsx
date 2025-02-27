import axios from 'axios';

export const createCheckoutSession = async (accesstoken, data) => {
    try {
        const response = await axios.post(`http://localhost:5000/api/stripe/create-checkout-session`, data, {
            headers: {
                authorization: `Bearer ${accesstoken}`
            },
            withCredentials: true
        });
        return response.data.url;
    } catch (error) {
        throw error;
    }
};