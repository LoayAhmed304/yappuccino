import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-hot-toast";
import { io } from "socket.io-client";
import { useChatStore } from "./useChatStore";

const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3535";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,
  checkAuth: async () => {
    try {
      const response = await axiosInstance.get("/auth/check");
      set({
        authUser: response.data.data,
      });

      get().connectToSocket();
      useChatStore.getState().connectToSocket();
    } catch (err) {
      console.error("Error checking auth:", err);
      set({
        authUser: null,
      });
    } finally {
      set({
        isCheckingAuth: false,
      });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const response = await axiosInstance.post("/auth/signup", data);
      set({
        authUser: response.data.data,
      });
      toast.success("Account created successfully!");

      get().connectToSocket();
      useChatStore.getState().connectToSocket();
    } catch (err) {
      console.error("Error signing up:", err);
      toast.error(err.response?.data?.message || "Failed to create account.");
    } finally {
      set({ isSigningUp: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully!");
      get().disconnectFromSocket();
    } catch (err) {
      console.error("Error logging out:", err);
      toast.error("Failed to log out..", err.response?.data?.message || "");
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const response = await axiosInstance.post("/auth/login", data);
      set({
        authUser: response.data.data,
      });
      toast.success("Logged in successfully!");

      get().connectToSocket();
      useChatStore.getState().connectToSocket();
    } catch (err) {
      console.error("Error logging in:", err);
      toast.error(err.response?.data?.message || "Failed to log in.");
    } finally {
      set({ isLoggingIn: false });
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const response = await axiosInstance.put("/auth/update-profile", data);
      set({
        authUser: response.data.data,
      });
      toast.success("Profile updated successfully!");
    } catch (err) {
      console.error("Error updating profile:", err);
      toast.error(err.response?.data?.message || "Failed to update profile.");
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectToSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) {
      console.log("Cannot connect to socket, no authenticated user.");
      return;
    }

    const socket = io(BASE_URL, { query: { userId: authUser._id } });
    socket.connect();
    set({ socket: socket });

    socket.on("getOnlineUsers", (users) => {
      set({ onlineUsers: users });
    });
  },

  disconnectFromSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },
}));
