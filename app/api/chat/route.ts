import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

// Knowledge base about Kabeer - constructed from the data.ts file
const KABEER_KNOWLEDGE = `
About Kabeer Thockchom:
Kabeer is a Senior Applied AI Engineer at Ernst and Young LLP (October 2023 - Present) based in San Francisco, CA. He is also the Founder & CEO of a Stealth Startup (January 2024 - Present).

Education:
- Currently pursuing M.S. in Data Science at University of Texas, Austin (January 2025 - Present)
- B.S. Computer Science & Quantitative Economics from UC Davis (2019-2023), GPA: 3.7/4.0
- Minors in Statistics and Technology Management
- Honors: Dean's Scholar (2020, 2021, 2022), March Fund Award (2022)

Work Experience:
1. Ernst and Young LLP - Senior Applied AI Engineer (Oct 2023 - Present):
- Led development of EY Voice, an enterprise-grade AI-powered call center dashboard using NLP, LLM entity tagging, semantic search, and AI analytics for a Fortune 500 financial client that drove a 45% reduction in call resolution times and secured $1.2M in funding. Presented at NVIDIA GTC 2025.
- Leading a full-cycle enterprise AI search initiative—from discovery to production—by architecting a proprietary orchestrator layer in AWS and LangChain that seamlessly scales across multiple teams and projects.
- Implemented enterprise AI agents for customer service automation, enterprise search, and operational efficiency. Spearheaded a robust AI testing and evaluation framework to measure LLM performance, reliability, and trustworthiness.
- Generated over 50,000 call center transcripts using OpenAI GPT-3.5/4, Anthropic Claude 3 Opus, and open-source models. Developed prompt engineering techniques for batch generation and storage in MSSQL.
- Built a semantic search product for nuanced call querying by implementing cosine similarity, TF-IDF algorithms, and AI-tagged metadata filtering using HuggingFace, Azure OpenAI, and Qdrant.
- Developed a compliance product featuring entity tagging and named entity recognition (NER), reducing required manpower by 45%.
- Created an AI-generated feedback product using advanced SQL functions and NLP-extracted insights, improving agent performance by 25% across 10 metrics.
- Led cross-functional projects in generative AI (RAG, vector search) to monitor real-time sentiment across 20K+ daily interactions.
- Spearheaded the implementation of dual-model forecasting for a $3.2B portfolio, improving accuracy by 40%.
- Managed global teams (15 engineers across 3 locations), optimizing sprint cycles by 35% and accelerating velocity by 40%.
- Improved average handling time for an $8T AUM wealth management client by 30%, processing 1M+ daily interactions.
- Developed an AI transformation framework that raised CSAT by 25%, creating new standards for AI governance and enterprise rollout.

2. Stealth Startup - Founder & CEO (Jan 2024 - Present):
- Developed proprietary customer service AI agent (Bottega AI) achieving 40% reduction in order processing time and 25% increase in upselling through intelligent restaurant ordering system.
- Architected natural language data analysis platform for a leading ETF firm (Talk2Data AI) processing 10K+ daily financial queries with 95% accuracy.
- Built enterprise-grade Local Agentic RAG system reducing latency by 60% and improving response accuracy by 35% through optimized architecture.
- Oversaw end-to-end project delivery, including scope definition, timeline management, and risk mitigation, ensuring seamless integration with client engineering teams.

3. Ernst and Young LLP - Quantitative Consulting Intern (June 2022 - Aug 2022):
- Overhauled a regional bank's CECL framework, reducing implementation timeline by 30% and presenting a data-driven roadmap to executive leadership.
- Led workshops for 30+ senior directors, introducing 5 new risk assessment methodologies that achieved 100% CECL compliance.
- Developed 6 end-to-end process workflows with robust risk controls, increasing operational efficiency by 40%.

4. UC Davis Health - Digital Health & Innovation Intern (June 2021 - Aug 2022):
- Automated vaccine and healthcare data reporting (10,000+ points) with interactive Excel dashboards, enabling real-time KPI tracking.
- Owned project documentation (TRUTH documents, project timelines) and provided weekly status reports for leadership.
- Demystified core statistical concepts (A/B testing, regression analysis) for non-technical stakeholders.

5. UC Davis Graduate School of Management - Research Analyst (June 2021 - Aug 2022):
- Led a 10-person team in classifying acquisitions/mergers research snippets, reducing review turnaround times by 30%.
- Created a comprehensive annotated dataset for NLP research, increasing labeling consistency by 25%.
- Fine-tuned a BERT-based NLP model, raising predictive accuracy by 15%.

Key Projects:
1. Text2SQL - Natural Language Business Intelligence: AI-powered solution converting natural language to SQL queries with adaptive learning, customizable database documentation, 100+ chart types, and versatile data export options.

2. EY Voice - EY Generative AI Call Center as a Service: AI-powered tool revolutionizing customer interaction analysis using advanced AI and LLMs to extract actionable insights from diverse communication channels.

3. BottegaAI - Customer AI for Restaurants: AI-powered voice agent for restaurant operations handling phone interactions, order placement, and personalization. Supports 50+ languages and manages entire customer journey.

4. EYLAR - EY Local Agentic RAG: Completely Local Agentic RAG system for EY consultants with personalized knowledge search across multiple file formats with built-in privacy controls and precision guardrails.

5. Generative UI Banking POC: Dynamic UI generation system AI chatbot for banking client using LangGraph.js, GPT-4o-mini, and Vercel AI SDK with real-time component rendering.

6. AI Monopoly Arena: Interactive game where users play Monopoly against leading LLM models from OpenAI, Anthropic, and Gemini.

7. ETF AI: AI-powered financial platform for ETF data analysis processing 10K+ daily queries with 95% accuracy, supporting real-time data visualization and complex financial insights.

Technical Skills:
- Programming Languages: Python, TypeScript, SQL, STATA, R
- Web Technologies: React, Next.js, Streamlit, Flask, WebSockets, FastAPI
- Database Systems: PostgreSQL, Qdrant, MSSQL, MongoDB
- Data Science & ML: Pandas, PyTorch, Linear Regression, Random Forest, Multi-Armed Bandit, NLP, CUDA, LLM, LoRA finetuning
- Cloud Technologies: Azure, Google Cloud Platform, AWS, Fly.io, Render, Vercel
- DevOps: Github, Git, Docker, Postman, CI/CD
- Specialized Areas: AI Agents, Product Management, Full-Stack Web App Dev, Agile/Scrum
- Other Tools: Excel, PowerPoint, Snowflake, Kore.AI, Azure ML/AI Studio, AWS Lambda
- Languages: English (Native), Hindi (Native), Punjabi (Conversational), Spanish (Conversational)

Mission: Bridge the gap between cutting-edge AI technology and practical business solutions, creating products that showcase technical excellence and solve real-world problems.

Personal Interests: AI/ML, Economics, Product Development/Management, Dogs, Tea, Hiking, Movies. Fascinated by the intersection of AI, business, and human-centered design. Believes in building technology that enhances human capabilities rather than replacing them.
`

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

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