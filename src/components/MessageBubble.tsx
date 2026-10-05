'use client'

import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Copy, Check } from 'lucide-react'
import toast from 'react-hot-toast'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  createdAt: Date
  attachments?: any[]
}

interface MessageBubbleProps {
  message: Message
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const [copied, setCopied] = useState(false)

  const isUser = message.role === 'user'

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    toast.success('Copied to clipboard')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} chat-message`}>
      <div
        className={`max-w-2xl px-4 py-3 rounded-lg ${
          isUser
            ? 'bg-gradient-to-br from-violet-600 to-indigo-600 text-white'
            : 'bg-gray-100 border border-gray-200 text-gray-900'
        }`}
      >
        {message.attachments && message.attachments.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-2">
            {message.attachments.map((attachment, i) => {
              const url = attachment.fileUrl || attachment.previewUrl
              const name = attachment.fileName || attachment.name || 'file'
              const mime = attachment.mimeType || ''
              const isImage = mime.startsWith('image/') || attachment.fileType === 'image'
              const isAudio = mime.startsWith('audio/') || attachment.fileType === 'audio'

              if (isImage && url) {
                return (
                  <a key={i} href={url} target="_blank" rel="noopener noreferrer">
                    <img
                      src={url}
                      alt={name}
                      className="max-w-[220px] max-h-[220px] rounded-lg border border-gray-200 object-cover"
                    />
                  </a>
                )
              }

              if (isAudio && url) {
                return <audio key={i} controls src={url} className="max-w-[240px]" />
              }

              return (
                <a
                  key={i}
                  href={url || undefined}
                  target={url ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  className={`text-xs px-2 py-1 rounded ${
                    isUser ? 'bg-violet-700/50' : 'bg-gray-200'
                  }`}
                >
                  📎 {name}
                </a>
              )
            })}
          </div>
        )}

        <div
          className={`prose prose-sm max-w-none ${
            isUser ? 'prose-invert text-white [&_code]:!bg-white/20 [&_code]:!text-white' : ''
          }`}
        >
          <ReactMarkdown
            components={{
              code: ({ node, className, children, ...props }) => {
                const match = /language-(\w+)/.exec(className || '')
                return match ? (
                  <div className="relative group my-2">
                    <SyntaxHighlighter
                      style={dracula}
                      language={match[1]}
                      PreTag="pre"
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                    <button
                      onClick={() =>
                        handleCopy(String(children).replace(/\n$/, ''))
                      }
                      className="absolute top-2 right-2 p-1 rounded bg-gray-700 hover:bg-gray-600 text-white opacity-0 group-hover:opacity-100 transition"
                    >
                      {copied ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                )
              },
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  )
}
