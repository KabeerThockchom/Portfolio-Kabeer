type Project = {
  name: string
  description: string
  link: string
  video: string
  id: string
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
    name: 'Text2SQL - Natural Language Business Intelligence',
    description: 'AI-powered Text2SQL solution that seamlessly converts natural language into precise SQL queries, empowering business teams to unlock insights effortlessly. Built-in adaptive learning for query accuracy, customizable database documentation for pinpoint searches, 100+ chart types for rich visualizations, and versatile data export options. Transform your data interaction and decision-making process today. Tech Stack: React, OpenAI gpt-4o-mini, SQLite, Plotly, FastAPI, Docker, LangSmith',
    link: 'https://text2sql.fly.dev',
    video:
      'https://res.cloudinary.com/dslghpuru/video/upload/v1745351268/text2sqlkabeer.mov',
    id: 'project1',
  },
  {
    name: 'EY Voice - EY Generative AI Call Center as a Service',
    description: 'EY Voice is a groundbreaking AI-powered tool that revolutionizes customer interaction analysis. By leveraging advanced AI and LLMs, it extracts actionable insights from diverse communication channels, driving productivity, automation, and digital transformation across enterprises. Tech Stack: React, Azure Serverless Functions, Azure VM, Azure MSSQL, AzureOpenAI gpt-4o, FastAPI, Docker, LangSmith',
    link: 'https://genaiccdeploy.azurewebsites.net/',
    video:
      'https://res.cloudinary.com/dslghpuru/video/upload/v1745352258/eyvoice_jceshm.mov',
    id: 'project2',
  },
  {
    name: 'BottegaAI - Customer AI for Restaurants',
    description: 'AI-powered voice agent revolutionizing restaurant operations by handling phone interactions, order placement, and personalization. Seamlessly integrates with POS systems, supports 50+ languages, and manages the entire customer journey. Streamlines operations while enhancing customer experience through AI-driven efficiency. Tech Stack: React, Twilio, AWS EC2, Anthropic Claude 3.5 Haiku, Stripe, Docker, LangSmith',
    link: 'https://res.cloudinary.com/dslghpuru/video/upload/v1745352254/restaurauntAI_alafcl.mp4',
    video:
      'https://res.cloudinary.com/dslghpuru/video/upload/v1745352254/restaurauntAI_alafcl.mp4',
    id: 'project3',
  },
  {
    name: 'EYLAR - EY Local Agentic RAG',
    description: 'Completely Local Agentic RAG system empowering EY consultants with personalized knowledge search across multiple file formats (PPT, Word, PDF, Excel). Agentic and on edge knowledge search with built-in privacy controls and precision guardrails, delivering accurate generative responses with transparent in-line citations. Transforms information retrieval while enhancing consultant productivity through AI-driven knowledge management. Tech Stack: React, LangGraph, Qdrant, Ollama, Docker, LangSmith',
    link: 'https://www.youtube.com/watch?v=Ra3PvUVTPc4',
    video:
      'https://res.cloudinary.com/dslghpuru/video/upload/v1745352617/EYLAR_g4rxpb.mp4',
    id: 'project4',
  },
  {
    name: 'DocIntel - Knowledge Search & Automation for Teachers',
    description: 'AI-powered education platform for knowledge search and workflow automation for teachers. Featuring advanced handwriting recognition via vision LLM models and seamless integration with Google Drive with robust authentication and session management. Enables teachers to create automated workflows for grading, worksheet generation, and curriculum planning. Features a school-wide knowledge search assistant that provides transparent search results with source attribution, empowering educators to leverage institutional knowledge efficiently. Tech Stack: React, Google Drive API, Anthropic Claude 3.5 Sonnet, OAuth 2.0, Qdrant, FastAPI, LangSmith',
    link: 'https://www.youtube.com/watch?v=VimZ6YngrFI',
    video:'https://res.cloudinary.com/dslghpuru/video/upload/v1745352616/Doc_Intel_Demo_qyxjbe.mp4',
    id: 'project5',
  },
  {
    name: 'Generative UI Banking POC',
    description: 'Created a dynamic UI generation system AI chatbot for a banking client using LangGraph.js, GPT-4o-mini, and Vercel AI SDK. Developed real-time component rendering within an enhanced chat interface, delivering contextually appropriate visual elements during customer conversations. Tech Stack: React, LangGraph.js, GPT-4o-mini, Vercel AI SDK, Docker, LangSmith',
    link: 'https://res.cloudinary.com/dslghpuru/video/upload/v1745353337/eygenui_hv5rv9.mov',
    video:
      'https://res.cloudinary.com/dslghpuru/video/upload/v1745353337/eygenui_hv5rv9.mov',
    id: 'project6',
  },
  {
    name: 'AI Monopoly Arena',
    description: 'Play Monopoly against leading LLM models from OpenAI, Anthropic, and Gemini. Engage in trade, negotiation, and strategy to win the game. Tech Stack: HTML, CSS, JavaScript',
    link: 'https://res.cloudinary.com/dslghpuru/video/upload/v1745353572/mono_zg8pzk.mov',
    video: 'https://res.cloudinary.com/dslghpuru/video/upload/v1745353572/mono_zg8pzk.mov',
    id: 'project7',
  },
  {
    name: 'ETF AI',
    description: 'AI-powered financial platform revolutionizing ETF data analysis by processing 10K+ daily queries with 95% accuracy. Supports real-time data visualization, and manages complex financial insights through natural language. Streamlines investment decision-making while enhancing user experience through AI-driven financial intelligence. Tech Stack: React, Snowflake, Vanna AI, OpenAI gpt-4o-mini, Docker, LangSmith',
    link: 'https://prod.quantie.com/',
    video:'https://res.cloudinary.com/dslghpuru/video/upload/v1745352744/quantie_yrbjte.mov',
    id: 'project8',
  }
]

