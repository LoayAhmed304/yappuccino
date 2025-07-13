import axios from "axios";

const base = import.meta.env.VITE_API_URL ?? "http://localhost:3535";

export const axiosInstance = axios.create({
  baseURL: base + "/api",

  withCredentials: true,
});
