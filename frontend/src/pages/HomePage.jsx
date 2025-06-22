import { useChatStore } from "../stores/useChatStore";
import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";
import { PhoneCall } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CallPopup from "../components/CallPopup";
import RingingPopup from "../components/RingingPopup";
import { useEffect } from "react";

const HomePage = () => {
  const { selectedUser, isRinging, caller, inCall, isCalling } = useChatStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (inCall) {
      navigate("/call");
    }
  }, [inCall]);
  return (
    <div className="h-screen bg-base-200">
      {/* Ringing popup at the center */}
      {isRinging && (
        <CallPopup profilePic={caller.profilePic} fullName={caller.fullName} />
      )}
      {isCalling && <RingingPopup />}

      {/* Main content */}
      <div className="flex items-center justify-center pt-20 px-4">
        <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            <Sidebar />

            {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
