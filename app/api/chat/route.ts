import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'
import { buildKnowledgeBase } from '@/app/data'

// Single source of truth: the knowledge base is derived from app/data.ts, so
// editing the site content automatically keeps the chatbot in sync. Built once
// at module load since the underlying data is static.
const KABEER_KNOWLEDGE = buildKnowledgeBase()

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    // Instantiate lazily so a missing key returns a clean JSON error instead of
    // crashing at module load (the Groq constructor throws on an empty key).
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: 'Chat is not configured (missing GROQ_API_KEY).' },
        { status: 503 }
      )
    }

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

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
- Use "Kabeer" or "he" when referring to him in third person`
        },
        {
          role: 'user',
          content: message
        }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.3,
      max_tokens: 7000,
    })

    const response = completion.choices[0]?.message?.content || 'Sorry, I could not generate a response.'

    return NextResponse.json({ response })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    )
  }
}