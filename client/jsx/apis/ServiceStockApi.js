import Api from "./Api";
export const ServiceStockAPI = {
    getAll: async () => {
        const response = await Api.get('/services-stock');
        if (response.success)
            return response.data;
        throw new Error(response.message);
    },
};
