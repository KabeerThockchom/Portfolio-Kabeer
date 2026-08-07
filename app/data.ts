type Project = {
  name: string
  description: string
  link: string
  video: string
  id: string
  techStack: string[]
  githubUrl?: string
}

type WorkExperience = {
  company: string
  title: string
  start: string
  end: string
  link: string
  id: string
  location: string
  accomplishments: string[]
  logo?: string
}

type BlogPost = {
  title: string
  description: string
  link: string
  uid: string
}

type SocialLink = {
  label: string
  link: string
}

export const PROJECTS: Project[] = [
  {
    name: 'Multi-Agent Retail Ops Reference Architecture',
    description:
      'A reusable, Lakehouse-native blueprint for retail operations: a Supervisor agent coordinating specialized sub-agents (forecasting, dynamic pricing, inventory, labor) over an end-to-end pipeline - ingestion to medallion architecture to governed serving to agent execution. Grounded in real data via natural-language analytics and governed functions, it cut evaluation cycles for Fortune 500 retailers from months to weeks and has been reused across multiple engagements.',
    link: 'https://www.databricks.com/product/artificial-intelligence',
    video: '',
    id: 'project-maops',
    techStack: ['Databricks', 'Unity Catalog', 'Model Serving', 'Agent Bricks', 'Multi-Agent (Supervisor)', 'Delta Lake', 'Genie'],
  },
  {
    name: 'Generative-Agents Retail Simulation',
    description:
      'A Stanford Smallville-inspired retail simulation where LLM-driven customer agents make autonomous purchasing decisions and stream live events into a multi-agent operations platform - forecasting, pricing, inventory, and labor - with human-in-the-loop approvals. Built as a flagship, re-skinnable demo so a believable agentic-operations story could be told on real streaming data instead of slideware.',
    link: 'https://www.databricks.com/product/artificial-intelligence',
    video: '',
    id: 'project-smallville',
    techStack: ['Databricks', 'LLM Agents', 'Streaming', 'Multi-Agent', 'Human-in-the-Loop', 'Model Serving'],
  },
  {
    name: 'Browser AI Agents on Databricks Apps',
    description:
      'A reference deployment of browser-controlling AI agents running on Databricks Apps, with end-to-end Make-based deployment automation on a managed workspace. Used as a live, customer-facing demo to advance agentic-discovery conversations and show that autonomous, tool-using agents can run production-grade on the platform.',
    link: 'https://github.com/KabeerThockchom/coding-agents-databricks-apps',
    video: '',
    id: 'project-coda',
    techStack: ['Databricks Apps', 'Browser Agents', 'Python', 'Make', 'Tool-Use Agents'],
    githubUrl: 'https://github.com/KabeerThockchom/coding-agents-databricks-apps',
  },
  {
    name: 'Portfolio AI - Voice-Enabled Financial Assistant',
    description:
      "A voice-powered AI financial assistant that transforms how you interact with market data. Speak naturally to access real-time stock charts, company profiles, analyst recommendations, earnings calendars, and trending tickers - all through voice commands powered by Azure OpenAI's GPT-4 real-time API. Features WebRTC low-latency audio streaming, 7 interactive data-visualization types, intelligent function calling for dynamic retrieval, and swipe-gesture content history.",
    link: 'https://finprometheus.vercel.app/',
    video: 'https://drive.google.com/file/d/1oT3xnwTZi8zCe6ZMcJKGuIJqAsPttJKA/view?usp=drive_link',
    id: 'project-portfolioai',
    techStack: ['Next.js', 'React', 'TypeScript', 'Azure OpenAI Realtime', 'WebRTC', 'Yahoo Finance API', 'ApexCharts', 'Tailwind CSS'],
    githubUrl: 'https://github.com/KabeerThockchom/portfolio-ai-nxt',
  },
  {
    name: 'Text2SQL - Natural Language Analytics Engine',
    description:
      'An adaptive Text-to-SQL platform that converts natural language into precise SQL: query intent classification, schema-aware prompt engineering, and continuous-learning feedback loops, with 100+ chart types and flexible export. Reached 500+ users and reduced analyst workload by ~70% by letting business teams self-serve insights.',
    link: 'https://text2sql.fly.dev',
    video: 'https://drive.google.com/file/d/1dUvFzEmn0e5xz2SsDUUBPUYxhTH9TyOY/view?usp=drive_link',
    id: 'project-text2sql',
    techStack: ['React', 'OpenAI', 'Anthropic Claude', 'Qdrant', 'SQLite', 'Plotly', 'FastAPI', 'Docker'],
    githubUrl: 'https://github.com/KabeerThockchom/Text2SQLAI',
  },
  {
    name: 'EY Voice - Real-Time AI Call Center Platform',
    description:
      'An enterprise, real-time AI call-center platform: a speech-to-text plus LLM pipeline for live call analysis, automated ticket routing, and agent-assist. Drove a 45% reduction in call resolution time and automated 75% of tickets across 10+ enterprise clients handling 1M+ calls per month. Presented as a keynote at NVIDIA GTC 2025 and secured $1.2M in funding.',
    link: 'https://genaiccdeploy.azurewebsites.net/',
    video: 'https://drive.google.com/file/d/156tYjIsuSYuKiqOXkwKdfgZ1l5xfi7S1/view?usp=drive_link',
    id: 'project-eyvoice',
    techStack: ['React', 'Azure OpenAI', 'Speech-to-Text', 'FastAPI', 'Azure Functions', 'MSSQL', 'Docker'],
  },
  {
    name: 'BottegaAI - Restaurant Voice Agent',
    description:
      'An AI voice agent built on a ReAct architecture with tool-use for menu querying, order processing, and upselling. Handles the full customer journey over the phone, integrates with POS systems, and supports 50+ languages - achieving a 40% reduction in order-processing time and a 25% lift in upselling through personalization.',
    link: 'https://www.loom.com/share/4ec3f363d5534b7eb55f9b0b804ec361?sid=eaba42a8-56da-454f-b7ea-c187236fbb24',
    video: 'https://www.loom.com/share/4ec3f363d5534b7eb55f9b0b804ec361?sid=eaba42a8-56da-454f-b7ea-c187236fbb24',
    id: 'project-bottega',
    techStack: ['React', 'Twilio', 'Claude', 'ReAct Agents', 'Stripe', 'AWS EC2', 'Docker'],
  },
  {
    name: 'EYLAR - Enterprise Agentic RAG Platform',
    description:
      'An on-premise, zero-trust Agentic RAG platform for enterprise knowledge search: multi-format document parsing (PDF, PPT, Word, Excel), chunking and embedding pipelines, and vector retrieval with transparent in-line citations. Deployed across 5 Fortune 500 companies, reducing latency by 60% and improving response accuracy by 35%.',
    link: 'https://www.youtube.com/watch?v=Ra3PvUVTPc4',
    video: 'https://drive.google.com/file/d/1iYCLIs7553I11xkgzTnHVHdfGPERA6lj/view?usp=drive_link',
    id: 'project-eylar',
    techStack: ['React', 'LangGraph', 'Qdrant', 'Ollama', 'RAG', 'Docker'],
  },
  {
    name: 'Generative UI Banking POC',
    description:
      'A dynamic UI-generation system for a banking client: an AI chatbot that renders contextually appropriate visual components in real time during customer conversations, built with LangGraph.js, GPT-4o-mini, and the Vercel AI SDK.',
    link: 'https://res.cloudinary.com/dslghpuru/video/upload/v1745353337/eygenui_hv5rv9.mov',
    video: 'https://drive.google.com/file/d/1PrIoQKUO4N8YIwn-y2EsHkNyfvm8xgDG/view?usp=drive_link',
    id: 'project-genui',
    techStack: ['React', 'LangGraph.js', 'OpenAI', 'Vercel AI SDK', 'Docker'],
  },
  {
    name: 'AI Monopoly Arena',
    description:
      'A game where you play Monopoly against leading LLMs from OpenAI, Anthropic, and Gemini - trading, negotiating, and strategizing against models in real time.',
    link: 'https://res.cloudinary.com/dslghpuru/video/upload/v1745353572/mono_zg8pzk.mov',
    video: 'https://drive.google.com/file/d/1EHut11qbjjMfP9NFr_PehOyNb5ul_bfK/view?usp=drive_link',
    id: 'project-monopoly',
    techStack: ['JavaScript', 'OpenAI', 'Anthropic', 'Gemini'],
  },
  {
    name: 'ETF AI',
    description:
      'An AI-powered financial platform for ETF data analysis, processing 10K+ daily queries with 95% accuracy. Supports real-time data visualization and handles complex financial insights through natural language, streamlining investment decision-making.',
    link: 'https://prod.quantie.com/',
    video: 'https://drive.google.com/file/d/1m6AdQYB-GxmgYwFx4Fp04wxOTGIfVmyP/view?usp=drive_link',
    id: 'project-etfai',
    techStack: ['React', 'Snowflake', 'OpenAI', 'Docker'],
  },
]

