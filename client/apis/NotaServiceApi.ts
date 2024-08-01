import { NotaService } from "@/types/notaservice";
import Api from "./Api";

interface NewIdentifiers {
    KODE: string;
}

export const NotaServiceAPI = {
    getAll: async (): Promise<NotaService[]> => {
        const response = await Api.get<NotaService[]>('/nota-service');
        if (response.success) return response.data!;
        throw new Error(response.message);
    },

    getOne: async (id: string): Promise<NotaService> => {
        const response = await Api.get<NotaService>(`/nota-service/${id}`);
        if (response.success) return response.data!;
        throw new Error(response.message);
    },

    create: async (data: Omit<NotaService, 'ID'>): Promise<NotaService> => {
        const response = await Api.post<NotaService>('/nota-service', data);
        if (response.success) return response.data!;
        throw new Error(response.message);
    },

    update: async (id: string, data: Partial<NotaService>): Promise<NotaService> => {
        const response = await Api.put<NotaService>(`/nota-service/${id}`, data);
        if (response.success) return response.data!;
        throw new Error(response.message);
    },

    delete: async (id: string): Promise<void> => {
        const response = await Api.delete<void>(`/nota-service/${id}`);
        if (!response.success) throw new Error(response.message);
    },

    bulkDelete: async (ids: string[]): Promise<void> => {
        const response = await Api.post<void>('/nota-service/bulk', { ids });
        if (!response.success) throw new Error(response.message);
    },

    getNewIdentifiers: async (): Promise<NewIdentifiers> => {
        const response = await Api.get<NewIdentifiers>('/nota-service/new-identifiers');
        if (response.success) return response.data!;
        throw new Error(response.message);
    }
};