type Accomplishment = {
  text: string;
};

type Education = {
  school: string;
  degree: string;
  location: string;
  start: string;
  end: string;
  gpa?: string;
  honors?: string[];
  focus?: string;
  minors?: string[];
  id: string;
};

type Skill = {
  category: string;
  items: string[];
};

export const WORK_EXPERIENCE: WorkExperience[] = [
  {
    company: 'Ernst and Young LLP',
    title: 'AI & Data Consultant',
    start: 'October 2023',
    end: 'Present',
    location: 'San Francisco, CA',
    link: 'https://www.ey.com/en_mt/events/agenda-themes/data-and-ai',
    accomplishments: [
      'Led development of EY Voice, an enterprise-grade AI-powered call center dashboard using NLP, LLM entity tagging, semantic search, and AI analytics for a Fortune 500 financial client that drove a 45% reduction in call resolution times and secured $1.2M in funding. Presented at NVIDIA GTC 2025.',
      'Leading a full-cycle enterprise AI search initiative—from discovery to production—by architecting a proprietary orchestrator layer in AWS and LangChain that seamlessly scales across multiple teams and projects.',
      'Implemented enterprise AI agents for customer service automation, enterprise search, and operational efficiency. Spearheaded a robust AI testing and evaluation framework to measure LLM performance, reliability, and trustworthiness.',
      'Generated over 50,000 call center transcripts using OpenAI GPT-3.5/4, Anthropic Claude 3 Opus, and open-source models. Developed prompt engineering techniques for batch generation and storage in MSSQL.',
      'Built a semantic search product for nuanced call querying by implementing cosine similarity, TF-IDF algorithms, and AI-tagged metadata filtering using HuggingFace, Azure OpenAI, and Qdrant.',
      'Developed a compliance product featuring entity tagging and named entity recognition (NER), reducing required manpower by 45%.',
      'Created an AI-generated feedback product using advanced SQL functions and NLP-extracted insights, improving agent performance by 25% across 10 metrics.',
      'Led cross-functional projects in generative AI (RAG, vector search) to monitor real-time sentiment across 20K+ daily interactions.',
      'Spearheaded the implementation of dual-model forecasting for a $3.2B portfolio, improving accuracy by 40%.',
      'Managed global teams (15 engineers across 3 locations), optimizing sprint cycles by 35% and accelerating velocity by 40%.',
      'Improved average handling time for an $8T AUM wealth management client by 30%, processing 1M+ daily interactions.',
      'Developed an AI transformation framework that raised CSAT by 25%, creating new standards for AI governance and enterprise rollout.'
    ],
    id: 'work1',
  },
  {
    company: 'Stealth Startup',
    title: 'Founder & CEO',
    start: 'January 2024',
    end: 'Present',
    location: 'San Francisco, CA',
    link: 'https://trybytes.ai/',
    accomplishments: [
      'Developed proprietary customer service AI agent (Bottega AI) achieving 40% reduction in order processing time and 25% increase in upselling through intelligent restaurant ordering system.',
      'Architected natural language data analysis platform for a leading ETF firm (Talk2Data AI) processing 10K+ daily financial queries with 95% accuracy.',
      'Built enterprise-grade Local Agentic RAG system reducing latency by 60% and improving response accuracy by 35% through optimized architecture.',
      'Oversaw end-to-end project delivery, including scope definition, timeline management, and risk mitigation, ensuring seamless integration with client engineering teams.'
    ],
    id: 'work2',
  },
  {
    company: 'Ernst and Young LLP',
    title: 'Quantitative Consulting Intern',
    start: 'June 2022',
    end: 'August 2022',
    location: 'San Francisco, CA',
    link: 'https://www.ey.com/en_us/services/consulting/financial-services-risk-management',
    accomplishments: [
      'Overhauled a regional bank\'s CECL framework, reducing implementation timeline by 30% and presenting a data-driven roadmap to executive leadership.',
      'Led workshops for 30+ senior directors, introducing 5 new risk assessment methodologies that achieved 100% CECL compliance.',
      'Developed 6 end-to-end process workflows with robust risk controls, increasing operational efficiency by 40%.'
    ],
    id: 'work3',
  },
  {
    company: 'UC Davis Health',
    title: 'Digital Health & Innovation Intern',
    start: 'June 2021',
    end: 'August 2022',
    location: 'Davis, CA',
    link: 'https://health.ucdavis.edu/CoLab/',
    accomplishments: [
      'Automated vaccine and healthcare data reporting (10,000+ points) with interactive Excel dashboards, enabling real-time KPI tracking.',
      'Owned project documentation (TRUTH documents, project timelines) and provided weekly status reports for leadership.',
      'Demystified core statistical concepts (A/B testing, regression analysis) for non-technical stakeholders.'
    ],
    id: 'work4',
  },
  {
    company: 'UC Davis Graduate School of Management',
    title: 'Research Analyst',
    start: 'June 2021',
    end: 'August 2022',
    location: 'Davis, CA',
    link: 'https://gsm.ucdavis.edu/',
    accomplishments: [
      'Led a 10-person team in classifying acquisitions/mergers research snippets, reducing review turnaround times by 30%.',
      'Created a comprehensive annotated dataset for NLP research, increasing labeling consistency by 25%.',
      'Fine-tuned a BERT-based NLP model, raising predictive accuracy by 15%.'
    ],
    id: 'work5',
  }
];

