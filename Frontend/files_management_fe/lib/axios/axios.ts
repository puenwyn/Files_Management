import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";

const axiosClient: AxiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        "Content-Type": "application/json"
    },
    withCredentials: true
});
console.log("AXIOS CLIENT CREATED");

let isRefreshing = false;

let pendingRequests: Array<{
    resolve: () => void;
    reject: (error: AxiosError) => void;
}> = [];

const processQueue = (error?: AxiosError) => {
    pendingRequests.forEach(({ resolve, reject }) => {
        if (error) {
            reject(error);
        } else {
            resolve();
        }
    });
    pendingRequests = [];
}

axiosClient.interceptors.response.use(
    (response) => {
        console.log("🟢 RESPONSE INTERCEPTOR:", response.config.url);
        return response;
    },

    async (error: AxiosError) => {
        console.log("🔥 RESPONSE INTERCEPTOR", {
            status: error.response?.status,
            url: error.config?.url,
        });
        const originalRequest =
            error.config as InternalAxiosRequestConfig & {
                _retry?: boolean;
            };

        // Không phải 401 → trả lỗi bình thường
        if (error.response?.status !== 401) {
            return Promise.reject(error);
        }

        // Không refresh chính request refresh
        if (originalRequest.url === "/auth/refresh") {
            return Promise.reject(error);
        }

        // Request này đã retry rồi
        if (originalRequest._retry) {
            return Promise.reject(error);
        }

        originalRequest._retry = true;

        // Đang có request khác refresh token
        if (isRefreshing) {
            return new Promise<void>((resolve, reject) => {
                pendingRequests.push({
                    resolve,
                    reject,
                });
            }).then(() => axiosClient(originalRequest));
        }

        isRefreshing = true;

        try {
            await axiosClient.post("/auth/refresh");

            processQueue();

            return axiosClient(originalRequest);
        } catch (refreshError) {
            processQueue(refreshError as AxiosError);

            return Promise.reject(refreshError);
        } finally {
            isRefreshing = false;
        }
    }
);

export default axiosClient;