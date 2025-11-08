import axios from "axios";

import { env } from "@/config/env";
import { getInitData } from "./telegram";

export const apiClient = axios.create({
  baseURL: env.apiBaseUrl + "/api/v1",
  timeout: 10_000,
});

// Add Authorization header with Telegram initData to all requests
apiClient.interceptors.request.use(
  (config) => {
    const initData = getInitData();
    if (initData) {
      config.headers.Authorization = initData;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

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
