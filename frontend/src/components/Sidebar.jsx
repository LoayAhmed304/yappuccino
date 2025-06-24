import React from "react";
import { useChatStore } from "../stores/useChatStore";
import { Users } from "lucide-react";
import { useAuthStore } from "../stores/useAuthStore";

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser } = useChatStore();

  const { onlineUsers } = useAuthStore();
  const [onlineFilter, setOnlineFilter] = React.useState(false);

  React.useEffect(() => {
    getUsers();
  }, [getUsers]);
  const filteredUsers = onlineFilter
    ? users.filter((user) => onlineUsers.includes(user._id))
    : users;
  return (
    <aside className="h-full overflow-y-scroll w-full lg:w-80 flex flex-col transition-all duration-300">
      {/* Header */}
      <div className="p-6 border-b border-base-300/40 flex-shrink-0">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-primary/10 rounded-xl">
            <Users className="size-6 text-primary" />
          </div>
          <span className="font-semibold text-base hidden lg:block text-base-content">
            Users
          </span>
        </div>

        {/* Filter */}
        <div className="hidden lg:block">
          <div className="bg-base-200/50 rounded-xl p-3 backdrop-blur-sm border border-base-300/30">
            <label className="cursor-pointer flex items-center gap-2">
              <input
                type="checkbox"
                checked={onlineFilter}
                onChange={(e) => setOnlineFilter(e.target.checked)}
                className="checkbox checkbox-xs checkbox-primary"
              />
              <span className="text-xs font-medium">Show online only</span>
            </label>
            <div className="mt-2 flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-zinc-500">
                {onlineUsers.length - 1 === -1 ? 0 : onlineUsers.length - 1}{" "}
                online now
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Users list*/}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-2 min-h-0">
        {filteredUsers.map((user) => (
          <button
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className={`
              w-full p-3 flex items-center gap-3 rounded-xl
              transition-all duration-200 group relative
              hover:bg-base-300/60 hover:shadow-md hover:scale-[1.01]
              ${
                selectedUser?._id === user._id
                  ? "bg-primary/10 ring-1 ring-primary/30 shadow-md scale-[1.01]"
                  : "bg-base-100/50 hover:bg-base-300/60"
              }
            `}
          >
            {/* Avatar */}
            <div className="relative mx-auto lg:mx-0 shrink-0">
              <div className="relative">
                <img
                  src={user.profilePic || "/avatar.png"}
                  alt={user.name}
                  className="size-10 object-cover rounded-xl ring-1 ring-base-300/50 group-hover:ring-primary/30 transition-all duration-200"
                />
                {onlineUsers.includes(user._id) && (
                  <div className="absolute -bottom-0.5 -right-0.5">
                    <div className="size-3 bg-green-500 rounded-full ring-1 ring-base-100 flex items-center justify-center">
                      <div className="size-1 bg-white rounded-full animate-pulse"></div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* User info */}
            <div className="hidden lg:block text-left min-w-0 flex-1">
              <div className="font-medium text-sm text-base-content truncate mb-0.5">
                {user.fullName}
              </div>
              <div className="flex items-center gap-1.5">
                <div
                  className={`w-1.5 h-1.5 rounded-full ${
                    onlineUsers.includes(user._id)
                      ? "bg-green-500"
                      : "bg-gray-400"
                  }`}
                ></div>
                <span className="text-xs text-zinc-500">
                  {onlineUsers.includes(user._id) ? "Online" : "Offline"}
                </span>
              </div>
            </div>

            {/* Subtle hover indicator */}
            <div className="hidden lg:block opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <div className="w-1 h-6 bg-primary/30 rounded-full"></div>
            </div>
          </button>
        ))}{" "}
        {/* Empty chat */}
        {filteredUsers.length === 0 && (
          <div className="text-center py-8">
            <div className="bg-base-200/50 rounded-2xl p-6 backdrop-blur-sm border border-base-300/30">
              <div className="w-12 h-12 bg-base-300/50 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Users className="size-6 text-base-content/40" />
              </div>
              <p className="text-xs text-zinc-500 font-medium">
                No contacts found
              </p>
              <p className="text-xs text-zinc-400 mt-0.5">
                Try adjusting your filters
              </p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
