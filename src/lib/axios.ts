import axios from "axios";
import { getSession, signOut } from "next-auth/react";
import SERVER_SETTINGS from "./serverSettings";

const BACKEND_URL = SERVER_SETTINGS.BACKEND_URL;

export const axiosClient = axios.create({ baseURL: BACKEND_URL });

axiosClient.interceptors.request.use(
  async (config) => {
    const session = await getSession();
    if (session?.accessToken) {
      config.headers.Authorization = `Bearer ${session.accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Implement your token refresh logic here
        // You might need to create a new API route for token refresh
        const res = await axiosClient.post("/auth/refresh-token");
        if (res.status === 200) {
          // Update the session with the new token
          // You'll need to implement this part
          return axiosClient(originalRequest);
        }
      } catch (err) {
        console.error("Error refreshing token:", err);
        await signOut({ callbackUrl: "/" });
      }
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
