import React, { useEffect, useState } from 'react'
import Sidebar from './components/Sidebar'
import Chat from './components/Chat'
import Auth from './components/Auth'
import { GunContext, createGun } from './lib/gun'

export default function App(){
  const [gunApp, setGunApp] = useState(null)
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('nc_user')
    return saved ? JSON.parse(saved) : null
  })

  useEffect(()=>{
    const g = createGun()
    setGunApp(g)

    // register service worker for PWA if available
    if('serviceWorker' in navigator){
      navigator.serviceWorker.register('/sw.js').catch(()=>{})
    }
  },[])

  if(!gunApp) return <div className="h-screen flex items-center justify-center">Starting Nepal Connect...</div>

  return (
    <GunContext.Provider value={gunApp}>
      {user ? (
        <div className="h-screen flex bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
          <Sidebar currentUser={user} onLogout={() => {
            localStorage.removeItem('nc_user')
            setUser(null)
            if(gunApp) gunApp.gun.user().leave()
          }} />
          <Chat />
        </div>
      ) : (
        <Auth onAuth={u => {
          localStorage.setItem('nc_user', JSON.stringify(u))
          setUser(u)
        }} />
      )}
    </GunContext.Provider>
  )
}
