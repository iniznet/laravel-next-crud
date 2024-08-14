import { QueueState, QueueUpdateProps } from "@/types/queue";
import Api from "./Api";

export const QueueAPI = {
    status: async (): Promise<QueueState> => {
        const response = await Api.get<QueueState>('/queue');
        if (response.success) return response.data!;
        throw new Error(response.message);
    },

    update: async (data: Partial<QueueUpdateProps>): Promise<QueueUpdateProps> => {
        const response = await Api.put<QueueUpdateProps>(`/queue`, data);
        if (response.success) return response.data!;
        throw new Error(response.message);
    },
};
