import React from "react";
import { PhoneCall } from "lucide-react";
import { useChatStore } from "../stores/useChatStore";
const RingingPopup = () => {
  return (
    <>
      {/* Component to display "Ringing.." while waiting for response */}
      <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
        <div className="bg-base-100 p-5 rounded-lg shadow-lg text-center flex flex-col  gap-5 items-center">
          <PhoneCall className="animate-ping mt-10 mb-7 w-12 h-12" />
          <h2 className="text-2xl font-semibold mb-10">Ringing...</h2>
          <p className="mb-4 text-lg">
            Waiting for {useChatStore.getState().selectedUser.fullName + " "}
            to answer...
          </p>
        </div>
      </div>
    </>
  );
};

export default RingingPopup;
