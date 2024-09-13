import Api from "./Api";
export const InvoiceAPI = {
    getAll: async () => {
        const response = await Api.get('/invoices');
        if (response.success)
            return response.data;
        throw new Error(response.message);
    },
    getOne: async (id) => {
        const response = await Api.get(`/invoices/${id}`);
        if (response.success)
            return response.data;
        throw new Error(response.message);
    },
    create: async (data) => {
        const response = await Api.post('/invoices', data);
        if (response.success)
            return response.data;
        throw new Error(response.message);
    },
    update: async (id, data) => {
        const response = await Api.put(`/invoices/${id}`, data);
        if (response.success)
            return response.data;
        throw new Error(response.message);
    },
    delete: async (id) => {
        const response = await Api.delete(`/invoices/${id}`);
        if (!response.success)
            throw new Error(response.message);
    },
    bulkDelete: async (ids) => {
        const response = await Api.post(`/invoices/bulk`, { ids });
        if (!response.success)
            throw new Error(response.message);
    },
    getNewIdentifiers: async () => {
        const response = await Api.get('/invoices/new-identifiers');
        if (response.success)
            return response.data;
        throw new Error(response.message);
    },
};
