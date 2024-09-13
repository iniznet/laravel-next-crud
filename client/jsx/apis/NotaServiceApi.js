import Api from "./Api";
export const NotaServiceAPI = {
    getAll: async () => {
        const response = await Api.get('/nota-service');
        if (response.success)
            return response.data;
        throw new Error(response.message);
    },
    getOne: async (id) => {
        const response = await Api.get(`/nota-service/${id}`);
        if (response.success)
            return response.data;
        throw new Error(response.message);
    },
    create: async (data) => {
        const response = await Api.post('/nota-service', data);
        if (response.success)
            return response.data;
        throw { message: response.message, errors: response.errors };
    },
    update: async (id, data) => {
        const response = await Api.put(`/nota-service/${id}`, data);
        if (response.success)
            return response.data;
        throw { message: response.message, errors: response.errors };
    },
    delete: async (id) => {
        const response = await Api.delete(`/nota-service/${id}`);
        if (!response.success)
            throw new Error(response.message);
    },
    bulkDelete: async (ids) => {
        const response = await Api.post('/nota-service/bulk', { ids });
        if (!response.success)
            throw new Error(response.message);
    },
    getNewIdentifiers: async () => {
        const response = await Api.get('/nota-service/new-identifiers');
        if (response.success)
            return response.data;
        throw new Error(response.message);
    }
};
