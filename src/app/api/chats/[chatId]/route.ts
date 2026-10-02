import { NextRequest, NextResponse } from 'next/server'
import { unlink } from 'fs/promises'
import path from 'path'
import { prisma } from '@/lib/db'
import { verifyToken } from '@/lib/jwt'

export async function DELETE(
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

    // Verify chat belongs to user, and pull attachments so we can clean up disk files
    const chat = await prisma.chat.findFirst({
      where: { id: chatId, userId: payload.userId },
      include: { messages: { include: { attachments: true } } },
    })

    if (!chat) {
      return NextResponse.json({ error: 'Chat not found' }, { status: 404 })
    }

    // Best-effort removal of uploaded files - missing files are not an error
    for (const message of chat.messages) {
      for (const attachment of message.attachments) {
        if (attachment.fileUrl.startsWith('/uploads/')) {
          await unlink(path.join(process.cwd(), 'public', attachment.fileUrl)).catch(() => {})
        }
      }
    }

    // Messages and attachments cascade-delete via the schema's onDelete: Cascade
    await prisma.chat.delete({ where: { id: chatId } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete chat error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
