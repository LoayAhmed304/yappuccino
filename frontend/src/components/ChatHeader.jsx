import React from "react";
import { useChatStore } from "../stores/useChatStore";
import { useAuthStore } from "../stores/useAuthStore";
import { X, Phone, Video } from "lucide-react";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser, makeCall } = useChatStore();
  const { onlineUsers } = useAuthStore();

  const handleCall = async (e, voice) => {
    e.preventDefault();
    makeCall(voice);
  };

  return (
    <div className="border-b border-base-300 p-2 flex items-center gap-3">
      <img
        src={(selectedUser && selectedUser.profilePic) || "/avatar.png"}
        alt="User Avatar"
        className="size-12 object-cover rounded-full"
      />
      <div className="flex flex-col">
        <span className="font-medium">{selectedUser?.fullName}</span>
        <span className="text-sm text-zinc-400">
          {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
        </span>
      </div>
      <div className="ml-auto flex justify-between gap-10">
        {onlineUsers.includes(selectedUser._id) && (
          <button
            onClick={(e) => handleCall(e, false)}
            className="text-primary hover:text-success"
          >
            <Video className="w-7 h-7" />
          </button>
        )}
        {onlineUsers.includes(selectedUser._id) && (
          <button
            onClick={(e) => handleCall(e, true)}
            className="text-primary hover:text-success"
          >
            <Phone />
          </button>
        )}

        {/* Close Button */}
        <button
          onClick={() => {
            setSelectedUser(null);
          }}
          className="text-error/40 hover:text-error transition-colors"
        >
          <X />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
