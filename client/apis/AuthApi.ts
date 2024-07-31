import { UserData } from "@/types/user";
import Api from "./Api";

export const AuthAPI = {
    login: async (data: UserData) => {
        const response = await Api.post<{ token: string }>('/auth/login', data);
        if (response.success) return response.data;
        throw new Error(response.message);
    },
    register: async (data: UserData) => {
        const response = await Api.post<{ token: string }>('/auth/register', data);
        if (response.success) return response.data;
        throw new Error(response.message);
    },
    authenticated: async () => {
        const response = await Api.get<{ user: UserData }>('/auth');
        if (response.success) return response.data;
        throw new Error(response.message);
    },
};
