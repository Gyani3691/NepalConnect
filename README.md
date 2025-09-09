# Nepal Connect - Frontend Scaffold

This repository contains a frontend scaffold for Nepal Connect — a decentralized, serverless chat app built with React, Vite, Tailwind, Gun.js, IPFS and WebRTC.

Quick start (Windows PowerShell):

```powershell
# 1) install dependencies
npm install

# 2) start dev server (local)
npm run dev

# 3) build for production
npm run build
```

Notes:
- IPFS client currently points to Infura's public endpoint. Replace in `src/lib/ipfs.js` with your own node for production.
- Encryption uses the browser Web Crypto API (RSA-OAEP + AES-GCM).
- Gun is initialized without peers; for better discovery add trusted peer URLs in `src/lib/gun.js`.

Deployment (Vercel / Netlify):

- Vercel:
	1. Create a Vercel account and connect your Git repository.
	2. Set the build command to `npm run build` and the output directory to `dist`.
	3. Add no special environment variables for the static build. Deploy.

- Netlify:
	1. Create a Netlify account and connect your Git repository.
	2. Set the build command to `npm run build` and publish directory to `dist`.
	3. Alternatively, drag-and-drop the `dist` folder from a local build into Netlify Sites.

Security & Notes:
- Private keys are stored in the browser's localStorage by the helper in `src/lib/encryption.js`. For production consider stronger storage (IndexedDB / secure enclave) and a passphrase-protected export.
- This scaffold is intentionally minimal. It demonstrates the core decentralized building blocks: Gun for data, IPFS for files, WebRTC for calls, and Web Crypto for E2E encryption.

If you want, I can continue by:
- implementing contact profiles and searching
- improving the encryption handshake for true multi-party E2E
- adding call UI and live signaling through Gun


