import axiosInstance from '../../api/axios.config';

export const accountService = {
    // Get all accounts
    getAll: async () => {
        const response = await axiosInstance.get('/cuentas');
        return response.data;
    },

    // Get account by ID
    getById: async (id) => {
        const response = await axiosInstance.get(`/cuentas/${id}`);
        return response.data;
    },

    // Create new account
    create: async (accountData) => {
        const response = await axiosInstance.post('/cuentas', accountData);
        return response.data;
    },

    // Update account
    update: async (id, accountData) => {
        const response = await axiosInstance.put(`/cuentas/${id}`, accountData);
        return response.data;
    },

    // Delete account
    delete: async (id) => {
        const response = await axiosInstance.delete(`/cuentas/${id}`);
        return response.data;
    },
};
