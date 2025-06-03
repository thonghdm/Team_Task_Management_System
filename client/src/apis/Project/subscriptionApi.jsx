import axios from 'axios';

export const createCheckoutSession = async (accesstoken, data) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_URL_SERVER}/api/stripe/create-checkout-session`, data, {
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
        const response = await axios.post(`${import.meta.env.VITE_URL_SERVER}/api/subscription/add-free`, data, {
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
        const response = await axios.get(`${import.meta.env.VITE_URL_SERVER}/api/subscription/get-subscription/${userId}`, {
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

export const getSubscriptionByUserId = async (accesstoken, userId) => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_URL_SERVER}/api/subscription/user-bills/${userId}`, {
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

export const getAllSubscription = async (accesstoken) => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_URL_SERVER}/api/subscription/user-bills`, {
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