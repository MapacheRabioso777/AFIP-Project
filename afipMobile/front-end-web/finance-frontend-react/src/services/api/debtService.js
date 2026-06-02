import axiosInstance from '../../api/axios.config';

export const debtService = {
    getAll: async () => {
        const response = await axiosInstance.get('/deuda');
        return response.data;
    },

    getById: async (id) => {
        const response = await axiosInstance.get(`/deuda/${id}`);
        return response.data;
    },

    create: async (debtData) => {
        const response = await axiosInstance.post('/deuda', debtData);
        return response.data;
    },

    update: async (id, debtData) => {
        const response = await axiosInstance.put(`/deuda/${id}`, debtData);
        return response.data;
    },

    delete: async (id) => {
        const response = await axiosInstance.delete(`/deuda/${id}`);
        return response.data;
    },
};
