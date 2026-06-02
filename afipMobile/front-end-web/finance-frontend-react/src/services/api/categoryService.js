import axiosInstance from '../../api/axios.config';

export const categoryService = {
    getAll: async (type = null) => {
        const url = type ? `/categorias?type=${type}` : '/categorias';
        const response = await axiosInstance.get(url);
        return response.data;
    },

    getById: async (id) => {
        const response = await axiosInstance.get(`/categorias/${id}`);
        return response.data;
    },

    create: async (categoryData) => {
        const response = await axiosInstance.post('/categorias', categoryData);
        return response.data;
    },

    update: async (id, categoryData) => {
        const response = await axiosInstance.put(`/categorias/${id}`, categoryData);
        return response.data;
    },

    delete: async (id) => {
        const response = await axiosInstance.delete(`/categorias/${id}`);
        return response.data;
    },
};
