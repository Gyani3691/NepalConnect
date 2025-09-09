import Gun from 'gun'
import SEA from 'gun/sea'
import React from 'react'

const GunContext = React.createContext(null)

function createGun(){
  // Use WebSocket connection for better reliability
  const peers = [
    'wss://nepalconnect-n6xx.onrender.com/gun',
    window.location.origin.replace('http', 'ws') + '/gun'
  ].filter(Boolean);

  const gun = Gun({
    peers,
    localStorage: false,
    radisk: false,
    retry: 1000,
    max: 3,
    super: false,
    axe: false,
    multicast: false,
    WebSocket: window.WebSocket
  })
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
