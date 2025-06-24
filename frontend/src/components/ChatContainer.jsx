import React from "react";
import { useChatStore } from "../stores/useChatStore";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../stores/useAuthStore";

const ChatContainer = () => {
  const {
    selectedUser,
    isMessagesLoading,
    messages,
    getMessages,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = React.useRef(null);

  React.useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser._id);
      subscribeToMessages();
    }
    return () => unsubscribeFromMessages();
  }, [
    selectedUser,
    getMessages,
    subscribeToMessages,
    unsubscribeFromMessages,
    authUser,
  ]);

  React.useEffect(() => {
    if (messageEndRef.current && messages.length > 0)
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col h-full max-h-full overflow-scroll">
        <div className="flex-shrink-0">
          <ChatHeader />
        </div>
        <div className="flex-1 bg-gradient-to-b from-base-50/50 to-base-100/50 backdrop-blur-sm min-h-0">
          <MessageSkeleton />
        </div>
        <div className="bg-base-100/80 backdrop-blur-sm border-t border-base-300/40 flex-shrink-0">
          <MessageInput />
        </div>
      </div>
    );
  }
  return (
    <div className="flex-1 flex flex-col h-full max-h-full">
      <div className="flex-shrink-0">
        <ChatHeader />
      </div>
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto bg-gradient-to-b from-base-50/30 to-base-100/50 backdrop-blur-sm min-h-0">
        <div className="p-6 space-y-4">
          {messages.map((message, index) => (
            <div
              key={message._id}
              className={`flex ${
                message.senderId === authUser._id
                  ? "justify-end"
                  : "justify-start"
              } group`}
              ref={index === messages.length - 1 ? messageEndRef : null}
            >
              <div
                className={`flex items-end gap-4 max-w-[75%] ${
                  message.senderId === authUser._id
                    ? "flex-row-reverse"
                    : "flex-row"
                }`}
              >
                {/* Avatar */}
                <div className="shrink-0 mb-1">
                  <div className="relative">
                    <img
                      src={
                        message.senderId === authUser._id
                          ? authUser.profilePic || "/avatar.png"
                          : selectedUser.profilePic || "/avatar.png"
                      }
                      alt="profile pic"
                      className="size-10 object-cover rounded-2xl ring-2 ring-base-300/30 shadow-sm"
                    />
                  </div>
                </div>

                {/* Message bubble */}
                <div
                  className={`flex flex-col ${
                    message.senderId === authUser._id
                      ? "items-end"
                      : "items-start"
                  }`}
                >
                  {/* Timestamp */}
                  <div
                    className={`text-xs text-zinc-400 mb-2 px-1 ${
                      message.senderId === authUser._id
                        ? "text-right"
                        : "text-left"
                    }`}
                  >
                    {message.createdAt
                      .split("T")[1]
                      .split(".")[0]
                      .split(":")
                      .slice(0, 2)
                      .join(":")}
                  </div>

                  {/* Message content */}
                  <div
                    className={`
                    relative p-2.5 rounded-2xl shadow-sm backdrop-blur-sm border
                    transition-all duration-200 group-hover:shadow-md
                    ${
                      message.senderId === authUser._id
                        ? "bg-primary/10 border-primary/20 text-base-content"
                        : "bg-base-100/80 border-base-300/40 text-base-content"
                    }
                  `}
                  >
                    {/* Image content */}
                    {message.image && (
                      <div className="mb-3">
                        <img
                          src={message.image}
                          alt="Attachment"
                          className="max-w-[100px] rounded-xl shadow-sm border border-base-300/30"
                        />
                      </div>
                    )}

                    {/* Text content */}
                    {message.text && (
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {message.text}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Empty chat */}
          {messages.length === 0 && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center py-1">
                <div className="bg-base-200/30 rounded-3xl p-8 backdrop-blur-sm border border-base-300/30">
                  <div className="w-16 h-16 bg-base-300/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <div className="w-8 h-8 bg-primary/20 rounded-lg"></div>
                  </div>
                  <p className="text-sm text-zinc-500 font-medium">
                    Start your conversation
                  </p>
                  <p className="text-xs text-zinc-400 mt-1">
                    Send a message to begin
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>{" "}
      {/* Message input area */}
      <div className="bg-base-100/80 backdrop-blur-sm border-t border-base-300/40 flex-shrink-0">
        <MessageInput />
      </div>
    </div>
  );
};

export default ChatContainer;
