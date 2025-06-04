import React from "react";
import { useChatStore } from "../stores/useChatStore";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../stores/useAuthStore";

const ChatContainer = () => {
  const { selectedUser, isMessagesLoading, messages, getMessages } =
    useChatStore();
  const { authUser } = useAuthStore();

  React.useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser._id);
    }
    console.log("current", authUser);
  }, [selectedUser, getMessages]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat ${
              message.senderId === authUser._id ? "chat-end" : "chat-start"
            }`}
          >
            <div className="chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message.senderId === authUser._id
                      ? authUser.profilePic || "/avatar.png"
                      : selectedUser.profilePic || "/avatar.png"
                  }
                  alt="profile pic"
                />
              </div>
            </div>
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {message.createdAt
                  .split("T")[1]
                  .split(".")[0]
                  .split(":")
                  .slice(0, 2)
                  .join(":")}
              </time>
            </div>
            <div className="chat-bubble flex-1 flex-row gap-1">
              {message.image && (
                <div className="chat-image">
                  <img
                    src={message.image}
                    alt="Attachment"
                    className="sm:max-w-[200px] rounded-md mb-2"
                  />
                </div>
              )}
              {message.text && <p>{message.text}</p>}
            </div>
          </div>
        ))}
      </div>
      <MessageInput />
    </div>
  );
};

export default ChatContainer;
