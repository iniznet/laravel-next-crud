import { Service } from "@/types/service";
import Api from "./Api";

export const ServiceAPI = {
    getAll: async (): Promise<Service[]> => {
        const response = await Api.get<Service[]>('/master-jasa');
        if (response.success) return response.data!;
        throw new Error(response.message);
    },

    getOne: async (id: string): Promise<Service> => {
        const response = await Api.get<Service>(`/master-jasa/${id}`);
        if (response.success) return response.data!;
        throw new Error(response.message);
    },

    create: async (data: Omit<Service, 'id'>): Promise<Service> => {
        const response = await Api.post<Service>('/master-jasa', data);
        if (response.success) return response.data!;
        throw new Error(response.message);
    },

    update: async (id: string, data: Partial<Service>): Promise<Service> => {
        const response = await Api.put<Service>(`/master-jasa/${id}`, data);
        if (response.success) return response.data!;
        throw new Error(response.message);
    },

    delete: async (id: string): Promise<void> => {
        const response = await Api.delete<void>(`/master-jasa/${id}`);
        if (!response.success) throw new Error(response.message);
    },

    bulkDelete: async (ids: string[]): Promise<void> => {
        const response = await Api.post<void>(`/master-jasa/bulk`, { ids });
        if (!response.success) throw new Error(response.message);
    }
};
