import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-hot-toast";

export const useAuthStore = create((set) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  checkAuth: async () => {
    try {
      const response = await axiosInstance.get("/auth/check");
      set({
        authUser: response.data.data,
      });
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
    console.log("Signing up with data:", data);
    try {
      const response = await axiosInstance.post("/auth/signup", data);
      set({
        authUser: response.data.data,
      });
      toast.success("Account created successfully!");
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
    } catch (err) {
      console.error("Error logging out:", err);
      toast.error("Failed to log out..", err.response?.data?.message || "");
    }
  },
  login: async (data) => {
    set({ isLoggingIn: true });
    console.log("Logging in with data:", data);
    try {
      const response = await axiosInstance.post("/auth/login", data);
      set({
        authUser: response.data.data,
      });
      toast.success("Logged in successfully!");
    } catch (err) {
      console.error("Error logging in:", err);
      toast.error(err.response?.data?.message || "Failed to log in.");
    } finally {
      set({ isLoggingIn: false });
    }
  },
  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    console.log("Updating profile with data:", data);
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
}));
