import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'
import { buildKnowledgeBase } from '@/app/data'

// Single source of truth: the knowledge base is derived from app/data.ts, so
// editing the site content automatically keeps the chatbot in sync. Built once
// at module load since the underlying data is static.
const KABEER_KNOWLEDGE = buildKnowledgeBase()
export const maxDuration = 20

export async function POST(request: NextRequest) {
  try {
    let payload: { message?: unknown } | null
    try {
      payload = await request.json()
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON request' },
        { status: 400 },
      )
    }
    const message = payload?.message

    if (
      typeof message !== 'string' ||
      !message.trim() ||
      message.length > 2000
    ) {
      return NextResponse.json(
        { error: 'Enter a message between 1 and 2000 characters.' },
        { status: 400 },
      )
    }

    // Instantiate lazily so a missing key returns a clean JSON error instead of
    // crashing at module load (the Groq constructor throws on an empty key).
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: 'Chat is not configured (missing GROQ_API_KEY).' },
        { status: 503 },
      )
    }

    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
      timeout: 12_000,
      maxRetries: 0,
    })
    const model = process.env.GROQ_MODEL || 'openai/gpt-oss-120b'

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You are an AI assistant that knows everything about Kabeer Thockchom based on his resume and professional background. Use the following knowledge base to answer questions about Kabeer. Be helpful, conversational, and provide specific details from his background when relevant. If asked about something not in the knowledge base, politely say you don't have that specific information but offer to help with what you do know.

Knowledge Base:
${KABEER_KNOWLEDGE}

Guidelines:
- Be conversational and friendly
- Provide specific examples and numbers when available
- If asked about technical details, explain them clearly
- Focus on Kabeer's achievements and impact
- Keep responses concise but informative (2-4 sentences typically)
- Use "Kabeer" or "he" when referring to him in third person`,
        },
        {
          role: 'user',
          content: message.trim(),
        },
      ],
      model,
      temperature: 0.3,
      max_completion_tokens: 1024,
      ...(model.startsWith('openai/gpt-oss-')
        ? { reasoning_effort: 'low' as const }
        : {}),
    })

    const response = completion.choices[0]?.message?.content?.trim()
    if (!response) throw new Error('Empty assistant response')

    return NextResponse.json({ response })
  } catch (error) {
    const upstreamStatus =
      error instanceof Groq.APIError ? error.status : undefined
    console.error('Chat API error:', {
      status: upstreamStatus ?? 'unavailable',
    })
    if (upstreamStatus === 429) {
      return NextResponse.json(
        { error: 'The assistant is busy. Try again in a minute.' },
        { status: 429 },
      )
    }
    return NextResponse.json(
      { error: 'The assistant is temporarily unavailable.' },
      { status: upstreamStatus === 401 || upstreamStatus === 403 ? 503 : 502 },
    )
  }
}
