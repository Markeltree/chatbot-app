'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Plus, MessageSquare, LogOut, Menu, X, Settings, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'

interface SidebarProps {
  chats: any[]
  activeChat: string | null
  onSelectChat: (chatId: string) => void
  onDeleteChat: (chatId: string) => void
  user: any
}

export default function Sidebar({
  chats,
  activeChat,
  onSelectChat,
  onDeleteChat,
  user,
}: SidebarProps) {
  const router = useRouter()
  const [open, setOpen] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleNewChat = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/chats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        onSelectChat(data.id)
        setMobileOpen(false)
      }
    } catch (error) {
      toast.error('Failed to create chat')
    }
  }

  const handleDeleteChat = async (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation()
    if (!confirm('Delete this chat? This cannot be undone.')) return

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/chats/${chatId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        onDeleteChat(chatId)
        toast.success('Chat deleted')
      } else {
        toast.error('Failed to delete chat')
      }
    } catch (error) {
      toast.error('Failed to delete chat')
    }
  }

  const handleLogout = async () => {
    localStorage.removeItem('token')
    toast.success('Logged out successfully')
    router.push('/auth/login')
  }

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 hover:bg-gray-100 rounded-lg transition"
      >
        {mobileOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Menu className="w-6 h-6" />
        )}
      </button>

      {/* Sidebar */}
      <div
        className={`${
          open ? 'w-64' : 'w-20'
        } ${
          mobileOpen ? 'fixed inset-0 z-40 lg:static' : 'hidden lg:flex'
        } flex flex-col bg-gray-50 border-r border-gray-200 transition-all duration-300`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          {open && (
            <h1 className="text-xl font-bold gradient-text">ChatBot</h1>
          )}
          <button
            onClick={() => setOpen(!open)}
            className="hidden lg:block p-1 hover:bg-gray-200 rounded transition"
          >
            {open ? '←' : '→'}
          </button>
        </div>

        {/* New Chat */}
        <button
          onClick={handleNewChat}
          className="m-4 flex items-center justify-center gap-2 w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-full transition-all"
        >
          <Plus className="w-5 h-5" />
          {open && 'New Chat'}
        </button>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto px-2 space-y-2">
          {chats.map((chat) => (
            <div
              key={chat.id}
              className={`group w-full flex items-center rounded-lg transition-all ${
                activeChat === chat.id
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <button
                onClick={() => {
                  onSelectChat(chat.id)
                  setMobileOpen(false)
                }}
                className="flex-1 min-w-0 flex items-center gap-3 px-3 py-2 text-left"
              >
                <MessageSquare className="w-4 h-4 flex-shrink-0" />
                {open && (
                  <span className="truncate text-sm">{chat.title}</span>
                )}
              </button>
              {open && (
                <button
                  onClick={(e) => handleDeleteChat(e, chat.id)}
                  className="p-1.5 mr-1.5 rounded opacity-0 group-hover:opacity-100 hover:bg-red-100 hover:text-red-600 transition flex-shrink-0"
                  title="Delete chat"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Bottom Actions */}
        <div className="border-t border-gray-200 p-4 space-y-2">
          <button className="w-full flex items-center justify-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition">
            <Settings className="w-5 h-5" />
            {open && <span className="text-sm">Settings</span>}
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 transition"
          >
            <LogOut className="w-5 h-5" />
            {open && <span className="text-sm">Logout</span>}
          </button>
        </div>

        {/* User Info */}
        {open && user && (
          <div className="border-t border-gray-200 p-4">
            <p className="text-xs text-gray-400">Signed in as</p>
            <p className="text-sm font-semibold truncate text-gray-900">{user.name}</p>
          </div>
        )}
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </>
  )
}
