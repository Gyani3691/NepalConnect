import SimplePeer from 'simple-peer'

// Basic wrapper demonstrating using Gun for signaling would be added here.
// This module provides a createCall function that uses simple-peer and a
// user-provided signaling transport (like Gun) to exchange offers/answers.

export function createPeer(isInitiator, signalingSend, onStream, onSignal){
  const peer = new SimplePeer({ initiator: isInitiator, trickle: false })
  peer.on('signal', data => {
    // send signal to remote via signalingSend
    signalingSend(data)
    onSignal && onSignal(data)
  })
  peer.on('stream', stream => {
    onStream && onStream(stream)
  })
  return peer
}

export function attachLocalStream(peer, mediaStream){
  mediaStream.getTracks().forEach(t => peer.addTrack(t, mediaStream))
}
