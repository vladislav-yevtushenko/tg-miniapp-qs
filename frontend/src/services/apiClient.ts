import axios from "axios";

export const apiClient = axios.create({
  baseURL: "",
  timeout: 10_000,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      return Promise.reject({
        status: error.response.status,
        message: error.response.data?.detail ?? "Unknown error",
      });
    }
    return Promise.reject(error);
  },
);
