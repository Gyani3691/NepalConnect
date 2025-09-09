// Uses Web Crypto API for RSA-OAEP and AES-GCM

const KEY_STORAGE = 'nc_keys_v1'

async function generateAndStoreKeys(){
  const existing = localStorage.getItem(KEY_STORAGE)
  if(existing) return JSON.parse(existing)

  // RSA key pair for wrapping symmetric keys
  const rsaKeyPair = await window.crypto.subtle.generateKey(
    { name: 'RSA-OAEP', modulusLength: 2048, publicExponent: new Uint8Array([1,0,1]), hash: 'SHA-256' },
    true,
    ['wrapKey','unwrapKey','encrypt','decrypt']
  )

  // export public
  const publicKey = await window.crypto.subtle.exportKey('spki', rsaKeyPair.publicKey)
  const privateKey = await window.crypto.subtle.exportKey('pkcs8', rsaKeyPair.privateKey)

  const obj = { publicKey: arrayBufferToBase64(publicKey), privateKey: arrayBufferToBase64(privateKey) }
  localStorage.setItem(KEY_STORAGE, JSON.stringify(obj))
  return obj
}

async function getKeyPair(){
  const raw = localStorage.getItem(KEY_STORAGE)
  if(!raw) return await generateAndStoreKeys()
  return JSON.parse(raw)
}

function arrayBufferToBase64(buf){
  const bytes = new Uint8Array(buf)
  let binary = ''
  for(let i=0;i<bytes.byteLength;i++) binary += String.fromCharCode(bytes[i])
  return btoa(binary)
}

function base64ToArrayBuffer(b64){
  const binary = atob(b64)
  const len = binary.length
  const bytes = new Uint8Array(len)
  for(let i=0;i<len;i++) bytes[i] = binary.charCodeAt(i)
  return bytes.buffer
}

async function importPublicKey(spkiBase64){
  const buf = base64ToArrayBuffer(spkiBase64)
  return await window.crypto.subtle.importKey('spki', buf, { name: 'RSA-OAEP', hash: 'SHA-256' }, true, ['encrypt'])
}

async function importPrivateKey(pkcs8Base64){
  const buf = base64ToArrayBuffer(pkcs8Base64)
  return await window.crypto.subtle.importKey('pkcs8', buf, { name: 'RSA-OAEP', hash: 'SHA-256' }, true, ['decrypt','unwrapKey'])
}

async function encryptMessageForPeer(payload){
  // create symmetric key
  const symKey = await crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, true, ['encrypt','decrypt'])
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const encoder = new TextEncoder()
  const encoded = encoder.encode(JSON.stringify(payload))
  const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, symKey, encoded)

  // export symKey raw
  const rawKey = await crypto.subtle.exportKey('raw', symKey)

  // wrap symKey with our own RSA public (we'll use local key as example - in real E2E you'd use recipient's public key)
  const kp = await getKeyPair()
  const pub = await importPublicKey(kp.publicKey)
  const wrapped = await crypto.subtle.encrypt({name:'RSA-OAEP'}, pub, rawKey)

  return {
    iv: arrayBufferToBase64(iv.buffer),
    ciphertext: arrayBufferToBase64(ciphertext),
    wrappedKey: arrayBufferToBase64(wrapped)
  }
}

async function decryptMessageFromPeer(msg){
  const kp = await getKeyPair()
  const priv = await importPrivateKey(kp.privateKey)

  const wrapped = base64ToArrayBuffer(msg.data.wrappedKey)
  // unwrap by decrypting with RSA private
  const rawKey = await crypto.subtle.decrypt({ name: 'RSA-OAEP' }, priv, wrapped)
  const symKey = await crypto.subtle.importKey('raw', rawKey, 'AES-GCM', true, ['decrypt'])
  const iv = base64ToArrayBuffer(msg.data.iv)
  const cipher = base64ToArrayBuffer(msg.data.ciphertext)
  const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: new Uint8Array(iv) }, symKey, cipher)
  const decoder = new TextDecoder()
  return JSON.parse(decoder.decode(decrypted))
}

export { generateAndStoreKeys, encryptMessageForPeer, decryptMessageFromPeer }
