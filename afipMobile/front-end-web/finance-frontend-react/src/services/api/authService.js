import axiosInstance from '../../api/axios.config';

export const authService = {
    // Login user
    login: async (username, password) => {
        const response = await axiosInstance.post('/login', {
            email: username,
            password,
        });
        return response.data;
    },

    // Register new user
    register: async (userData) => {
        const response = await axiosInstance.post('/user', {
            user_user: userData.email,
            user_name: userData.username,
            user_password: userData.password,
        });
        return response.data;
    },

    // Get current user (if needed)
    getCurrentUser: async (userId) => {
        const response = await axiosInstance.get(`/user/${userId}`);
        return response.data;
    },
};
