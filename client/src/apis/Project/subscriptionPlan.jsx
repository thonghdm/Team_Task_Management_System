import axios from 'axios';


export const getAllSubPlan = async (accesstoken) => {
    try {
        const response = await axios.get(`http://localhost:5000/api/subscription-plan/all-plans`, {
            headers: {
                authorization: `Bearer ${accesstoken}`
            },
            withCredentials: true
        }
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};
