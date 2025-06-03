import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3535/api",
  withCredentials:true,
});