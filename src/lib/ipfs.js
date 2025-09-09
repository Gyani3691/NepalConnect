import { create } from 'ipfs-http-client'

// Public IPFS gateway (infura) - replace with your own node for production.
const client = create({ url: 'https://ipfs.infura.io:5001/api/v0' })

export async function uploadFile(file){
  const added = await client.add(file)
  return added.path || added.cid.toString()
}

export async function getFileUrl(cid){
  return `https://ipfs.io/ipfs/${cid}`
}
