import Gun from 'gun'
import SEA from 'gun/sea'
import React from 'react'

const GunContext = React.createContext(null)

function createGun(){
  // Create a reliable peer connection
  const currentUrl = window.location.origin;
  const isRender = currentUrl.includes('render.com');
  
  const peers = [
    'https://nepalconnect-n6xx.onrender.com/gun',
    currentUrl + '/gun',
    'https://gun-manhattan.herokuapp.com/gun'
  ].filter(Boolean);

  console.log('Connecting to peers:', peers);

  const gun = Gun({
    peers,
    localStorage: false,
    radisk: false,
    retry: 500,
    max: Infinity,
    super: false,
    axe: false,
    multicast: false,
    WebSocket: window.WebSocket
  });

  // Add connection monitoring
  gun.on('hi', peer => {
    console.log('Peer connected:', peer);
  });

  gun.on('bye', peer => {
    console.log('Peer disconnected:', peer);
  });
  gun.SEA = SEA
  return { gun, SEA: gun.SEA }
}

// Create a Gun user (username/password). Returns a promise that resolves on success.
function createUser(gun, username, password){
  return new Promise((resolve, reject)=>{
    gun.user().create(username, password, ack=>{
      if(ack.err) return reject(ack.err)
      // After create, automatically authenticate
      gun.user().auth(username, password, authAck=>{
        if(authAck.err) return reject(authAck.err)
        resolve(authAck)
      })
    })
  })
}

function authUser(gun, username, password){
  return new Promise((resolve, reject)=>{
    gun.user().auth(username, password, ack=>{
      if(ack.err) return reject(ack.err)
      resolve(ack)
    })
  })
}

function logout(gun){
  try{ gun.user().leave() }catch(e){}
}

export { GunContext, createGun, createUser, authUser, logout }
