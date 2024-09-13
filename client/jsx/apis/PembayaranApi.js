import Api from "./Api";
export const PembayaranAPI = {
    getAll: async () => {
        const response = await Api.get('/pembayaran');
        if (response.success)
            return response.data;
        throw new Error(response.message);
    },
    getOne: async (id) => {
        const response = await Api.get(`/pembayaran/${id}`);
        if (response.success)
            return response.data;
        throw new Error(response.message);
    },
    getServices: async () => {
        const response = await Api.get('/pembayaran/services');
        if (response.success)
            return response.data;
        throw new Error(response.message);
    },
    create: async (data) => {
        const response = await Api.post('/pembayaran', data);
        if (response.success)
            return response.data;
        throw new Error(response.message);
    },
    update: async (id, data) => {
        const response = await Api.put(`/pembayaran/${id}`, data);
        if (response.success)
            return response.data;
        throw new Error(response.message);
    },
    delete: async (id) => {
        const response = await Api.delete(`/pembayaran/${id}`);
        if (!response.success)
            throw new Error(response.message);
    },
    bulkDelete: async (ids) => {
        const response = await Api.post('/pembayaran/bulk', { ids });
        if (!response.success)
            throw new Error(response.message);
    },
    getNewIdentifiers: async () => {
        const response = await Api.get('/pembayaran/new-identifiers');
        if (response.success)
            return response.data;
        throw new Error(response.message);
    }
};
