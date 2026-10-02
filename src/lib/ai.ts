import Anthropic from '@anthropic-ai/sdk'
import { GoogleGenerativeAI } from '@google/generative-ai'

interface AIMessage {
  role: 'user' | 'assistant'
  content: string
}

interface AIStreamResponse {
  stream: AsyncIterable<{ type: string; delta?: { type: string; text?: string } }>
}

class AIClient {
  private anthropic: Anthropic
  private gemini: GoogleGenerativeAI

  constructor() {
    this.anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    })
    this.gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')
  }

  async streamChatWithAnthropic(
    messages: AIMessage[],
    systemPrompt: string = 'You are a helpful AI assistant.'
  ): Promise<AsyncIterable<string>> {
    const stream = await this.anthropic.messages.stream({
      model: 'claude-opus-5-5',
      max_tokens: 2048,
      system: systemPrompt,
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content,
      })),
    })

    return this.createStringAsyncIterable(stream)
  }

  async streamChatWithGemini(
    messages: AIMessage[],
    systemPrompt: string = 'You are a helpful AI assistant.'
  ): Promise<AsyncIterable<string>> {
    const model = this.gemini.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: systemPrompt,
    })

    const chatHistory = messages
      .slice(0, -1)
      .map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }],
      }))

    const chat = model.startChat({ history: chatHistory as any })
    const lastMessage = messages[messages.length - 1]

    const result = await chat.sendMessageStream(lastMessage.content)

    return this.createGeminiAsyncIterable(result)
  }

  private async *createStringAsyncIterable(
    stream: any
  ): AsyncIterable<string> {
    for await (const event of stream) {
      if (
        event.type === 'content_block_delta' &&
        event.delta.type === 'text_delta'
      ) {
        yield event.delta.text
      }
    }
  }

  private async *createGeminiAsyncIterable(
    result: any
  ): AsyncIterable<string> {
    for await (const chunk of result.stream) {
      const text = chunk.text()
      if (text) {
        yield text
      }
    }
  }

  async extractMemories(
    userMessage: string,
    assistantMessage: string,
    existingMemories: string[]
  ): Promise<string[]> {
    if (!userMessage.trim()) return []

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 300,
        system:
          'You extract durable facts about a user from a chat exchange (name, job, skills, preferences, goals, tools they use, likes/dislikes, etc.) so a chatbot can remember them in future conversations. Only extract facts stated or clearly implied by the USER, never facts about the assistant. Skip small talk, one-off requests, and anything already known. Reply with ONLY a JSON array of short fact strings (max 15 words each). If there is nothing new worth remembering, reply with exactly [].',
        messages: [
          {
            role: 'user',
            content: `Known facts so far:\n${
              existingMemories.length ? existingMemories.map(m => `- ${m}`).join('\n') : '(none)'
            }\n\nNew exchange:\nUser: ${userMessage}\nAssistant: ${assistantMessage.slice(0, 1000)}\n\nExtract any NEW facts not already known.`,
          },
        ],
      })

      const content = response.content[0]
      if (content.type === 'text') {
        const match = content.text.match(/\[[\s\S]*\]/)
        if (match) {
          const facts = JSON.parse(match[0])
          if (Array.isArray(facts)) {
            return facts.filter(
              (f): f is string => typeof f === 'string' && f.trim().length > 0
            )
          }
        }
      }
    } catch (error) {
      console.error('Memory extraction error:', error)
    }

    return []
  }

  async generateChatTitle(
    firstMessage: string
  ): Promise<string> {
    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-opus-5-5',
        max_tokens: 50,
        messages: [
          {
            role: 'user',
            content: `Generate a short title (max 5 words) for this chat message: "${firstMessage.substring(0, 100)}"`,
          },
        ],
      })

      const content = response.content[0]
      if (content.type === 'text') {
        return content.text.trim().replace(/^["']|["']$/g, '')
      }
    } catch {
      // Fallback
    }
    return firstMessage.substring(0, 50)
  }
}

export const aiClient = new AIClient()
