import axiosInstance from '../../api/axios.config';

export const goalService = {
    getAll: async () => {
        const response = await axiosInstance.get('/metas');
        return response.data;
    },

    getById: async (id) => {
        const response = await axiosInstance.get(`/metas/${id}`);
        return response.data;
    },

    create: async (goalData) => {
        const response = await axiosInstance.post('/metas', goalData);
        return response.data;
    },

    update: async (id, goalData) => {
        const response = await axiosInstance.put(`/metas/${id}`, goalData);
        return response.data;
    },

    delete: async (id) => {
        const response = await axiosInstance.delete(`/metas/${id}`);
        return response.data;
    },
};
