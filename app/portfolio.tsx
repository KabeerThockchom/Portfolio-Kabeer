'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import {
  ArrowDown,
  ArrowUpRight,
  ArrowRight,
  Workflow,
  Github,
  Play,
  X,
  Download,
  Send,
  ExternalLink,
} from 'lucide-react'
import {
  PROFILE,
  PROJECTS,
  WORK_EXPERIENCE,
  EDUCATION,
  SKILLS,
  BLOG_POSTS,
  RECOGNITION,
  EMAIL,
  RESUME_PDF_DOWNLOAD,
  type Project,
} from './data'

type Category = 'All work' | Project['category']
const CATEGORIES: Category[] = [
  'All work',
  'Agents',
  'Data & AI',
  'Applications',
]

function demoSource(source: string) {
  const driveId = source.match(/drive\.google\.com\/file\/d\/([\w-]+)/)?.[1]
  const loomId = source.match(/loom\.com\/share\/([\w-]+)/)?.[1]
  if (driveId)
    return {
      url: `https://drive.google.com/file/d/${driveId}/preview`,
      embed: true,
    }
  if (loomId)
    return { url: `https://www.loom.com/embed/${loomId}`, embed: true }
  return { url: source, embed: false }
}

function ProjectCard({ project }: { project: Project }) {
  const [demoOpen, setDemoOpen] = useState(false)
  const source = project.video ? demoSource(project.video) : null
  return (
    <article
      className={`project-card project-${project.category === 'Agents' ? 'agents' : project.category === 'Data & AI' ? 'data' : 'apps'}`}
    >
      <div className="project-visual">
        <Image
          src={project.image}
          alt={project.imageAlt}
          fill
          sizes="(max-width: 760px) calc(100vw - 40px), (max-width: 1080px) 46vw, 580px"
          quality={85}
        />
      </div>
      <div className="project-content">
        <p className="eyebrow project-category">{project.category}</p>
        <h3>{project.name}</h3>
        <p className="project-description">
          {project.summary || project.description}
        </p>
        <details className="project-notes">
          <summary>
            Details<span>+</span>
          </summary>
          <p>{project.description}</p>
        </details>
        <div className="tech-tags">
          {project.techStack.slice(0, 3).map((tech) => (
            <span key={tech}>{tech}</span>
          ))}
          {project.techStack.length > 3 && (
            <span title={project.techStack.slice(3).join(', ')}>
              +{project.techStack.length - 3}
            </span>
          )}
        </div>
        <div className="project-actions">
          {source ? (
            <button
              type="button"
              aria-expanded={demoOpen}
              aria-controls={`demo-${project.id}`}
              onClick={() => setDemoOpen(!demoOpen)}
            >
              <span>
                {demoOpen ? <X size={14} /> : <Play size={14} />}
                {demoOpen ? 'Close demo' : 'Watch demo'}
              </span>
            </button>
          ) : (
            <a href={project.link} target="_blank" rel="noopener noreferrer">
              {project.id === 'project-maops' ||
              project.id === 'project-smallville'
                ? 'Platform context'
                : 'View project'}
              <ArrowUpRight size={16} />
            </a>
          )}
          {project.githubUrl ? (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Source code for ${project.name}`}
            >
              <Github size={15} />
              <span>Source</span>
            </a>
          ) : (
            source && (
              <a href={project.link} target="_blank" rel="noopener noreferrer">
                View project
                <ArrowUpRight size={16} />
              </a>
            )
          )}
        </div>
      </div>
      {source && (
        <div
          id={`demo-${project.id}`}
          hidden={!demoOpen}
          className="project-demo"
        >
          {demoOpen &&
            (source.embed ? (
              <iframe
                src={source.url}
                title={`${project.name} demo video`}
                allow="fullscreen; picture-in-picture"
                allowFullScreen
                loading="lazy"
              />
            ) : (
              <video src={source.url} controls preload="none" playsInline />
            ))}
          <a href={project.video} target="_blank" rel="noopener noreferrer">
            Open video in a new tab
            <ExternalLink size={12} />
          </a>
        </div>
      )}
    </article>
  )
}

function ResumeChat() {
  const [messages, setMessages] = useState<
    { role: 'user' | 'assistant'; content: string }[]
  >([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const list = useRef<HTMLDivElement>(null)
  const sending = useRef(false)
  useEffect(() => {
    if (list.current) list.current.scrollTop = list.current.scrollHeight
  }, [messages, loading])
  async function send(question?: string) {
    const message = (question || input).trim()
    if (!message || sending.current) return
    sending.current = true
    setLoading(true)
    setError('')
    setInput('')
    setMessages((previous) => [...previous, { role: 'user', content: message }])
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      })
      const data = await response.json()
      if (!response.ok || typeof data.response !== 'string')
        throw new Error(
          response.status === 429
            ? 'The assistant is busy. Try again in a minute, or read my resume above.'
            : response.status === 503 || response.status === 502
              ? 'The assistant is temporarily unavailable. You can read my resume or contact me directly.'
              : 'The assistant could not answer. Please try again or contact me directly.',
        )
      setMessages((previous) => [
        ...previous,
        { role: 'assistant', content: data.response },
      ])
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : 'Could not connect. Please try again.',
      )
      setInput(message)
      setMessages((previous) => previous.slice(0, -1))
    } finally {
      setLoading(false)
      sending.current = false
    }
  }
  return (
    <div className="resume-chat">
      <div className="chat-heading">
        <span className="chat-symbol">
          <Workflow size={18} />
        </span>
        <div>
          <h3>Portfolio assistant</h3>
          <p>Answers from my published background.</p>
        </div>
      </div>
      <div
        className="chat-messages"
        ref={list}
        role="log"
        aria-label="Resume conversation"
        aria-live="polite"
      >
        <p className="chat-welcome">
          Ask about a project, role, or technical skill.
        </p>
        {messages.map((message, index) => (
          <p key={index} className={`chat-message ${message.role}`}>
            <span>
              {message.role === 'user' ? 'You' : 'Portfolio assistant'}
            </span>
            {message.content}
          </p>
        ))}
        {loading && (
          <p className="chat-thinking" role="status">
            Finding the relevant details…
          </p>
        )}
      </div>
      <div className="chat-prompts">
        {[
          'What do you build at Databricks?',
          'Tell me about your AI projects.',
        ].map((question) => (
          <button
            key={question}
            type="button"
            disabled={loading}
            onClick={() => send(question)}
          >
            {question}
          </button>
        ))}
      </div>
      {error && (
        <p className="chat-error" role="alert">
          {error}
        </p>
      )}
      <form
        className="chat-form"
        onSubmit={(event) => {
          event.preventDefault()
          void send()
        }}
      >
        <label className="sr-only" htmlFor="resume-question">
          Question about Kabeer’s background
        </label>
        <input
          id="resume-question"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Ask a question…"
          maxLength={2000}
          disabled={loading}
        />
        <button
          type="submit"
          aria-label="Send question"
          disabled={loading || !input.trim()}
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  )
}

function ExperienceItem({ job }: { job: (typeof WORK_EXPERIENCE)[number] }) {
  return (
    <article className="experience-item">
      <div className="job-heading">
        <a href={job.link} target="_blank" rel="noopener noreferrer">
          <h3>{job.company}</h3>
        </a>
        <span className="job-date">
          {job.start} — {job.end}
        </span>
      </div>
      <p className="job-title">{job.title}</p>
      <details className="job-details">
        <summary>
          Role details<span>+</span>
        </summary>
        <ul>
          {job.accomplishments.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </details>
    </article>
  )
}

export default function Portfolio() {
  const [category, setCategory] = useState<Category>('All work')
  const [showAll, setShowAll] = useState(false)
  const [resumeOpen, setResumeOpen] = useState(false)
  const filtered = PROJECTS.filter(
    (project) => category === 'All work' || project.category === category,
  )
  const visible =
    category === 'All work' && !showAll
      ? filtered.filter((project) => project.featured)
      : filtered
  return (
    <main id="main">
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <h1 id="hero-title">
            Building useful <em>AI.</em>
          </h1>
          <p className="hero-intro">
            I build AI agents, data platforms, and applications at Databricks.
            Based in {PROFILE.location}.
          </p>
          <a className="text-link hero-work" href="#work">
            Explore my work
            <ArrowDown size={16} />
          </a>
        </div>
        <div className="hero-portrait">
          <Image
            src="/kabeer.png"
            alt="Kabeer Thockchom"
            fill
            sizes="(max-width: 760px) 140px, 220px"
            priority
          />
        </div>
      </section>

      <section
        className="content-section work-section"
        id="work"
        aria-labelledby="work-title"
      >
        <div className="section-heading">
          <h2 id="work-title">Projects</h2>
        </div>
        <div className="project-toolbar">
          <div
            className="project-filters"
            role="group"
            aria-label="Filter projects"
          >
            {CATEGORIES.map((item) => (
              <button
                type="button"
                key={item}
                aria-pressed={category === item}
                onClick={() => {
                  setCategory(item)
                  setShowAll(false)
                }}
              >
                {item}
              </button>
            ))}
          </div>
          <p className="project-count" aria-live="polite">
            {visible.length} of {PROJECTS.length}
          </p>
        </div>
        <div className="projects-grid">
          {visible.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
        {category === 'All work' && (
          <button
            className="button button-outline all-projects"
            type="button"
            aria-expanded={showAll}
            onClick={() => setShowAll(!showAll)}
          >
            {showAll
              ? 'Show selected work'
              : `Explore all ${PROJECTS.length} projects`}
            <ArrowRight size={16} />
          </button>
        )}
        <p className="section-note">
          AI-generated covers. Enterprise examples are generalized.
        </p>
      </section>

      <section
        className="content-section writing-section"
        id="writing"
        aria-labelledby="writing-title"
      >
        <div className="section-heading">
          <h2 id="writing-title">Writing</h2>
        </div>
        <div className="writing-list">
          {BLOG_POSTS.slice(0, 3).map((post) => (
            <a
              className="writing-row"
              key={post.uid}
              href={post.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              <h3>{post.title}</h3>
              <ArrowUpRight size={19} />
            </a>
          ))}
        </div>
        <details className="more-writing">
          <summary>
            More writing & research<span>+</span>
          </summary>
          <div>
            {BLOG_POSTS.slice(3).map((post) => (
              <a
                key={post.uid}
                href={post.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                {post.title}
                <ArrowUpRight size={16} />
              </a>
            ))}
          </div>
        </details>
      </section>

      <section
        className="content-section experience-section"
        id="experience"
        aria-labelledby="experience-title"
      >
        <div className="section-heading">
          <h2 id="experience-title">Background</h2>
        </div>
        <div className="experience-grid">
          <div className="work-history">
            {WORK_EXPERIENCE.slice(0, 2).map((job) => (
              <ExperienceItem key={job.id} job={job} />
            ))}
            <details className="earlier-experience">
              <summary>
                Earlier experience<span>+</span>
              </summary>
              {WORK_EXPERIENCE.slice(2).map((job) => (
                <ExperienceItem key={job.id} job={job} />
              ))}
            </details>
          </div>
          <div className="education-column">
            {EDUCATION.map((education) => (
              <article className="education-card" key={education.id}>
                <h3>{education.school}</h3>
                <p>{education.degree}</p>
                {education.minors && (
                  <p className="education-focus">
                    Minors: {education.minors.join(' · ')}
                  </p>
                )}
              </article>
            ))}
            <p className="personal-note">
              Outside work: tennis, hiking, and Real Madrid.
            </p>
          </div>
        </div>
        <details className="skills-details">
          <summary>
            Skills<span>+</span>
          </summary>
          <div className="skills-grid">
            {SKILLS.map((skill) => (
              <div key={skill.category}>
                <h3>{skill.category}</h3>
                <div className="tech-tags">
                  {skill.items.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </details>
        <details className="recognition-details">
          <summary>
            Recognition & speaking<span>+</span>
          </summary>
          <div>
            {RECOGNITION.map((item) => (
              <p key={item.id}>
                {item.title}
                <span>{item.date}</span>
              </p>
            ))}
          </div>
        </details>
      </section>

      <section
        className="content-section resume-section"
        id="resume"
        aria-labelledby="resume-title"
      >
        <div className="section-heading">
          <h2 id="resume-title">Resume</h2>
          <a
            className="text-link"
            href={RESUME_PDF_DOWNLOAD}
            download="Kabeer_Thockchom_Resume.pdf"
          >
            Download PDF
            <Download size={16} />
          </a>
        </div>
        <details
          className="resume-preview"
          onToggle={(event) => setResumeOpen(event.currentTarget.open)}
        >
          <summary>
            Preview the PDF<span>+</span>
          </summary>
          {resumeOpen && (
            <iframe
              src={`${RESUME_PDF_DOWNLOAD}#toolbar=0`}
              title="Kabeer Thockchom’s resume PDF"
              loading="lazy"
            />
          )}
          <a
            href={RESUME_PDF_DOWNLOAD}
            target="_blank"
            rel="noopener noreferrer"
          >
            Open the PDF
            <ExternalLink size={13} />
          </a>
        </details>
        <details className="assistant-details">
          <summary>
            Ask about my background<span>+</span>
          </summary>
          <ResumeChat />
        </details>
      </section>

      <section
        className="contact-section"
        id="contact"
        aria-labelledby="contact-title"
      >
        <h2 id="contact-title">Get in touch.</h2>
        <a className="contact-email" href={`mailto:${EMAIL}`}>
          {EMAIL}
          <ArrowUpRight size={19} />
        </a>
      </section>
    </main>
  )
}
