import { Stock } from '@/types/stock';
import Api from './Api';

export const StockAPI = {
    getAll: async (): Promise<Stock[]> => {
        const response = await Api.get<Stock[]>('/stocks');
        if (response.success) return response.data!;
        throw new Error(response.message);
    },

    getOne: async (id: string): Promise<Stock> => {
        const response = await Api.get<Stock>(`/stocks/${id}`);
        if (response.success) return response.data!;
        throw new Error(response.message);
    },

    create: async (data: Omit<Stock, 'ID'>): Promise<Stock> => {
        const response = await Api.post<Stock>('/stocks', data);
        if (response.success) return response.data!;
        throw new Error(response.message);
    },

    update: async (id: string, data: Partial<Stock>): Promise<Stock> => {
        const response = await Api.put<Stock>(`/stocks/${id}`, data);
        if (response.success) return response.data!;
        throw new Error(response.message);
    },

    delete: async (id: string): Promise<void> => {
        const response = await Api.delete<void>(`/stocks/${id}`);
        if (!response.success) throw new Error(response.message);
    },

    bulkDelete: async (ids: string[]): Promise<void> => {
        const response = await Api.post<void>(`/stocks/bulk-destroy`, { ids });
        if (!response.success) throw new Error(response.message);
    },

    getNewKode: async (): Promise<string> => {
        const response = await Api.get<{ kode: string }>('/stocks/new-kode');
        if (response.success) return response.data!.kode;
        throw new Error(response.message);
    },
};