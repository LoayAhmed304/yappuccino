export const openMediaDevices = async (constraints) => {
  return await navigator.mediaDevices.getUserMedia(constraints);
};

export const openDisplayStream = async (constraints) => {
  return await navigator.mediaDevices.getDisplayMedia(constraints);
};

export const getAllUserDevices = async (filter) => {
  const filteredDevices = await navigator.mediaDevices.enumerateDevices();
  return filteredDevices.filter((device) => device.kind === filter);
};

export const streamConstraints = {
  video: {
    width: 1280,
    height: 720,
  },
};

// const iceServers = [
//   { urls: "stun:stun.l.google.com:19302" },
//   { urls: "stun:stun.l.google.com:5349" },
//   { urls: "stun:stun1.l.google.com:3478" },
//   { urls: "stun:stun1.l.google.com:5349" },
//   { urls: "stun:stun2.l.google.com:19302" },
// ];
// const config = { iceServers: iceServers };

// const peerConnection = new RTCPeerConnection(config);

// signalingChannel.on("message", async (msg) => {
//   if (msg.answer) {
//     const remoteDesc = new RTCSessionDescription(msg.answer);
//     await peerConnection.setRemoteDescription(remoteDesc);
//   }
// });

// const offer = await peerConnection.createOffer();
// await peerConnection.setLocalDescription(offer);

// signalingChannel.emit({ offer: offer });

// setTimeout(() => console.log("pCon:", peerConnection), 4000);
