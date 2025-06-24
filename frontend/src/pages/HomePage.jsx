import { useEffect, useRef } from "react";
import { useChatStore } from "../stores/useChatStore";
import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";
import { useNavigate } from "react-router-dom";
import CallPopup from "../components/CallPopup";
import RingingPopup from "../components/RingingPopup";

const HomePage = () => {
  const { selectedUser, isRinging, caller, inCall, isCalling, voiceCall } =
    useChatStore();
  const navigate = useNavigate();
  const ringtoneRef = useRef(null);
  useEffect(() => {
    if (!ringtoneRef.current) {
      ringtoneRef.current = new Audio("/ringtone.mp3");
      ringtoneRef.current.loop = true;
    }

    if (isRinging) {
      ringtoneRef.current.play().catch((e) => {
        console.warn(
          "Autoplay failed, user interaction required to play sound",
          e
        );
      });
    } else {
      ringtoneRef.current.pause();
      ringtoneRef.current.currentTime = 0;
    }
  }, [isRinging]);

  useEffect(() => {
    if (inCall) {
      navigate("/call");
    }
  }, [inCall]);
  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 via-base-300 to-base-200">
      {/* Ringing popup */}
      {isRinging && (
        <CallPopup
          profilePic={caller.profilePic}
          fullName={caller.fullName}
          voice={voiceCall}
        />
      )}
      {isCalling && <RingingPopup />}

      {/* Main content */}
      <div className="pt-24 pb-8 px-8 h-full">
        <div className="max-w-7xl mx-auto h-full">
          {/* Header section */}
          <div className="mb-2 mx-auto backdrop-blur-xl bg-base-100/80 rounded-3xl w-100 shadow-2xl border border-base-300/50 p-3">
            <div className="flex flex-col items-center justify-center">
              <div>
                <h1 className="text-2xl font-bold text-base-content mb-2 text-center">
                  Yapping Area
                </h1>
              </div>
            </div>
          </div>{" "}
          {/* Chat interface */}
          <div className="grid grid-cols-12 gap-8 h-[calc(100vh-13rem)]">
            {/* Sidebar */}
            <div className="col-span-12 lg:col-span-4 xl:col-span-3 overflow-hidden">
              <div className="h-full backdrop-blur-xl bg-base-100/90 rounded-3xl shadow-2xl border border-base-300/50 overflow-hidden transform hover:scale-[1.02] transition-all duration-300">
                <Sidebar />
              </div>
            </div>

            {/* Chat area */}
            <div className="col-span-12 lg:col-span-8 xl:col-span-9 overflow-hidden h-full">
              <div className="h-full backdrop-blur-xl bg-base-100/90 rounded-3xl shadow-2xl border border-base-300/50 overflow-hidden transform hover:scale-[1.01] transition-all duration-300">
                {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
