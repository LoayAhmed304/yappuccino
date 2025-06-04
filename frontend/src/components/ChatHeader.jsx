import React from "react";
import { useChatStore } from "../stores/useChatStore";
import { useAuthStore } from "../stores/useAuthStore";
import { X } from "lucide-react";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();

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
          {onlineUsers.includes(selectedUser) ? "Online" : "Offline"}
        </span>
      </div>
      {/* Close Button */}
      <button
        onClick={() => {
          setSelectedUser(null);
        }}
        className="ml-auto text-zinc-500 hover:text-zinc-700 transition-colors"
      >
        <X />
      </button>
    </div>
  );
};

export default ChatHeader;