type Education = {
  school: string
  degree: string
  location: string
  start: string
  end: string
  gpa?: string
  honors?: string[]
  focus?: string
  minors?: string[]
  coursework?: string[]
  logo?: string
  id: string
}

type Skill = {
  category: string
  items: string[]
}

type Certification = {
  name: string
  issuer: string
  year: string
  id: string
}

type Award = {
  name: string
  issuer: string
  date: string
  description?: string
  id: string
}

type Recognition = {
  title: string
  issuer: string
  date: string
  description?: string
  id: string
}

export const WORK_EXPERIENCE: WorkExperience[] = [
  {
    company: 'Databricks',
    title: 'Solutions Architect, Field Engineering - Retail, Travel & Hospitality',
    start: 'December 2025',
    end: 'Present',
    location: 'San Francisco, CA',
    link: 'https://www.databricks.com/',
    logo: '/logos/databricks.svg',
    accomplishments: [
      'Own technical strategy for 21+ greenfield Fortune 500 retail, travel, hospitality, healthcare, and food-distribution accounts across two AEs - starting from zero footprint, driving consumption, and converting pre-discovery into committed multi-month POCs with locked migration plans.',
      'Design end-to-end migration architectures off Snowflake, BigQuery, Domo, Power BI, and AS400 onto the Lakehouse, scoping CDC ingestion, vector search, and agent deployment patterns.',
      'Ran a multi-day on-site executive discovery workshop with C-suite and VP-level technical leaders for a Fortune 500 retailer consolidating BI onto a single AI platform - mapping current architecture, framing value across AI/BI, Genie, and Agent Bricks, and locking a phased POC with mutual success criteria.',
      'Built a flagship, re-skinnable agentic retail-operations demo on real streaming data (LLM customer agents feeding a multi-agent ops platform with human-in-the-loop approvals) plus a reusable Supervisor-agent reference architecture, cutting customer evaluation cycles from months to weeks.',
      'Shipped customer-facing reference solutions - a markdown-optimization pricing agent, a restaurant-inventory ReAct agent, a Genie-powered text-to-SQL layer, and a browser-AI-agent app on Databricks Apps - that moved multiple accounts to POC commit.',
      'Authored a team-wide Claude Code + MCP setup guide and an Obsidian-integrated SA knowledge system (20+ account dossiers, 30+ custom skills), adopted across the Solutions Engineering org as a best-practice template for AI-native field work.',
    ],
    id: 'work-databricks',
  },
  {
    company: 'Ernst and Young LLP',
    title: 'Senior Applied AI Engineer',
    start: 'July 2025',
    end: 'December 2025',
    location: 'San Francisco, CA',
    link: 'https://www.ey.com/en_us/services/ai',
    logo: '/logos/ey.svg',
    accomplishments: [
      'Led enterprise AI-platform strategy across 15 engineering teams; designed MLOps infrastructure (model registry, experiment tracking, feature stores, CI/CD) that raised AI project success rate from 20% to 65% and cut deployment time by 75%.',
      'Architected a retrieval pipeline with semantic search (cosine similarity, TF-IDF, metadata filtering) on Qdrant across 200+ knowledge systems for a $10T AUM client - 90% query accuracy, resolution time from 45 min to 5 min, 10K+ daily queries with model distillation.',
      'Engineered the EY Voice AI call-center platform (real-time speech-to-text, LLM ticket classification, agent-assist); reduced call resolution 45%, automated 75% of tickets; presented at NVIDIA GTC 2025 and secured $1.2M in funding.',
      'Defined an AI-agent evaluation framework with LLM performance benchmarks and automated reliability testing; increased agent efficiency 80% and cut onboarding from 2 weeks to 24 hours.',
      'Built an NER-based compliance-extraction system reducing manpower 90%, and generated 200K+ synthetic datasets for model fine-tuning and evaluation.',
    ],
    id: 'work-ey-senior',
  },
  {
    company: 'Ernst and Young LLP',
    title: 'AI Platform Engineer',
    start: 'October 2023',
    end: 'July 2025',
    location: 'San Francisco, CA',
    link: 'https://www.ey.com/en_us/services/ai',
    logo: '/logos/ey.svg',
    accomplishments: [
      'Architected a semantic search system on Qdrant (cosine-similarity scoring, TF-IDF ranking, metadata filtering) with embedding pipelines for document chunking, indexing, and retrieval across 200+ enterprise systems.',
      'Developed an AI agent framework with tool-use for banking clients - ReAct-style reasoning loops, LLM-output evaluation harnesses, and onboarding automation that cut agent setup from 2 weeks to 24 hours.',
      'Built platform telemetry dashboards tracking model performance, API latency, retrieval accuracy, and agent success across 200+ hours of analysis; drove platform NPS from 20 to 75 and secured $3M in additional investment.',
      'Managed 15 engineers across 3 locations and optimized ML-pipeline velocity by 40% using JIRA/Confluence under a SAFe Agile methodology.',
    ],
    id: 'work-ey-platform',
  },
  {
    company: 'Stealth Startup',
    title: 'Founder & AI Engineer',
    start: 'January 2024',
    end: 'July 2025',
    location: 'San Francisco, CA',
    link: 'https://trybytes.ai/',
    accomplishments: [
      'Built EYLAR, an on-premise RAG platform with zero-trust architecture - multi-format document parsing, chunking, embedding, and vector retrieval with transparent citations - deployed across 5 Fortune 500 companies with 60% latency reduction and 35% accuracy improvement.',
      'Developed Bottega AI, a restaurant voice agent on a ReAct architecture with tool-use for menu querying, ordering, and upselling: 40% faster order processing and 25% upselling increase.',
      'Architected Talk2Data, a natural-language Text-to-SQL analytics platform for an ETF firm (query parsing, schema inference, SQL generation, visualization) processing 10K+ daily queries at 95% accuracy.',
    ],
    id: 'work-startup',
  },
  {
    company: 'Ernst and Young LLP',
    title: 'AI Engineering Intern',
    start: 'June 2022',
    end: 'August 2022',
    location: 'San Francisco, CA',
    link: 'https://www.ey.com/en_us/services/consulting/financial-services-risk-management',
    logo: '/logos/ey.svg',
    accomplishments: [
      'Built data pipelines and process workflows for a CECL credit-risk framework with 30+ stakeholders; developed 6 workflows with risk controls that reduced implementation time by 30% and achieved 100% compliance.',
    ],
    id: 'work-ey-intern',
  },
  {
    company: 'UC Davis Graduate School of Management',
    title: 'Research Analyst - NLP',
    start: 'June 2021',
    end: 'August 2022',
    location: 'Davis, CA',
    link: 'https://gsm.ucdavis.edu/',
    logo: '/logos/ucdavis.svg',
    accomplishments: [
      'Led a 10-person team developing an NLP classification model with BERT fine-tuning; designed annotation guidelines, built labeled datasets, and ran A/B testing that improved accuracy 15% and labeling consistency 25%.',
    ],
    id: 'work-gsm',
  },
]

