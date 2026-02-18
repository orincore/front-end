const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

class ApiClient {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        const url = `${this.baseUrl}${endpoint}`;

        // Get token from localStorage if available
        const token = typeof window !== 'undefined' ? localStorage.getItem('vle_token') : null;

        const headers = {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...options.headers,
        };

        const response = await fetch(url, {
            ...options,
            headers,
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }

        return response.json();
    }

    get<T>(endpoint: string, options: RequestInit = {}) {
        return this.request<T>(endpoint, { ...options, method: "GET" });
    }

    post<T>(endpoint: string, data?: any, options: RequestInit = {}) {
        return this.request<T>(endpoint, {
            ...options,
            method: "POST",
            body: JSON.stringify(data),
        });
    }

    put<T>(endpoint: string, data?: any, options: RequestInit = {}) {
        return this.request<T>(endpoint, {
            ...options,
            method: "PUT",
            body: JSON.stringify(data),
        });
    }

    delete<T>(endpoint: string, options: RequestInit = {}) {
        return this.request<T>(endpoint, { ...options, method: "DELETE" });
    }
}

export const api = new ApiClient(API_URL);
