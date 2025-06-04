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
    if (!file) return; // Add this check to prevent errors if no file is selected
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file.");
      return;
    }

    // Consider adding file size check
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
    // Reset the file input for future uploads
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
      await sendMessage({
        text: text.trim(),
        image: imagePreview,
      });
      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = null;
    } catch (err) {
      console.error("Error sending message:", err);
      console.log("Error:", err.response);
      console.log("HELLO FROM CATCH");
    }
  };

  return (
    <div className="p-4 w-full">
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300 flex items-center justify-center"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}
      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            className="w-full input input-bordered rounded-lg input-sm sm:input-md"
            placeholder="Yap..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />
          <button
            type="button"
            className={`hidden sm:flex btn btn-circle ${
              imagePreview ? "text-emerald-500" : "text-zinc-400"
            }`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={20} />
          </button>
        </div>
        <button
          type="submit"
          className="btn btn-sm btn-circle"
          disabled={!text.trim() && !imagePreview}
        >
          <Send size={22} />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
