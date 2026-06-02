import axiosInstance from '../../api/axios.config';

export const userService = {
    initializeCategories: async () => {
        const response = await axiosInstance.post('/user/initialize-categories');
        return response.data;
    },
};
