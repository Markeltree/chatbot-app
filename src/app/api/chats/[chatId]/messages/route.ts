import { NextRequest, NextResponse } from 'next/server'
import { after } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { randomUUID } from 'crypto'
import { prisma } from '@/lib/db'
import { verifyToken } from '@/lib/jwt'
import { aiClient } from '@/lib/ai'

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads')

function getFileTypeBucket(mimeType: string): string {
  if (mimeType.startsWith('image/')) return 'image'
  if (mimeType.startsWith('audio/')) return 'audio'
  if (mimeType.startsWith('video/')) return 'video'
  return 'file'
}

async function saveUploadedFile(file: File) {
  await mkdir(UPLOAD_DIR, { recursive: true })
  const buffer = Buffer.from(await file.arrayBuffer())
  const ext = path.extname(file.name)
  const uniqueName = `${randomUUID()}${ext}`
  await writeFile(path.join(UPLOAD_DIR, uniqueName), buffer)

  return {
    fileName: file.name,
    fileType: getFileTypeBucket(file.type),
    fileSize: file.size,
    fileUrl: `/uploads/${uniqueName}`,
    mimeType: file.type || 'application/octet-stream',
  }
}

function sseFrame(encoder: TextEncoder, event: string, data: unknown) {
  return encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`)
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ chatId: string }> }
) {
  try {
    const { chatId } = await params
    const authHeader = req.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.slice(7)
    const payload = verifyToken(token)

    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    // Verify chat belongs to user
    const chat = await prisma.chat.findFirst({
      where: {
        id: chatId,
        userId: payload.userId,
      },
    })

    if (!chat) {
      return NextResponse.json({ error: 'Chat not found' }, { status: 404 })
    }

    const messages = await prisma.message.findMany({
      where: { chatId: chatId },
      orderBy: { createdAt: 'asc' },
      include: {
        attachments: true,
      },
    })

    return NextResponse.json(messages)
  } catch (error) {
    console.error('Get messages error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ chatId: string }> }
) {
  try {
    const { chatId } = await params
    const authHeader = req.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.slice(7)
    const payload = verifyToken(token)

    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    // Verify chat belongs to user
    const chat = await prisma.chat.findFirst({
      where: {
        id: chatId,
        userId: payload.userId,
      },
      include: { user: true },
    })

    if (!chat) {
      return NextResponse.json({ error: 'Chat not found' }, { status: 404 })
    }

    const formData = await req.formData()
    const content = ((formData.get('content') as string) || '').trim()
    const files = formData.getAll('files').filter((f): f is File => f instanceof File && f.size > 0)

    if (!content && files.length === 0) {
      return NextResponse.json(
        { error: 'Message content is required' },
        { status: 400 }
      )
    }

    // Persist uploaded files to disk before saving the message
    const savedFiles: Awaited<ReturnType<typeof saveUploadedFile>>[] = []
    for (const file of files) {
      savedFiles.push(await saveUploadedFile(file))
    }

    // Save user message with its attachments
    const userMessage = await prisma.message.create({
      data: {
        chatId,
        role: 'user',
        content,
        modelUsed: 'user-input',
        attachments: { create: savedFiles },
      },
      include: { attachments: true },
    })

    // Get conversation history (includes the message just saved)
    const priorMessages = await prisma.message.findMany({
      where: { chatId },
      orderBy: { createdAt: 'asc' },
    })

    const conversationHistory = priorMessages.map(msg => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content,
    }))

    const isFirstMessage = priorMessages.length === 1
    const encoder = new TextEncoder()

    const memories = await prisma.memory.findMany({
      where: { userId: chat.userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    })

    const stream = new ReadableStream({
      async start(controller) {
        // Let the client swap its optimistic message for the real, persisted one
        controller.enqueue(sseFrame(encoder, 'user_message', userMessage))

        let aiResponse = ''
        try {
          const systemPromptParts = [
            'You are a helpful, knowledgeable AI assistant. Provide clear, concise, and accurate answers.',
          ]
          if (chat.user.name) {
            systemPromptParts.push(
              `The user's name is ${chat.user.name}; address them by name when it feels natural.`
            )
          }
          if (memories.length > 0) {
            systemPromptParts.push(
              `Here is what you remember about this user from past conversations:\n${memories
                .map(m => `- ${m.content}`)
                .join('\n')}`
            )
          }
          const systemPrompt = systemPromptParts.join('\n\n')

          const aiStream = await aiClient.streamChatWithAnthropic(
            conversationHistory,
            systemPrompt
          )

          for await (const chunk of aiStream) {
            aiResponse += chunk
            controller.enqueue(sseFrame(encoder, 'delta', { text: chunk }))
          }
        } catch (aiError) {
          console.error('AI error:', aiError)
          aiResponse = "I apologize, but I couldn't generate a response. Please try again."
          controller.enqueue(sseFrame(encoder, 'delta', { text: aiResponse }))
        }

        try {
          if (isFirstMessage) {
            const title = await aiClient.generateChatTitle(
              content || savedFiles[0]?.fileName || 'New Chat'
            )
            await prisma.chat.update({ where: { id: chatId }, data: { title } })
          }

          const assistantMessage = await prisma.message.create({
            data: {
              chatId,
              role: 'assistant',
              content: aiResponse,
              modelUsed: 'claude-opus-5-5',
            },
            include: { attachments: true },
          })

          controller.enqueue(sseFrame(encoder, 'done', assistantMessage))
        } catch (saveError) {
          console.error('Save assistant message error:', saveError)
          controller.enqueue(
            sseFrame(encoder, 'done', {
              id: randomUUID(),
              chatId,
              role: 'assistant',
              content: aiResponse,
              modelUsed: 'claude-opus-5-5',
              tokens: 0,
              createdAt: new Date().toISOString(),
              attachments: [],
            })
          )
        }

        controller.close()

        if (content.trim()) {
          after(async () => {
            try {
              const newFacts = await aiClient.extractMemories(
                content,
                aiResponse,
                memories.map(m => m.content)
              )

              if (newFacts.length > 0) {
                await prisma.memory.createMany({
                  data: newFacts.map(fact => ({ userId: chat.userId, content: fact })),
                })

                const total = await prisma.memory.count({ where: { userId: chat.userId } })
                const MAX_MEMORIES = 50
                if (total > MAX_MEMORIES) {
                  const excess = await prisma.memory.findMany({
                    where: { userId: chat.userId },
                    orderBy: { createdAt: 'asc' },
                    take: total - MAX_MEMORIES,
                    select: { id: true },
                  })
                  await prisma.memory.deleteMany({
                    where: { id: { in: excess.map(e => e.id) } },
                  })
                }
              }
            } catch (memoryError) {
              console.error('Memory extraction/save error:', memoryError)
            }
          })
        }
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
      },
    })
  } catch (error) {
    console.error('Create message error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
