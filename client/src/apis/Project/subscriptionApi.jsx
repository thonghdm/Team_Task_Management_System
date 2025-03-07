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

export const createSubscriptionFree = async (accesstoken, data) => {
    try {
        const response = await axios.post(`http://localhost:5000/api/subscription/add-free`, data, {
            headers: {
                authorization: `Bearer ${accesstoken}`
            },
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getSubscriptionByUser = async (accesstoken, userId) => {
    try {
        const response = await axios.get(`http://localhost:5000/api/subscription/get-subscription/${userId}`, {
            headers: {
                authorization: `Bearer ${accesstoken}`
            },
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}