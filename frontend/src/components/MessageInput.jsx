import React from "react";
import { useChatStore } from "../stores/useChatStore";
import { Image, Send, X } from "lucide-react";
import { toast } from "react-hot-toast";

const MessageInput = () => {
  const [text, setText] = React.useState("");
  const [imagePreview, setImagePreview] = React.useState(null);
  const fileInputRef = React.useRef(null);

  const { sendMessage, selectedUser } = useChatStore();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      // 5MB limit example
      toast.error("Image too large. Please select an image under 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
    // Reset the file input
    e.target.value = null;
  };
  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = null;
  };
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) {
      toast.error("Please enter a message or select an image.");
      return;
    }

    if (!selectedUser) {
      toast.error("No user selected to send message to.");
      return;
    }

    try {
      const curText = text.trim();
      setText("");
      await sendMessage({
        text: curText,
        image: imagePreview,
      });
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = null;
    } catch (err) {
      console.error("Error sending message:", err);
      console.log("Error:", err.response);
      console.log("HELLO FROM CATCH");
    }
  };
  return (
    <div className="p-2">
      {/* Image preview */}
      {imagePreview && (
        <div className="mb-2">
          <div className="inline-block relative">
            <div className="relative bg-base-200/30 rounded-3xl p-3 backdrop-blur-sm border border-base-300/30">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-12 h-12 object-cover rounded-2xl shadow-sm"
              />
              <button
                onClick={removeImage}
                className="absolute -top-1 -right-2 w-5 h-5 rounded-full bg-error/80 hover:bg-error text-white flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-sm"
              >
                <X className="size-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Input form */}
      <form onSubmit={handleSendMessage} className="flex items-center gap-3">
        <div className="flex-1 flex items-center gap-3 bg-base-200/40 backdrop-blur-sm rounded-3xl border border-base-300/30 p-2 hover:bg-base-200/60 transition-all duration-200 focus-within:ring-2 focus-within:ring-primary/20">
          {/* Text input */}
          <input
            type="text"
            className="flex-1 bg-transparent border-none outline-none px-1 text-base placeholder:text-zinc-400 text-base-content"
            placeholder="Type your message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          {/* File input */}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          {/* Image upload button */}
          <button
            type="button"
            className={`p-2 rounded-2xl transition-all duration-200 hover:scale-105 ${
              imagePreview
                ? "bg-primary/20 text-primary hover:bg-primary/30"
                : "bg-base-300/40 text-zinc-400 hover:bg-primary/10 hover:text-primary"
            }`}
            onClick={() => fileInputRef.current?.click()}
            title="Attach image"
          >
            <Image size={20} />
          </button>
        </div>

        {/* Send button */}
        <button
          type="submit"
          className={`p-3 rounded-2xl transition-all duration-200 hover:scale-105 shadow-sm ${
            !text.trim() && !imagePreview
              ? "bg-base-300/40 text-zinc-400 cursor-not-allowed"
              : "bg-primary hover:bg-primary/80 text-primary-content shadow-primary/20"
          }`}
          disabled={!text.trim() && !imagePreview}
          title="Send message"
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
