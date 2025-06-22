import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";
import { io } from "socket.io-client";
import { openMediaDevices } from "../lib/utils";
import { useNavigate } from "react-router-dom";

const iceServers = [
  { urls: "stun:stun.l.google.com:19302" },
  { urls: "stun:stun.l.google.com:5349" },
  { urls: "stun:stun1.l.google.com:3478" },
];

const SIG_URL = "http://localhost:3000";
export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  peerConnection: null,
  rmeoteStream: null,
  localStream: null,
  signalingSocket: null,
  isRinging: false,
  isCalling: false,
  caller: null,
  inCall: false,
  voiceCall: false,

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

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;
    const socket = useAuthStore.getState().socket;

    socket.on("newMessage", (data) => {
      if (data.senderId !== selectedUser._id) return;
      set({ messages: [...get().messages, data] });
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;

    socket.off("newMessage");
  },

  initPeerConnection: () => {
    const pc = new RTCPeerConnection({ iceServers: iceServers });
    pc.onicecandidate = (event) => {
      console.log("ICE candidate event:", event);
      if (event.candidate) {
        const ss = get().signalingSocket;
        ss.emit("ice-candidate", {
          candidate: event.candidate,
          to: get().selectedUser?._id,
        });
      }
    };

    const remoteStream = get().remoteStream || new MediaStream();
    pc.ontrack = (event) => {
      event.streams[0].getTracks().forEach((track) => {
        remoteStream.addTrack(track);
      });
      console.log("Remote stream received:", remoteStream);
    };

    pc.onconnectionstatechange = () => {
      const state = pc.connectionState;
      if (["disconnected", "failed", "closed"].includes(state)) {
        get().cleanupCall();
        set({
          peerConnection: null,
          remoteStream: null,
          localStream: null,
          isRinging: false,
          caller: null,
          inCall: false,
          isCalling: false,
        });
      }
    };

    set({ peerConnection: pc, remoteStream });
  },

  // Get user media (audio and video) and set to the peer connection local stream tracks.
  getUserMedia: async (voice) => {
    set({ voiceChat: voice });
    try {
      let config;
      if (voice) {
        config = {
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
        };
      } else {
        config = {
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            frameRate: { ideal: 30, max: 60 },
          },
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
            sampleRate: 48000,
            channelCount: 1,
          },
        };
      }
      const localStream = await openMediaDevices(config);
      set({ localStream });
      console.log("Local stream obtained:", localStream);

      const pc = get().peerConnection;
      if (pc) {
        localStream
          .getTracks()
          .forEach((track) => pc.addTrack(track, localStream));
      }
      set({ peerConnection: pc });
    } catch (error) {
      console.error("Error accessing media devices:", error);
      toast.error("Failed to access media devices.");
      return null;
    }
  },

  makeCall: async (voice) => {
    try {
      get().initPeerConnection();

      await get().getUserMedia(voice);

      set({ isCalling: true });

      const offer = await get().peerConnection.createOffer();
      await get().peerConnection.setLocalDescription(offer);

      const ss = get().signalingSocket;
      ss.emit("offer", {
        offer: offer,
        target: get().selectedUser?._id,
        caller: useAuthStore.getState().authUser,
      });
    } catch (err) {
      console.error("Error making call:", err);
      toast.error("Failed to make call.");
      set({ isCalling: false });
    }
  },

  connectToSocket: () => {
    const { authUser } = useAuthStore.getState();
    if (!authUser || get().signalingSocket?.connected) {
      console.log(
        "Cannot connect to socket, no authenticated user or already connected."
      );
      return;
    }
    const ss = io(SIG_URL, { query: { userId: authUser._id } });
    ss.connect();

    ss.on("call-ended", () => {
      get().cleanupCall();
      get().peerConnection?.close();

      set({
        peerConnection: null,
        remoteStream: null,
        localStream: null,
        isRinging: false,
        caller: null,
        inCall: false,
        isCalling: false,
      });
      toast.success("Call ended successfully.");
    });

    ss.on("call-declined", () => {
      get().cleanupCall();
      get().peerConnection?.close();

      set({
        peerConnection: null,
        isRinging: false,
        caller: null,
        inCall: false,
        isCalling: false,
      });
      toast.error(`User doesn't want to yap with you.`);
    });
    ss.on("offer", async ({ offer, caller }) => {
      get().initPeerConnection();

      const pc = get().peerConnection;
      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      const sdp = offer.sdp;

      set({ isRinging: true, caller, voiceCall: !sdp.includes("m=video") });
    });

    ss.on("ice-candidate", async ({ candidate }) => {
      try {
        const peerConnection = get().peerConnection;
        await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (err) {
        console.error("Error adding ICE candidate:", err);
      }
    });

    ss.on("answer", async (answer) => {
      const pc = get().peerConnection;
      if (!pc) return;

      await pc.setRemoteDescription(new RTCSessionDescription(answer));
      set({ inCall: true, isCalling: false, caller: get().selectedUser });
      console.log("Call answered!, inCall", get().inCall);
    });

    set({ signalingSocket: ss });
    toast.success("[SIG] Socket:", ss);
  },

  handleAccept: async () => {
    try {
      set({ isRinging: false });
      const ss = get().signalingSocket;
      const pc = get().peerConnection;
      const caller = get().caller;

      if (!pc || !ss || !caller) {
        throw new Error("Peer connection or signaling socket not initialized.");
      }

      await get().getUserMedia(get().voiceCall);

      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      ss.emit("answer", {
        answer: answer,
        target: get().caller?._id,
      });

      set({ isRinging: false, inCall: true });
      return true;
    } catch (error) {
      console.error("Error handling call accept:", error);
      return false;
    }
  },

  handleDecline: () => {
    const ss = get().signalingSocket;
    if (ss) {
      ss.emit("decline-call", {
        target: get().caller?._id,
      });
    }
    get().peerConnection?.close();
    set({
      isRinging: false,
      caller: null,
      inCall: false,
      peerConnection: null,
    });
    toast.error("Call declined.");
  },

  handleEndCall: () => {
    get().cleanupCall();
  },

  cleanupCall: () => {
    const ss = get().signalingSocket;
    if (ss) {
      ss.emit("end-call", {
        target: get().caller?._id,
      });
    }
    get().peerConnection?.close();
    const localStream = get().localStream;
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
    }
    set({
      peerConnection: null,
      remoteStream: null,
      localStream: null,
      isRinging: false,
      caller: null,
      inCall: false,
    });
  },
}));
