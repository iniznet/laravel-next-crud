import { ServiceOrStock } from "@/types/service";
import Api from "./Api";

export const ServiceStockAPI = {
    getAll: async (): Promise<ServiceOrStock[]> => {
        const response = await Api.get<ServiceOrStock[]>('/services-stock');
        if (response.success) return response.data!;
        throw new Error(response.message);
    },
};