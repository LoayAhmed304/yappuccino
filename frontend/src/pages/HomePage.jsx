import { useEffect, useRef, useState } from "react";
import { useChatStore } from "../stores/useChatStore";
import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";
import { useNavigate } from "react-router-dom";
import CallPopup from "../components/CallPopup";
import RingingPopup from "../components/RingingPopup";
import { Menu, X } from "lucide-react";

const HomePage = () => {
  const { selectedUser, isRinging, caller, inCall, isCalling, voiceCall } =
    useChatStore();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const ringtoneRef = useRef(null);
  const calltoneRef = useRef(null);

  useEffect(() => {
    if (!calltoneRef.current) {
      calltoneRef.current = new Audio("/outgoingtone.mp3");
      calltoneRef.current.loop = true;
    }
    if (isCalling) {
      calltoneRef.current.play().catch((e) => {
        console.warn(
          "Autoplay failed, user interaction required to play sound",
          e
        );
      });
    } else {
      calltoneRef.current.pause();
      calltoneRef.current.currentTime = 0;
    }
  }, [isCalling]);

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
    if (!calltoneRef.current) {
      calltoneRef.current = new Audio("/outgoingtone.mp3");
      calltoneRef.current.loop = true;
    }
    if (isCalling) {
      calltoneRef.current.play().catch((e) => {
        console.warn(
          "Autoplay failed, user interaction required to play sound",
          e
        );
      });
    } else {
      calltoneRef.current.pause();
      calltoneRef.current.currentTime = 0;
    }
  }, [isCalling]);

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
    if (!calltoneRef.current) {
      calltoneRef.current = new Audio("/outgoingtone.mp3");
      calltoneRef.current.loop = true;
    }
    if (isCalling) {
      calltoneRef.current.play().catch((e) => {
        console.warn(
          "Autoplay failed, user interaction required to play sound",
          e
        );
      });
    } else {
      calltoneRef.current.pause();
      calltoneRef.current.currentTime = 0;
    }
  }, [isCalling]);

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
      <div className="pt-20 sm:pt-24 lg:pt-28 pb-2 sm:pb-4 lg:pb-6 px-2 sm:px-4 lg:px-6 h-full">
        <div className="max-w-7xl mx-auto h-full">
          {/* Header section */}
          <div className="mb-1 sm:mb-2 lg:mb-4 mx-auto backdrop-blur-xl bg-base-100/80 rounded-lg sm:rounded-xl lg:rounded-2xl shadow-lg sm:shadow-xl border border-base-300/50 p-1 sm:p-2 lg:p-3">
            <div className="flex items-center justify-between lg:justify-center">
              {/* Hamburger menu */}
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden p-2 rounded-lg bg-base-200/50 hover:bg-primary/10 transition-all duration-200"
                title="Toggle contacts"
              >
                {isSidebarOpen ? (
                  <X className="size-5" />
                ) : (
                  <Menu className="size-5" />
                )}
              </button>

              <div>
                <h1 className="text-base sm:text-lg lg:text-xl font-bold text-base-content mb-0 sm:mb-1 text-center">
                  🔒 All chat messages are encrypted in the database. You can
                  yap freely and securely.
                </h1>
              </div>

              {/* Spacer for mobile */}
              <div className="lg:hidden w-9"></div>
            </div>
          </div>
          {/* Chat interface */}
          <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-2 sm:gap-4 lg:gap-6 h-[calc(100vh-6rem)] sm:h-[calc(100vh-8rem)] lg:h-[calc(100vh-11rem)]">
            {/* Sidebar */}
            <div
              className={`
              lg:col-span-4 xl:col-span-3 overflow-hidden
              ${isSidebarOpen ? "block" : "hidden"} lg:block
              ${
                isSidebarOpen
                  ? "absolute inset-0 z-30 bg-black/20 backdrop-blur-sm"
                  : ""
              }
              lg:relative lg:bg-transparent lg:backdrop-blur-none lg:z-auto
              lg:h-full
            `}
            >
              <div
                className={`
                h-full backdrop-blur-xl bg-base-100/95 rounded-lg sm:rounded-xl lg:rounded-2xl 
                shadow-lg sm:shadow-xl border border-base-300/50 overflow-hidden 
                transition-all duration-300 hover:shadow-xl lg:hover:scale-[1.01]
                ${isSidebarOpen ? "mx-4 my-4 h-[calc(100%-2rem)]" : ""}
                lg:mx-0 lg:my-0 lg:h-full
              `}
              >
                <Sidebar onClose={() => setIsSidebarOpen(false)} />
              </div>
            </div>

            {/* Chat area */}
            <div
              className={`
              overflow-hidden h-full
              ${
                isSidebarOpen
                  ? "lg:col-span-8 xl:col-span-9"
                  : "col-span-full lg:col-span-8 xl:col-span-9"
              }
            `}
            >
              <div className="h-full backdrop-blur-xl bg-base-100/90 rounded-lg sm:rounded-xl lg:rounded-2xl shadow-lg sm:shadow-xl border border-base-300/50 overflow-hidden transition-all duration-300 hover:shadow-xl lg:hover:scale-[1.01]">
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
