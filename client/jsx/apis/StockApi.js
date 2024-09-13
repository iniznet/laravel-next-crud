import Api from './Api';
export const StockAPI = {
    getAll: async () => {
        const response = await Api.get('/stocks');
        if (response.success)
            return response.data;
        throw new Error(response.message);
    },
    getOne: async (id) => {
        const response = await Api.get(`/stocks/${id}`);
        if (response.success)
            return response.data;
        throw new Error(response.message);
    },
    create: async (data) => {
        const response = await Api.post('/stocks', data);
        if (response.success)
            return response.data;
        throw new Error(response.message);
    },
    update: async (id, data) => {
        const response = await Api.put(`/stocks/${id}`, data);
        if (response.success)
            return response.data;
        throw new Error(response.message);
    },
    delete: async (id) => {
        const response = await Api.delete(`/stocks/${id}`);
        if (!response.success)
            throw new Error(response.message);
    },
    bulkDelete: async (ids) => {
        const response = await Api.post(`/stocks/bulk-destroy`, { ids });
        if (!response.success)
            throw new Error(response.message);
    },
    getNewKode: async () => {
        const response = await Api.get('/stocks/new-kode');
        if (response.success)
            return response.data.kode;
        throw new Error(response.message);
    },
};
