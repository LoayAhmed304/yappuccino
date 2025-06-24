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
    <div className="bg-base-100/80 backdrop-blur-lg border-b border-base-300/40 p-3">
      <div className="flex items-center gap-5">
        {/* Avatar section */}
        <div className="relative shrink-0">
          <div className="relative">
            <img
              src={(selectedUser && selectedUser.profilePic) || "/avatar.png"}
              alt="User Avatar"
              className="size-10 object-cover rounded-2xl ring-2 ring-base-300/50 shadow-sm"
            />
            {/* Online indicator */}
            {onlineUsers.includes(selectedUser._id) && (
              <div className="absolute -bottom-1 -right-1">
                <div className="size-4 bg-green-500 rounded-full ring-2 ring-base-100 flex items-center justify-center">
                  <div className="size-2 bg-white rounded-full animate-pulse"></div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* User info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-md text-base-content truncate mb-0.5">
            {selectedUser?.fullName}
          </h3>
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                onlineUsers.includes(selectedUser._id)
                  ? "bg-green-500 animate-pulse"
                  : "bg-gray-400"
              }`}
            ></div>
            <span className="text-xs text-zinc-500 font-medium">
              {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-3">
          {onlineUsers.includes(selectedUser._id) && (
            <>
              {/* Video call button */}
              <button
                onClick={(e) => handleCall(e, false)}
                className="group relative p-2 rounded-2xl bg-base-200/50 hover:bg-primary/10 transition-all duration-200 hover:scale-105"
                title="Video call"
              >
                <Video className="w-6 h-6 text-primary group-hover:text-primary transition-colors" />
                <div className="absolute inset-0 rounded-2xl ring-1 ring-transparent group-hover:ring-primary/20 transition-all duration-200"></div>
              </button>

              {/* Voice call button */}
              <button
                onClick={(e) => handleCall(e, true)}
                className="group relative p-2 rounded-2xl bg-base-200/50 hover:bg-primary/10 transition-all duration-200 hover:scale-105"
                title="Voice call"
              >
                <Phone className="w-6 h-6 text-primary group-hover:text-primary transition-colors" />
                <div className="absolute inset-0 rounded-2xl ring-1 ring-transparent group-hover:ring-primary/20 transition-all duration-200"></div>
              </button>
            </>
          )}

          {/* Close button */}
          <button
            onClick={() => setSelectedUser(null)}
            className="group relative p-2 rounded-2xl bg-base-200/50 hover:bg-error/10 transition-all duration-200 hover:scale-105"
            title="Close chat"
          >
            <X className="w-6 h-6 text-error/60 group-hover:text-error transition-colors" />
            <div className="absolute inset-0 rounded-2xl ring-1 ring-transparent group-hover:ring-error/20 transition-all duration-200"></div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
