import axiosInstance from '../../api/axios.config';

export const budgetService = {
    getAll: async () => {
        const response = await axiosInstance.get('/presupuesto');
        return response.data;
    },

    getById: async (id) => {
        const response = await axiosInstance.get(`/presupuesto/${id}`);
        return response.data;
    },

    create: async (budgetData) => {
        const response = await axiosInstance.post('/presupuesto', budgetData);
        return response.data;
    },

    update: async (id, budgetData) => {
        const response = await axiosInstance.put(`/presupuesto/${id}`, budgetData);
        return response.data;
    },

    delete: async (id) => {
        const response = await axiosInstance.delete(`/presupuesto/${id}`);
        return response.data;
    },
};
