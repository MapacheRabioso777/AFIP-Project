import axiosInstance from '../../api/axios.config';

export const expenseService = {
    getAll: async () => {
        const response = await axiosInstance.get('/gastos');
        return response.data;
    },

    getById: async (id) => {
        const response = await axiosInstance.get(`/gastos/${id}`);
        return response.data;
    },

    create: async (expenseData) => {
        const response = await axiosInstance.post('/gastos', expenseData);
        return response.data;
    },

    update: async (id, expenseData) => {
        const response = await axiosInstance.put(`/gastos/${id}`, expenseData);
        return response.data;
    },

    delete: async (id) => {
        const response = await axiosInstance.delete(`/gastos/${id}`);
        return response.data;
    },
};
