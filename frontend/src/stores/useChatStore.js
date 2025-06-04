import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/message/user");
      console.log(res.data.data);
      set({ users: res.data.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

    getMessages: async (userId) => {
        set({ isMessagesLoading: true });
        try {
        const res = await axiosInstance.get(`/message/${userId}`);
        set({ messages: res.data.data, selectedUser: userId });
        } catch (error) {
        toast.error(error.response?.data?.message);
        } finally {
        set({ isMessagesLoading: false });
        }
    },
  setSelectedUser: (userId) => {
    set({ selectedUser: userId});
  }
}));