export const EDUCATION: Education[] = [
  {
    school: 'University of Texas, Austin',
    degree: 'M.S. in Data Science',
    location: 'Austin, TX',
    start: 'January 2025',
    end: 'Present',
    focus: 'Machine Learning Systems, Distributed Computing, Statistical Learning',
    coursework: ['MLOps', 'A/B Testing', 'Experiment Design'],
    logo: '/logos/utaustin.svg',
    id: 'edu1',
  },
  {
    school: 'University of California, Davis',
    degree: 'B.S. Computer Science & Quantitative Economics',
    location: 'Davis, CA',
    start: 'September 2019',
    end: 'June 2023',
    gpa: '3.7/4.0',
    minors: ['Statistics', 'Technology Management'],
    honors: ["Dean's Scholar (2020-2022)", 'March Fund Award (2022)'],
    coursework: ['Machine Learning', 'Database Systems', 'Statistical Analysis', 'HCI'],
    logo: '/logos/ucdavis.svg',
    id: 'edu2',
  },
]

export const SKILLS: Skill[] = [
  {
    category: 'Solutions Engineering',
    items: ['Greenfield Account Development', 'Executive Discovery (CIO/CTO/CDO)', 'POC Scoping & Delivery', 'Migration Architecture', 'Demo & Reference Asset Engineering', 'On-Site Workshops', 'AE Partnership', 'Territory Planning', 'MEDDPICC', 'Value Framing'],
  },
  {
    category: 'Databricks Platform',
    items: ['Unity Catalog', 'Model Serving', 'Lakeflow / DLT', 'Agent Bricks & Agent Framework', 'Genie', 'AI/BI Dashboards', 'Databricks Apps', 'Asset Bundles (DABs)', 'Lakebase', 'MCP', 'Vector Search'],
  },
  {
    category: 'LLMs & Agents',
    items: ['GPT-4', 'Claude', 'LLaMA', 'RAG Architectures', 'ReAct Agents', 'Tool-Use Patterns', 'Multi-Agent Orchestration (Supervisor)', 'Prompt Engineering', 'Fine-tuning (LoRA/QLoRA)', 'Evaluation Frameworks'],
  },
  {
    category: 'Data & ML',
    items: ['Python', 'SQL', 'Delta Lake', 'Apache Spark', 'PyTorch', 'TensorFlow', 'Hugging Face Transformers', 'LangChain', 'MLflow', 'Qdrant', 'Pinecone', 'FAISS'],
  },
  {
    category: 'Cloud & Infra',
    items: ['AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'CI/CD', 'Snowflake', 'BigQuery', 'PostgreSQL', 'MongoDB'],
  },
  {
    category: 'MLOps',
    items: ['Model Registry', 'Experiment Tracking', 'Feature Stores', 'Model Monitoring', 'A/B Testing', 'LLMOps'],
  },
  {
    category: 'Languages',
    items: ['English (Native)', 'Hindi (Native)', 'Spanish (Conversational)', 'Punjabi (Conversational)'],
  },
]

export const BLOG_POSTS: BlogPost[] = [
  {
    title: "Every AI Agent Needs a Database. Most of Them Don't Know It Yet.",
    description: 'Why AI agents need persistent database infrastructure - with branching and governance - to support dev sandboxes, production, A/B testing, and RL training loops.',
    link: 'https://medium.com/@thockchomkabeer/every-ai-agent-needs-a-database-most-of-them-dont-know-it-yet-1fa48ab740cf',
    uid: 'blog-agent-database',
  },
  {
    title: 'How I Used /goal in Claude Code to Build a Complete Product Demo - and Shoot the Demo Video Itself',
    description: "Using Claude Code's goal loop to autonomously build a production Databricks demo app, complete with a self-generated narrated video, in eight days before an executive briefing.",
    link: 'https://medium.com/@thockchomkabeer/how-i-used-goal-in-claude-code-to-make-it-build-a-complete-product-demo-and-shoot-a-demo-video-a6a9b9311833',
    uid: 'blog-goal-claude-code',
  },
  {
    title: 'How to build an enterprise-ready Text-to-SQL application',
    description: 'A deep dive into building a Text-to-SQL application',
    link: 'https://medium.com/@thockchomkabeer/text2sql-transforming-natural-language-into-sql-queries-cc911f11bd78',
    uid: 'blog-1',
  },
  {
    title: 'How to build an ML model to predict Premier League season & match results',
    description: 'A deep dive into building an ML model to predict Premier League season & match results',
    link: 'https://docs.google.com/document/d/1U6lkcSmnxW4RwvFIUdSesEVX_bXsSFVm/edit?usp=sharing&ouid=109640699554357737812&rtpof=true&sd=true',
    uid: 'blog-2',
  },
  {
    title: 'Case study on the Wells Fargo "8 is great" scandal',
    description: 'A deep-dive analysis into the Wells Fargo "8 is great" scandal - what went wrong, and how to prevent it in the future',
    link: 'https://docs.google.com/presentation/d/1eEI_uHqw4Ay_8JOnqOytPtHil2A2VyrR/edit?usp=drive_link&ouid=109640699554357737812&rtpof=true&sd=true',
    uid: 'blog-3',
  },
]

export const SOCIAL_LINKS: SocialLink[] = [
  {
    label: 'Github',
    link: 'https://github.com/KabeerThockchom',
  },
  {
    label: 'LinkedIn',
    link: 'https://www.linkedin.com/in/kabeerthockchom',
  },
]

export const CERTIFICATIONS: Certification[] = [
  {
    name: 'Project Management Professional (PMP)',
    issuer: 'Project Management Institute',
    year: '2024',
    id: 'cert1',
  },
  {
    name: 'Microsoft AI-900 Azure AI Fundamentals',
    issuer: 'Microsoft',
    year: '2024',
    id: 'cert2',
  },
  {
    name: 'DeepLearning.AI LLM Fine-tuning Specialization',
    issuer: 'DeepLearning.AI',
    year: '2023',
    id: 'cert3',
  },
]

export const AWARDS: Award[] = [
  {
    name: 'EY Wealth Asset Management Hackathon Winner',
    issuer: 'Ernst and Young LLP',
    date: 'February 2025',
    description: 'Developed a multi-agent platform automating wealth-management workflows; won the $50K prize',
    id: 'award1',
  },
  {
    name: 'March Fund Award',
    issuer: 'University of California Davis, Letters & Science',
    date: 'June 2022',
    description: 'Recognition for student achievement in internships and on-campus impact',
    id: 'award2',
  },
  {
    name: "Dean's Scholar List",
    issuer: 'University of California Davis, Letters & Science',
    date: '2020, 2021, 2022',
    description: 'Awarded for a GPA in the top 16% of class level and college',
    id: 'award3',
  },
]

export const RECOGNITION: Recognition[] = [
  {
    title: 'NVIDIA GTC 2025 - Featured Speaker',
    issuer: 'NVIDIA GTC 2025',
    date: 'March 2025',
    description: '"EY Voice: AI-Powered Contact Centers" - presented enterprise AI platform architecture to 500+ attendees, demonstrating 45% call-reduction metrics.',
    id: 'rec1',
  },
  {
    title: 'EY Wealth Asset Management Hackathon Winner',
    issuer: 'Ernst and Young LLP',
    date: 'February 2025',
    description: 'Built a multi-agent platform automating wealth-management workflows; won the $50K prize.',
    id: 'rec2',
  },
  {
    title: "Dean's Scholar & March Fund Award",
    issuer: 'University of California, Davis',
    date: '2020-2022',
    description: 'Top 16% of class for academic excellence and leadership impact.',
    id: 'rec3',
  },
]

export const EMAIL = 'thockchomkabeer@gmail.com'

export const LAST_UPDATED = '2026-08-07'

// Resume-tab PDF: self-hosted download + Google Drive preview.
export const RESUME_PDF_DOWNLOAD = '/Kabeer_Thockchom_Resume.pdf'
export const RESUME_PDF_PREVIEW = 'https://drive.google.com/file/d/1o0xc-DgIRA8UTWNnnv0t3p1YyjT-vuGp/preview'

/**
 * Builds the chatbot's knowledge base from the structured data above so there is
 * a single source of truth. Editing the arrays here automatically updates both the
 * visible site and what the resume chatbot knows - no second copy to keep in sync.
 */
export function buildKnowledgeBase(): string {
  const experience = WORK_EXPERIENCE.map((job) => {
    const bullets = job.accomplishments.map((a) => `  - ${a}`).join('\n')
    return `${job.title} at ${job.company} (${job.start} - ${job.end}, ${job.location}):\n${bullets}`
  }).join('\n\n')

  const projects = PROJECTS.map((p) => {
    const gh = p.githubUrl ? ` [GitHub: ${p.githubUrl}]` : ''
    return `- ${p.name}: ${p.description} Tech: ${p.techStack.join(', ')}.${gh}`
  }).join('\n')

  const education = EDUCATION.map((e) => {
    const parts = [`${e.degree}, ${e.school} (${e.start} - ${e.end}, ${e.location})`]
    if (e.focus) parts.push(`Focus: ${e.focus}`)
    if (e.gpa) parts.push(`GPA: ${e.gpa}`)
    if (e.minors?.length) parts.push(`Minors: ${e.minors.join(', ')}`)
    if (e.honors?.length) parts.push(`Honors: ${e.honors.join(', ')}`)
    return `- ${parts.join('. ')}`
  }).join('\n')

  const skills = SKILLS.map((s) => `- ${s.category}: ${s.items.join(', ')}`).join('\n')
  const certs = CERTIFICATIONS.map((c) => `- ${c.name} (${c.issuer}, ${c.year})`).join('\n')
  const recognition = RECOGNITION.map((r) => `- ${r.title} (${r.issuer}, ${r.date}): ${r.description ?? ''}`).join('\n')

  return `About Kabeer Singh Thockchom:
Kabeer is a Solutions Architect on the Field Engineering team at Databricks (Retail, Travel & Hospitality), based in San Francisco, CA. He has 4+ years of customer-facing AI experience and currently drives greenfield account strategy across 21+ Fortune 500 retail, travel, and hospitality accounts on the Databricks Lakehouse - running technical discovery with C-suite buyers, architecting migrations off Snowflake / BigQuery / Domo / Power BI / AS400, and shipping customer-facing demos and reusable reference assets. He is a hands-on builder of multi-agent platforms, LLM-powered demos, and RAG architectures shipped to 10+ Fortune 500 customers. He was a featured speaker at NVIDIA GTC 2025 and an EY hackathon winner. Contact: ${EMAIL}.

Work Experience:
${experience}

Key Projects & Demos:
${projects}

Education:
${education}

Technical Skills:
${skills}

Certifications:
${certs}

Recognition & Speaking:
${recognition}

Mission: Bridge the gap between cutting-edge AI technology and practical business solutions, creating products that showcase technical excellence and solve real-world problems.

Personal Interests: AI/ML, Economics, Product Development/Management, Dogs, Tea, Hiking, Movies. Fascinated by the intersection of AI, business, and human-centered design; believes in building technology that enhances human capabilities rather than replacing them.`
}
