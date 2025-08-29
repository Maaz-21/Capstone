import axiosInstance from './axios';

export const fetchTestMessage = async () => {
    try {
        const response = await axiosInstance.get('/test');
        return response.data;
    } catch (error) {
        throw error;
    }
};
//Add more API calls as needed