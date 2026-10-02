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
