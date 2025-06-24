import { useNavigate } from "react-router-dom";
import { useChatStore } from "../stores/useChatStore";

const CallPopup = ({ profilePic, fullName, voice }) => {
  const navigate = useNavigate();
  const handleAccept = async () => {
    try {
      await useChatStore.getState().handleAccept();
      navigate("/call");
    } catch (error) {
      console.error("Error accepting call:", error);
    }
  };

  const handleDecline = (e) => {
    e.preventDefault();
    useChatStore.getState().handleDecline();
  };
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-base-100 p-5 rounded-lg shadow-lg text-center">
        <h2 className="text-2xl font-semibold mb-3">
          Incoming {voice ? "Voice " : "Video "}Call
        </h2>
        <img
          src={profilePic || "avatar.png"}
          className="w-60 h-60 mx-auto mb-5 rounded-full object-cover animate-pulse"
        />
        <p className="mb-4 text-lg">{fullName} wants to yap with you!</p>
        <div className="flex justify-center gap-4">
          <button className="btn btn-success" onClick={handleAccept}>
            Accept
          </button>
          <button className="btn btn-error" onClick={handleDecline}>
            Decline
          </button>
        </div>
      </div>
    </div>
  );
};

export default CallPopup;
