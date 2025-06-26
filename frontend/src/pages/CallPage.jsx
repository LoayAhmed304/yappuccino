import { useEffect } from "react";
import { useChatStore } from "../stores/useChatStore";
import { PhoneOff } from "lucide-react";

const CallPage = ({ fullName, profilePic, voice }) => {
  const { peerConnection, cleanupCall, localStream, remoteStream } =
    useChatStore();

  const handleEndCall = (e) => {
    e.preventDefault();
    useChatStore.getState().handleEndCall();
  };

  useEffect(() => {
    return () => {
      cleanupCall();
    };
  }, []);

  useEffect(() => {
    const localElement = document.getElementById("localElement");
    if (localElement && localStream) {
      localElement.srcObject = localStream;
    }

    const remoteElement = document.getElementById("remoteElement");
    if (remoteElement && remoteStream) {
      remoteElement.srcObject = remoteStream;
    }
  }, [localStream, remoteStream]);

  useEffect(() => {
    if (!peerConnection) {
      cleanupCall();
      console.error("Peer connection is not established. Cleaning up call.");
    }
  }, [peerConnection]);

  return (
    <div className="w-full h-[calc(100vh-2rem)] flex flex-col items-center justify-center px-4 py-6 mt-5">
      <div className="relative w-full max-w-6xl md:h-140 aspect-video bg-black rounded-lg shadow-lg overflow-clip flex items-center justify-center">
        {/* Video Call */}

        <video
          id="remoteElement"
          autoPlay
          className={`w-full h-full object-cover${voice ? " hidden" : ""}`}
        ></video>
        <video
          id="localElement"
          autoPlay
          muted
          className={`absolute bottom-4 right-4 w-32 h-20 sm:w-40 sm:h-24 md:w-52 md:h-32 rounded border-2 border-white shadow-md object-cover z-10${
            voice ? " hidden" : ""
          }`}
        ></video>

        {/* Voice Call */}
        {voice && (
          <div className="flex flex-col items-center justify-center text-white space-y-4">
            <img
              src={profilePic || "/avatar.png"}
              alt={fullName}
              className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-white shadow-lg object-cover"
            />
            <p className="text-xl sm:text-2xl font-semibold">
              Call with {fullName}
            </p>
          </div>
        )}

        {/* Hang up button - Desktop */}
        <div className="hidden sm:flex absolute inset-0 justify-center items-end pb-4 opacity-0 hover:opacity-100 transition-opacity z-20">
          <button
            className="btn btn-error text-white shadow-lg"
            onClick={handleEndCall}
          >
            <PhoneOff className="size-6" />
          </button>
        </div>

        {!voice && (
          <div className="absolute top-3 left-4 text-white text-sm sm:text-base font-medium drop-shadow z-20">
            Call with {fullName}
          </div>
        )}
      </div>

      {/* Hang up button - Mobile */}
      <div className="sm:hidden mt-6">
        <button
          className="btn btn-error text-white shadow-lg px-8 py-3"
          onClick={handleEndCall}
        >
          <PhoneOff className="size-5 mr-2" />
          End Call
        </button>
      </div>
    </div>
  );
};

export default CallPage;
