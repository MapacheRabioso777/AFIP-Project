import axiosInstance from '../../api/axios.config';

export const incomeService = {
    getAll: async () => {
        const response = await axiosInstance.get('/ingresos');
        return response.data;
    },

    getById: async (id) => {
        const response = await axiosInstance.get(`/ingresos/${id}`);
        return response.data;
    },

    create: async (incomeData) => {
        const response = await axiosInstance.post('/ingresos', incomeData);
        return response.data;
    },

    update: async (id, incomeData) => {
        const response = await axiosInstance.put(`/ingresos/${id}`, incomeData);
        return response.data;
    },

    delete: async (id) => {
        const response = await axiosInstance.delete(`/ingresos/${id}`);
        return response.data;
    },
};
