import { useEffect } from "react";
import { openMediaDevices } from "../lib/utils.js"; // Assuming you have a utility to get user media
import { useChatStore } from "../stores/useChatStore";
import { useAuthStore } from "../stores/useAuthStore.js";

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
    if (localElement && localStream) localElement.srcObject = localStream;

    const remoteElement = document.getElementById("remoteElement");
    if (remoteElement && remoteStream) remoteElement.srcObject = remoteStream;
  }, [localStream, remoteStream]);

  useEffect(() => {
    if (!peerConnection) {
      cleanupCall();
      console.error("Peer connection is not established. Cleaning up call.");
    }
  }, [peerConnection]);

  return (
    <div className="h-screen bg-base-200 flex items-center justify-center">
      <div className="bg-base-100 p-5 rounded-lg shadow-lg text-center">
        <h2 className="text-2xl font-semibold mb-3">Call in Progress</h2>
        <img
          src={profilePic || "avatar.png"}
          className="w-60 h-60 mx-auto mb-5 rounded-full object-cover"
          alt={`${fullName}'s profile`}
        />
        <p className="mb-4 text-lg">{fullName} is on the call!</p>
        {/* Make the two video elements */}
        <div className="flex justify-center gap-4 mb-4">
          <video
            id="localElement"
            autoPlay
            muted
            className={
              "w-60 h-60 rounded-lg border-2 border-primary" +
              (voice ? " hidden" : "")
            }
          ></video>
          <video
            id="remoteElement"
            autoPlay
            className={
              "w-60 h-60 rounded-lg border-2 border-secondary" +
              (voice ? " hidden" : "")
            }
          ></video>
        </div>
        <div className="flex justify-center gap-4 mt-4">
          <button className="btn btn-success" onClick={handleEndCall}>
            End Call
          </button>
        </div>
      </div>
    </div>
  );
};

export default CallPage;
