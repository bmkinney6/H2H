import axios from "axios";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";

let isRefreshing = false;
let refreshSubscribers: ((newToken: string) => void)[] = [];

const setupAxiosInterceptor = (navigate: (path: string) => void) => {
    axios.interceptors.response.use(
        (response) => response,
        async (error) => {
            const originalRequest = error.config;

            console.log("Axios Error:", error.response);

            if (error.response && error.response.status === 401 && !originalRequest._retry) {
                console.log("Detected 401 Unauthorized. Attempting token refresh...");

                const refreshToken = localStorage.getItem(REFRESH_TOKEN);

                if (!refreshToken) {
                    console.warn("No refresh token found. Redirecting to login...");
                    localStorage.removeItem(ACCESS_TOKEN);
                    localStorage.removeItem(REFRESH_TOKEN);
                    navigate("/login");
                    return Promise.reject(error);
                }

                if (!isRefreshing) {
                    isRefreshing = true;
                    originalRequest._retry = true; // Avoid retrying the same request multiple times

                    try {
                        console.log("Refreshing token...");
                        const response = await axios.post("http://localhost:8000/user/token/refresh", {
                            refresh: refreshToken,
                        });

                        const newAccessToken = response.data.access;
                        localStorage.setItem(ACCESS_TOKEN, newAccessToken);

                        console.log("Token refreshed successfully. Retrying queued requests...");
                        refreshSubscribers.forEach((callback) => callback(newAccessToken));
                        refreshSubscribers = [];
                        isRefreshing = false;

                        // Retry the original request
                        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
                        return axios(originalRequest);
                    } catch (refreshError) {
                        console.error("Token refresh failed:", refreshError);

                        // Clear tokens and redirect to login
                        localStorage.removeItem(ACCESS_TOKEN);
                        localStorage.removeItem(REFRESH_TOKEN);
                        navigate("/login");

                        isRefreshing = false;
                        refreshSubscribers = [];
                        return Promise.reject(refreshError);
                    }
                }

                // Queue the request until the refresh process is complete
                return new Promise((resolve) => {
                    refreshSubscribers.push((newToken: string) => {
                        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
                        resolve(axios(originalRequest));
                    });
                });
            }

            return Promise.reject(error);
        }
    );
};

export default setupAxiosInterceptor;