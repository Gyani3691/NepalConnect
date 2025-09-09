import React from 'react'

export default function Sidebar({ currentUser, onLogout }){
  return (
    <aside className="w-80 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 p-4 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Nepal Connect</h1>
        <button onClick={onLogout} className="text-sm text-red-500 hover:text-red-600">Logout</button>
      </div>
      <div className="flex items-center gap-2 mb-4 p-2 bg-gray-50 dark:bg-gray-700 rounded">
        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
          {currentUser?.slice(0,1).toUpperCase()}
        </div>
        <div className="flex-1">
          <div className="font-medium">{currentUser}</div>
          <div className="text-xs text-green-500">Online</div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="text-xs text-gray-500 mb-2">Contacts</div>
        <ul>
          <li className="p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700">Alice</li>
          <li className="p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700">Bob</li>
        </ul>
      </div>
      <div className="pt-4 text-sm text-gray-500">v0.1 • Serverless preview</div>
    </aside>
  )
}
