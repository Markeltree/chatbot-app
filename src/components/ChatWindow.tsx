'use client'

import { useEffect, useState, useRef } from 'react'
import { Send, Paperclip, Mic, ImageIcon, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import MessageBubble from './MessageBubble'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  createdAt: Date
  attachments?: any[]
}

interface AttachedFile {
  id: string
  file: File
  previewUrl?: string
}

interface ChatWindowProps {
  chatId: string | null
  onNewChat: (chatId: string) => void
}

export default function ChatWindow({ chatId, onNewChat }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const [isRecording, setIsRecording] = useState(false)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (chatId) {
      fetchMessages()
    }
  }, [chatId])

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/chats/${chatId}/messages`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        const data = await response.json()
        setMessages(data)
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error)
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!input.trim() && attachedFiles.length === 0) {
      return
    }

    setLoading(true)
    const tempUserId = `temp-user-${Date.now()}`
    const tempAssistantId = `temp-assistant-${Date.now()}`

    const optimisticUserMessage: Message = {
      id: tempUserId,
      role: 'user',
      content: input,
      createdAt: new Date(),
      attachments: attachedFiles.map(a => ({
        fileName: a.file.name,
        fileSize: a.file.size,
        mimeType: a.file.type,
        previewUrl: a.previewUrl,
      })),
    }

    setMessages(prev => [...prev, optimisticUserMessage])
    const filesToSend = attachedFiles
    setInput('')
    setAttachedFiles([])

    try {
      const token = localStorage.getItem('token')
      const formData = new FormData()
      formData.append('content', input)

      filesToSend.forEach(a => {
        formData.append('files', a.file)
      })

      const response = await fetch(`/api/chats/${chatId}/messages`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      })

      if (!response.ok || !response.body) {
        toast.error('Failed to send message')
        return
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''
      let assistantStarted = false

      while (true) {
        const { value, done } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })

        const frames = buffer.split('\n\n')
        buffer = frames.pop() || ''

        for (const frame of frames) {
          if (!frame.trim()) continue
          const eventLine = frame.split('\n').find(l => l.startsWith('event: '))
          const dataLine = frame.split('\n').find(l => l.startsWith('data: '))
          if (!dataLine) continue

          const eventType = eventLine ? eventLine.slice(7).trim() : 'message'
          const data = JSON.parse(dataLine.slice(6))

          if (eventType === 'user_message') {
            setMessages(prev => prev.map(m => (m.id === tempUserId ? data : m)))
          } else if (eventType === 'delta') {
            if (!assistantStarted) {
              assistantStarted = true
              setMessages(prev => [
                ...prev,
                { id: tempAssistantId, role: 'assistant', content: data.text, createdAt: new Date() },
              ])
            } else {
              setMessages(prev =>
                prev.map(m =>
                  m.id === tempAssistantId ? { ...m, content: m.content + data.text } : m
                )
              )
            }
          } else if (eventType === 'done') {
            setMessages(prev => prev.map(m => (m.id === tempAssistantId ? data : m)))
          }
        }
      }
    } catch (error) {
      toast.error('An error occurred')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const newAttachments: AttachedFile[] = files.map(file => ({
      id: `${file.name}-${file.size}-${Date.now()}-${Math.random()}`,
      file,
      previewUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
    }))
    setAttachedFiles(prev => [...prev, ...newAttachments])
    e.target.value = ''
  }

  const removeAttachedFile = (id: string) => {
    setAttachedFiles(prev => {
      const target = prev.find(a => a.id === id)
      if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl)
      return prev.filter(a => a.id !== id)
    })
  }

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      const audioChunks: Blob[] = []

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data)
      }

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/mp3' })
        const file = new File([audioBlob], 'recording.mp3', { type: 'audio/mp3' })
        setAttachedFiles(prev => [...prev, { id: `recording-${Date.now()}`, file }])
        toast.success('Recording saved')
      }

      mediaRecorder.start()
      setIsRecording(true)
    } catch (error) {
      toast.error('Microphone access denied')
    }
  }

  const handleStopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop()
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop())
      setIsRecording(false)
    }
  }

  if (!chatId) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4 gradient-text">Start a Conversation</h2>
          <p className="text-gray-500 mb-8">Select a chat or create a new one to begin</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-500">
              <p className="text-lg mb-2">No messages yet</p>
              <p className="text-sm">Start the conversation by sending a message</p>
            </div>
          </div>
        ) : (
          messages.map(message => (
            <MessageBubble key={message.id} message={message} />
          ))
        )}
        {loading && messages[messages.length - 1]?.role !== 'assistant' && (
          <div className="flex justify-start">
            <div className="glass-effect px-4 py-2 rounded-lg flex gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse-slow" />
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse-slow" style={{ animationDelay: '0.2s' }} />
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse-slow" style={{ animationDelay: '0.4s' }} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* File Attachments Display */}
      {attachedFiles.length > 0 && (
        <div className="px-4 py-2 border-t border-gray-200 flex flex-wrap gap-2">
          {attachedFiles.map((att) => (
            <div key={att.id} className="bg-gray-100 border border-gray-200 rounded-lg overflow-hidden flex items-center gap-2 pr-2 text-gray-700">
              {att.previewUrl ? (
                <img src={att.previewUrl} alt={att.file.name} className="w-10 h-10 object-cover" />
              ) : null}
              <span className="text-sm max-w-[140px] truncate pl-2">{att.file.name}</span>
              <button
                onClick={() => removeAttachedFile(att.id)}
                className="text-gray-400 hover:text-red-500"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input Area */}
      <form onSubmit={handleSendMessage} className="border-t border-gray-200 p-4">
        <div className="flex gap-3">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden"
            multiple
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2 hover:bg-gray-100 rounded-lg transition text-gray-500 hover:text-blue-600"
            title="Attach file"
          >
            <Paperclip className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={() => {
              if (isRecording) {
                handleStopRecording()
              } else {
                handleStartRecording()
              }
            }}
            className={`p-2 rounded-lg transition ${
              isRecording
                ? 'bg-red-50 text-red-500'
                : 'hover:bg-gray-100 text-gray-500 hover:text-blue-600'
            }`}
            title="Record audio"
          >
            <Mic className="w-5 h-5" />
          </button>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 rounded-full bg-white border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition"
            disabled={loading}
          />

          <button
            type="submit"
            disabled={loading || (!input.trim() && attachedFiles.length === 0)}
            className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
