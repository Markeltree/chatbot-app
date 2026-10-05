'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import ChatWindow from '@/components/ChatWindow'
import { Loader2 } from 'lucide-react'

export default function ChatPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [chats, setChats] = useState<any[]>([])
  const [activeChat, setActiveChat] = useState<string | null>(null)

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/auth/login')
        return
      }

      try {
        const response = await fetch('/api/user', {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (!response.ok) {
          localStorage.removeItem('token')
          router.push('/auth/login')
          return
        }

        const userData = await response.json()
        setUser(userData)

        // Fetch chats
        const chatsResponse = await fetch('/api/chats', {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (chatsResponse.ok) {
          const chatsData = await chatsResponse.json()
          setChats(chatsData)
          if (chatsData.length > 0) {
            setActiveChat(chatsData[0].id)
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        localStorage.removeItem('token')
        router.push('/auth/login')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  const handleDeleteChat = (chatId: string) => {
    setChats(prev => prev.filter(c => c.id !== chatId))
    if (activeChat === chatId) {
      setActiveChat(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-violet-500" />
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-white">
      <Sidebar chats={chats} activeChat={activeChat} onSelectChat={setActiveChat} onDeleteChat={handleDeleteChat} user={user} />
      <ChatWindow chatId={activeChat} onNewChat={(chatId) => {
        setActiveChat(chatId)
        setChats([...chats, { id: chatId, title: 'New Chat', createdAt: new Date() }])
      }} />
    </div>
  )
}
