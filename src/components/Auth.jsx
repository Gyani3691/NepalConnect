import React, { useState, useContext } from 'react'
import { createUser, authUser } from '../lib/gun'
import { GunContext } from '../lib/gun'

export default function Auth({ onAuth }){
  const gun = useContext(GunContext)
  const [mode, setMode] = useState('login')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [connectionStatus, setConnectionStatus] = useState('checking')

  // Add connection monitoring
  useEffect(() => {
    if (!gun?.gun) return;
    setConnectionStatus('connecting')
    
    const checkConnection = () => {
      gun.gun.on('hi', peer => {
        setConnectionStatus('connected')
        setError(null)
      })
      gun.gun.on('bye', peer => {
        setConnectionStatus('reconnecting')
      })
    }
    
    checkConnection()
    const interval = setInterval(checkConnection, 2000)
    return () => clearInterval(interval)
  }, [gun])

  async function submit(e){
    e.preventDefault()
    if (connectionStatus !== 'connected') {
      setError('Please wait for connection to establish...')
      return
    }
    setLoading(true)
    setError(null)
    try{
      if(mode==='signup'){
        await createUser(gun.gun, username, password)
      }else{
        await authUser(gun.gun, username, password)
      }
      onAuth && onAuth(username)
    }catch(err){
      setError(String(err))
    }finally{ 
      setLoading(false)
    }
  }

  return (
    <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <form onSubmit={submit} className="w-full max-w-md p-6 bg-white dark:bg-gray-800 rounded shadow">
        <h2 className="text-2xl mb-4">{mode==='signup' ? 'Create account' : 'Login'}</h2>
        <div className={`text-sm mb-4 ${
          connectionStatus === 'connected' ? 'text-green-500' : 
          connectionStatus === 'connecting' ? 'text-yellow-500' : 
          'text-blue-500'
        }`}>
          {connectionStatus === 'connected' ? '✓ Connected to network' :
           connectionStatus === 'connecting' ? '⟳ Connecting to network...' :
           '⟳ Reconnecting...'}
        </div>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <label className="block mb-2">Username
          <input value={username} onChange={e=>setUsername(e.target.value)} className="w-full mt-1 px-3 py-2 rounded border" />
        </label>
        <label className="block mb-4">Password
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full mt-1 px-3 py-2 rounded border" />
        </label>
        <div className="flex items-center justify-between">
          <button disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">{loading ? 'Please wait...' : (mode==='signup' ? 'Create' : 'Login')}</button>
          <button type="button" className="text-sm text-gray-500" onClick={()=>setMode(mode==='signup'?'login':'signup')}>{mode==='signup' ? 'Have an account? Login' : 'Create an account'}</button>
        </div>
      </form>
    </div>
  )
}
