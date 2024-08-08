import { Invoice } from "@/types/invoice";
import Api from "./Api";

export const InvoiceAPI = {
    getAll: async (): Promise<Invoice[]> => {
        const response = await Api.get<Invoice[]>('/invoices');
        if (response.success) return response.data!;
        throw new Error(response.message);
    },

    getOne: async (id: string): Promise<Invoice> => {
        const response = await Api.get<Invoice>(`/invoices/${id}`);
        if (response.success) return response.data!;
        throw new Error(response.message);
    },

    create: async (data: Omit<Invoice, 'id'>): Promise<Invoice> => {
        const response = await Api.post<Invoice>('/invoices', data);
        if (response.success) return response.data!;
        throw new Error(response.message);
    },

    update: async (id: string, data: Partial<Invoice>): Promise<Invoice> => {
        const response = await Api.put<Invoice>(`/invoices/${id}`, data);
        if (response.success) return response.data!;
        throw new Error(response.message);
    },

    delete: async (id: string): Promise<void> => {
        const response = await Api.delete<void>(`/invoices/${id}`);
        if (!response.success) throw new Error(response.message);
    },

    bulkDelete: async (ids: string[]): Promise<void> => {
        const response = await Api.post<void>(`/invoices/bulk`, { ids });
        if (!response.success) throw new Error(response.message);
    },

    getNewIdentifiers: async (): Promise<{ KODE: string }> => {
        const response = await Api.get<{ KODE: string }>('/invoices/new-identifiers');
        if (response.success) return response.data!;
        throw new Error(response.message);
    },
};
