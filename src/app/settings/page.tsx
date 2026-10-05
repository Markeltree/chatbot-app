'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Brain, Loader2, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'

interface Memory {
  id: string
  content: string
  createdAt: string
}

export default function SettingsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [memories, setMemories] = useState<Memory[]>([])
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/auth/login')
        return
      }

      try {
        const response = await fetch('/api/memories', {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (!response.ok) {
          toast.error('Failed to load memories')
          return
        }

        setMemories(await response.json())
      } catch (error) {
        toast.error('Failed to load memories')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [router])

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/memories/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        setMemories(prev => prev.filter(m => m.id !== id))
        toast.success('Memory deleted')
      } else {
        toast.error('Failed to delete memory')
      }
    } catch (error) {
      toast.error('Failed to delete memory')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <button
          onClick={() => router.push('/chat')}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to chat
        </button>

        <div className="flex items-center gap-3 mb-2">
          <Brain className="w-6 h-6 text-violet-600" />
          <h1 className="text-2xl font-bold">Memory</h1>
        </div>
        <p className="text-gray-500 mb-6">
          Things the assistant has learned about you from past conversations and
          uses to personalize new chats.
        </p>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
          </div>
        ) : memories.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <p className="text-lg mb-1">No memories yet</p>
            <p className="text-sm">
              Keep chatting and the assistant will remember useful details here.
            </p>
          </div>
        ) : (
          <ul className="space-y-2">
            {memories.map(memory => (
              <li
                key={memory.id}
                className="flex items-center justify-between gap-3 border border-gray-200 rounded-lg px-4 py-3"
              >
                <span className="text-sm text-gray-800">{memory.content}</span>
                <button
                  onClick={() => handleDelete(memory.id)}
                  disabled={deletingId === memory.id}
                  className="p-1.5 rounded text-gray-400 hover:bg-red-50 hover:text-red-600 transition disabled:opacity-50 flex-shrink-0"
                  title="Delete memory"
                >
                  {deletingId === memory.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
