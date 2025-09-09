import React, { useContext, useEffect, useState, useRef } from 'react'
import { GunContext } from '../lib/gun'
import { encryptMessageForPeer, decryptMessageFromPeer, generateAndStoreKeys } from '../lib/encryption'
import { uploadFile } from '../lib/ipfs'

export default function Chat(){
  const gun = useContext(GunContext)
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const messagesRef = useRef(null)

  useEffect(()=>{
    (async()=>{
      await generateAndStoreKeys()
    })()

    const room = gun.get('chat/room/general')
    room.map().on(async (msg, id)=>{
      if(!msg) return
      // try decrypt if encrypted
      let payload = msg
      if(msg.encrypted){
        try{
          payload = await decryptMessageFromPeer(msg)
        }catch(e){
          // can't decrypt
          return
        }
      }
      setMessages(prev=>[...prev.filter(m=>m.id!==id), { id, ...payload }])
    })

    return ()=>{
      room.off()
    }
  },[])

  useEffect(()=>{ messagesRef.current?.scrollTo({ top: messagesRef.current.scrollHeight }) },[messages])

  async function send(){
    if(!text) return
    const room = gun.get('chat/room/general')
    const encrypted = await encryptMessageForPeer({ type: 'text', text })
    room.set({ encrypted: true, data: encrypted, ts: Date.now() })
    setText('')
  }

  async function onFile(e){
    const file = e.target.files[0]
    if(!file) return
    const cid = await uploadFile(file)
    const room = gun.get('chat/room/general')
    const encrypted = await encryptMessageForPeer({ type: 'file', name: file.name, cid })
    room.set({ encrypted: true, data: encrypted, ts: Date.now() })
  }

  return (
    <main className="flex-1 flex flex-col">
      <div className="border-b p-4 flex items-center justify-between bg-white dark:bg-gray-800">
        <div>
          <div className="font-semibold">General</div>
          <div className="text-xs text-gray-500">Group chat</div>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1 bg-green-500 text-white rounded">Call</button>
        </div>
      </div>

      <div ref={messagesRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-gray-900">
        {messages.map(m=> (
          <div key={m.id} className="max-w-xl">
            <div className="px-3 py-2 bg-white dark:bg-gray-800 rounded shadow-sm">
              {m.type === 'text' && <div>{m.text}</div>}
              {m.type === 'file' && <div><a className="text-blue-500" href={`https://ipfs.io/ipfs/${m.cid}`} target="_blank" rel="noreferrer">{m.name}</a></div>}
              <div className="text-xs text-gray-400 mt-1">{new Date(m.ts||0).toLocaleString()}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t bg-white dark:bg-gray-800 flex gap-2">
        <input type="file" onChange={onFile} />
        <input value={text} onChange={e=>setText(e.target.value)} className="flex-1 px-3 py-2 rounded border" placeholder="Type a message" />
        <button onClick={send} className="px-4 py-2 bg-blue-600 text-white rounded">Send</button>
      </div>
    </main>
  )
}
