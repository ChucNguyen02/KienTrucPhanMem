import axios, { AxiosError } from "axios";
import type { ApiResponse } from "../types";

export const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080",
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

export const unwrap = <T>(response: { data: ApiResponse<T> }): T => response.data.data;

export const normalizeError = (error: unknown): string => {
    if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ message?: string }>;
        return axiosError.response?.data?.message ?? axiosError.message;
    }

    if (error instanceof Error) {
        return error.message;
    }

    return "Unknown error";
};
