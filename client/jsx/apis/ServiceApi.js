import Api from "./Api";
export const ServiceAPI = {
    getAll: async () => {
        const response = await Api.get('/master-jasa');
        if (response.success)
            return response.data;
        throw new Error(response.message);
    },
    getOne: async (id) => {
        const response = await Api.get(`/master-jasa/${id}`);
        if (response.success)
            return response.data;
        throw new Error(response.message);
    },
    create: async (data) => {
        const response = await Api.post('/master-jasa', data);
        if (response.success)
            return response.data;
        throw new Error(response.message);
    },
    update: async (id, data) => {
        const response = await Api.put(`/master-jasa/${id}`, data);
        if (response.success)
            return response.data;
        throw new Error(response.message);
    },
    delete: async (id) => {
        const response = await Api.delete(`/master-jasa/${id}`);
        if (!response.success)
            throw new Error(response.message);
    },
    bulkDelete: async (ids) => {
        const response = await Api.post(`/master-jasa/bulk`, { ids });
        if (!response.success)
            throw new Error(response.message);
    }
};
