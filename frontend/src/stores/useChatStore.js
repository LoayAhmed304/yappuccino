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
      set({ messages: res.data.data.messages || [] });
    } catch (error) {
      toast.error(error.response?.data?.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },
  setSelectedUser: (userId) => {
    set({ selectedUser: userId });
  },
  sendMessage: async (messageData) => {
    const { messages, selectedUser } = get();
    try {
      const response = await axiosInstance.post(
        `/message/send/${selectedUser._id}`,
        messageData
      );
      const currentMessages = Array.isArray(messages) ? messages : [];
      console.log(currentMessages);
      set({
        messages: [...currentMessages, response.data.data.newMessage],
      });
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to send message.");
    }
  },
}));