export const EDUCATION: Education[] = [
  {
    school: 'University of Texas, Austin',
    degree: 'M.S. in Data Science',
    location: 'Austin, TX',
    start: 'January 2025',
    end: 'Present',
    focus: 'Machine Learning, Big Data Analytics, Gen AI Applications',
    id: 'edu1'
  },
  {
    school: 'University of California, Davis',
    degree: 'B.S. Computer Science & Quantitative Economics',
    location: 'Davis, CA',
    start: 'September 2019',
    end: 'June 2023',
    gpa: '3.7/4.0',
    minors: ['Statistics', 'Technology Management'],
    honors: ['Dean\'s Scholar (2020, 2021, 2022)', 'March Fund Award (2022)'],
    id: 'edu2'
  }
];

export const SKILLS: Skill[] = [
  {
    category: 'Programming Languages',
    items: ['Python', 'TypeScript', 'SQL', 'STATA', 'R']
  },
  {
    category: 'Web Technologies',
    items: ['React', 'Next.js', 'Streamlit', 'Flask', 'WebSockets', 'FastAPI']
  },
  {
    category: 'Database Systems',
    items: ['PostgreSQL', 'Qdrant', 'MSSQL', 'MongoDB']
  },
  {
    category: 'Data Science & Machine Learning',
    items: ['Pandas', 'PyTorch', 'Linear Regression', 'Random Forest', 'Multi-Armed Bandit', 'NLP', 'CUDA', 'LLM', 'LoRA finetuning']
  },
  {
    category: 'Cloud Technologies',
    items: ['Azure', 'Google Cloud Platform', 'AWS', 'Fly.io', 'Render', 'Vercel']
  },
  {
    category: 'DevOps & Version Control',
    items: ['Github', 'Git', 'Docker', 'Postman', 'CI/CD']
  },
  {
    category: 'Specialized Areas',
    items: ['AI Agents', 'Product Management', 'Full-Stack Web App Dev', 'Agile/Scrum']
  },
  {
    category: 'Other Tools & Technologies',
    items: ['Excel', 'PowerPoint', 'Snowflake', 'Kore.AI', 'Azure ML/AI Studio', 'AWS Lambda']
  },
  {
    category: 'Languages',
    items: ['English (Native/Bilingual)', 'Hindi (Native/Bilingual)', 'Punjabi (Conversational)', 'Spanish (Conversational)']
  }
]

export const BLOG_POSTS: BlogPost[] = [
  {
    title: 'How to build a enterprise ready Text to SQL application',
    description: 'A deep dive into building a Text to SQL application',
    link: 'https://medium.com/@thockchomkabeer/text2sql-transforming-natural-language-into-sql-queries-cc911f11bd78',
    uid: 'blog-1',
  },
  {
    title: 'How to build a ML model to predict Premier League Season & Match Results',
    description: 'A deep dive into building a ML model to predict Premier League Season & Match Results',
    link: 'https://docs.google.com/document/d/1U6lkcSmnxW4RwvFIUdSesEVX_bXsSFVm/edit?usp=sharing&ouid=109640699554357737812&rtpof=true&sd=true',
    uid: 'blog-2',
  },
  {
    title: 'Case Study on Wells Fargo "8 is great" scandal',
    description: 'A deep dive analysis into Wells Fargo "8 is great" scandal, what went wrong, and how to prevent it in the future',
    link: 'https://docs.google.com/presentation/d/1eEI_uHqw4Ay_8JOnqOytPtHil2A2VyrR/edit?usp=drive_link&ouid=109640699554357737812&rtpof=true&sd=true',
    uid: 'blog-3',
  }
]

export const SOCIAL_LINKS: SocialLink[] = [
  {
    label: 'Github',
    link: 'https://github.com/KabeerThockchom',
  },
  {
    label: 'LinkedIn',
    link: 'https://www.linkedin.com/in/kabeerthockchom',
  }
]

export const EMAIL = 'thockchomkabeer@gmail.com'
