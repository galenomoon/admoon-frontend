import axios from "axios";
import { parseCookies } from "nookies";

const api_client = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

api_client.interceptors.request.use(
  (config) => {
    const { token } = parseCookies()
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    Promise.reject(error)
  }
);

export default api_client;