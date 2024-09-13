import Api from "./Api";
export const QueueAPI = {
    status: async () => {
        const response = await Api.get('/queue');
        if (response.success)
            return response.data;
        throw new Error(response.message);
    },
    update: async (data) => {
        const response = await Api.put(`/queue`, data);
        if (response.success)
            return response.data;
        throw new Error(response.message);
    },
};
