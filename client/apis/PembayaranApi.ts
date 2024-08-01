import { Pembayaran } from "@/types/notaservice";
import Api from "./Api";

interface NewIdentifiers {
    FAKTUR: string;
}

export const PembayaranAPI = {
    getAll: async (): Promise<Pembayaran[]> => {
        const response = await Api.get<Pembayaran[]>('/pembayaran');
        if (response.success) return response.data!;
        throw new Error(response.message);
    },

    getOne: async (id: string): Promise<Pembayaran> => {
        const response = await Api.get<Pembayaran>(`/pembayaran/${id}`);
        if (response.success) return response.data!;
        throw new Error(response.message);
    },

    getServices: async (): Promise<Pembayaran[]> => {
        const response = await Api.get<Pembayaran[]>('/pembayaran/services');
        if (response.success) return response.data!;
        throw new Error(response.message);
    },

    create: async (data: Omit<Pembayaran, 'ID'>): Promise<Pembayaran> => {
        const response = await Api.post<Pembayaran>('/pembayaran', data);
        if (response.success) return response.data!;
        throw new Error(response.message);
    },

    update: async (id: string, data: Partial<Pembayaran>): Promise<Pembayaran> => {
        const response = await Api.put<Pembayaran>(`/pembayaran/${id}`, data);
        if (response.success) return response.data!;
        throw new Error(response.message);
    },

    delete: async (id: string): Promise<void> => {
        const response = await Api.delete<void>(`/pembayaran/${id}`);
        if (!response.success) throw new Error(response.message);
    },

    bulkDelete: async (ids: string[]): Promise<void> => {
        const response = await Api.post<void>('/pembayaran/bulk', { ids });
        if (!response.success) throw new Error(response.message);
    },

    getNewIdentifiers: async (): Promise<NewIdentifiers> => {
        const response = await Api.get<NewIdentifiers>('/pembayaran/new-identifiers');
        if (response.success) return response.data!;
        throw new Error(response.message);
    }
};