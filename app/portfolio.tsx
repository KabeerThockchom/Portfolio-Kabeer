'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import {
  ArrowDown,
  ArrowUpRight,
  ArrowRight,
  Database,
  Layers,
  Workflow,
  Github,
  Play,
  X,
  Download,
  Send,
  MapPin,
  ExternalLink,
} from 'lucide-react'
import { ContactForm } from '@/components/ui/contact-form'
import {
  PROFILE,
  APPROACH,
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

function SectionHeading({
  number,
  label,
  title,
  description,
}: {
  number: string
  label: string
  title: string
  description?: string
}) {
  return (
    <div className="section-heading">
      <div>
        <p className="eyebrow">
          {number} / {label}
        </p>
        <h2>{title}</h2>
      </div>
      {description && <p className="section-description">{description}</p>}
    </div>
  )
}

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
  const Icon =
    project.category === 'Agents'
      ? Workflow
      : project.category === 'Data & AI'
        ? Database
        : Layers
  return (
    <article
      className={`project-card project-${project.category === 'Agents' ? 'agents' : project.category === 'Data & AI' ? 'data' : 'apps'}`}
    >
      <div className="project-visual" aria-hidden="true">
        <span className="project-visual-label">
          {project.category === 'Agents'
            ? 'REASON · COORDINATE · ACT'
            : project.category === 'Data & AI'
              ? 'CONTEXT · QUERY · ANSWER'
              : 'INTERFACE · INTELLIGENCE · ACTION'}
        </span>
        <div className="project-diagram">
          <span className="diagram-node">
            {project.category === 'Agents' ? 'Context' : 'Input'}
          </span>
          <span className="diagram-path" />
          <span className="diagram-center">
            <Icon size={28} strokeWidth={1.4} />
          </span>
          <span className="diagram-path" />
          <span className="diagram-node">
            {project.category === 'Agents' ? 'Action' : 'Result'}
          </span>
        </div>
        <span className="project-visual-foot">
          {project.techStack.slice(0, 2).join(' / ')}
        </span>
      </div>
      <div className="project-content">
        <p className="eyebrow project-category">
          {project.category}
          <span>{project.featured ? 'SELECTED WORK' : 'EXPLORATION'}</span>
        </p>
        <h3>{project.name}</h3>
        <p className="project-description">
          {project.summary || project.description}
        </p>
        <details className="project-notes">
          <summary>
            Technical notes<span>+</span>
          </summary>
          <p>{project.description}</p>
        </details>
        <div className="tech-tags">
          {project.techStack.slice(0, 4).map((tech) => (
            <span key={tech}>{tech}</span>
          ))}
          {project.techStack.length > 4 && (
            <span title={project.techStack.slice(4).join(', ')}>
              +{project.techStack.length - 4}
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
          <h3>Ask about my work.</h3>
          <p>An AI guide to my published background.</p>
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
          What would you like to know about my experience, projects, or
          technical skills?
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
          <p className="eyebrow">
            <span className="status-dot" /> FIELD ENGINEERING AT DATABRICKS
          </p>
          <h1 id="hero-title">
            AI systems for
            <br />
            the <em>real world.</em>
          </h1>
          <p className="hero-intro">I’m Kabeer. {PROFILE.summary}</p>
          <div className="hero-actions">
            <a className="button button-primary" href="#work">
              Explore my work
              <ArrowDown size={17} />
            </a>
            <a className="text-link" href={RESUME_PDF_DOWNLOAD} download>
              Get my resume
              <ArrowUpRight size={16} />
            </a>
          </div>
          <p className="hero-location">
            <MapPin size={13} />
            {PROFILE.location}
            <span> · </span>Builder. Architect. Always a student.
          </p>
        </div>
        <div className="hero-art">
          <Image
            className="hero-ocean"
            src="/ocean-background.png"
            alt=""
            fill
            sizes="(max-width: 760px) 100vw, 42vw"
            priority
            quality={80}
          />
          <div className="art-coordinate">37.77° N / 122.42° W</div>
          <div className="portrait-frame">
            <Image
              src="/kabeer.png"
              alt="Kabeer Thockchom"
              width={230}
              height={230}
              sizes="230px"
              priority
            />
          </div>
          <div className="hero-art-caption">
            <span className="eyebrow">BUSINESS CONTEXT → WORKING SYSTEM</span>
            <p>
              Built with curiosity.
              <br />
              Grounded in evidence.
            </p>
          </div>
          <span className="hero-art-plus" aria-hidden="true">
            +
          </span>
        </div>
      </section>
      <div
        className="background-strip"
        aria-label="Professional and academic background"
      >
        <span className="eyebrow">WHERE I BUILD & LEARN</span>
        <div>
          <Image src="/logos/databricks.svg" alt="" width={25} height={25} />
          <span>
            Databricks<small>Field Engineering</small>
          </span>
        </div>
        <div>
          <Image src="/logos/ey.svg" alt="" width={27} height={25} />
          <span>
            EY<small>Previously</small>
          </span>
        </div>
        <div>
          <Image src="/logos/utaustin.svg" alt="" width={26} height={25} />
          <span>
            UT Austin<small>Data Science</small>
          </span>
        </div>
        <div>
          <Image src="/logos/ucdavis.svg" alt="" width={26} height={25} />
          <span>
            UC Davis<small>Economics & statistics</small>
          </span>
        </div>
      </div>
      <section className="content-section work-section" id="work">
        <SectionHeading
          number="01"
          label="SELECTED WORK"
          title="From an idea to a working system."
          description="Agent systems, useful interfaces, and the data foundations behind them. Explore the work and see how it runs."
        />
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
            {visible.length} of {PROJECTS.length} projects
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
          Enterprise examples are generalized. Diagrams illustrate the patterns;
          demo videos show the applications.
        </p>
      </section>
      <section className="approach-section" id="approach">
        <div className="approach-intro">
          <p className="eyebrow">02 / HOW I BUILD</p>
          <h2>
            The system matters.
            <br />
            <em>So does the outcome.</em>
          </h2>
          <p>
            Good architecture connects the business decision to the data, the
            application, and the person using it.
          </p>
        </div>
        <ol className="approach-list">
          {APPROACH.map((step, index) => (
            <li key={step.title}>
              <span>0{index + 1}</span>
              <div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>
      <section className="content-section writing-section" id="writing">
        <SectionHeading
          number="03"
          label="IDEAS IN THE OPEN"
          title="Notes from building."
          description="What I learn about agents, data, and the craft of making useful software."
        />
        <div className="writing-list">
          {BLOG_POSTS.slice(0, 3).map((post, index) => (
            <a
              className="writing-row"
              key={post.uid}
              href={post.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="writing-number">0{index + 1}</span>
              <div>
                <h3>{post.title}</h3>
                <p>{post.description}</p>
              </div>
              <ArrowUpRight size={23} />
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
                <ArrowUpRight size={17} />
              </a>
            ))}
          </div>
        </details>
      </section>
      <section className="content-section experience-section" id="experience">
        <SectionHeading
          number="04"
          label="BACKGROUND"
          title="Business context. Technical depth."
          description={PROFILE.perspective}
        />
        <div className="experience-grid">
          <div className="work-history">
            <h3 className="subheading">Where I’ve worked</h3>
            {WORK_EXPERIENCE.map((job, index) => (
              <article className="experience-item" key={job.id}>
                <div className="experience-mark">
                  {job.logo ? (
                    <Image src={job.logo} alt="" width={26} height={26} />
                  ) : (
                    <Layers size={23} />
                  )}
                </div>
                <div>
                  <div className="job-heading">
                    <a
                      href={job.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <h3>{job.company}</h3>
                    </a>
                    {index === 0 && (
                      <span className="current-label">CURRENT</span>
                    )}
                  </div>
                  <p className="job-title">{job.title}</p>
                  <p className="job-date">
                    {job.start} — {job.end}
                  </p>
                  <details className="job-details">
                    <summary>
                      What I worked on<span>+</span>
                    </summary>
                    <ul>
                      {job.accomplishments.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </details>
                </div>
              </article>
            ))}
          </div>
          <div className="education-column">
            <h3 className="subheading">Always learning</h3>
            {EDUCATION.map((education) => (
              <article className="education-card" key={education.id}>
                <div className="education-top">
                  {education.logo && (
                    <Image src={education.logo} alt="" width={29} height={29} />
                  )}
                  <span className="eyebrow">
                    {education.end === 'Present' ? 'IN PROGRESS' : 'FOUNDATION'}
                  </span>
                </div>
                <h3>{education.school}</h3>
                <p>{education.degree}</p>
                <span className="job-date">
                  {education.start} — {education.end}
                </span>
                {education.focus && (
                  <p className="education-focus">{education.focus}</p>
                )}
                {education.minors && (
                  <p className="education-focus">
                    Minors: {education.minors.join(' · ')}
                  </p>
                )}
              </article>
            ))}
            <div className="recognition-card">
              <p className="eyebrow">RECOGNITION & SPEAKING</p>
              {RECOGNITION.map((item) => (
                <div key={item.id}>
                  <h4>{item.title}</h4>
                  <p>{item.date}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <details className="skills-details">
          <summary>
            <span>
              Tools I work with
              <small>
                Data platforms, AI systems, software, and cloud infrastructure
              </small>
            </span>
            <span>+</span>
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
      </section>
      <section className="about-section" id="about">
        <div>
          <p className="eyebrow">THE PERSON BEHIND THE SYSTEM</p>
          <h2>Curious by default.</h2>
          <p>{PROFILE.about}</p>
          <p>
            Outside of work: a tennis court, a hiking trail, a cup of tea, or a
            Real Madrid match.
          </p>
          <div className="interest-tags">
            {PROFILE.interests.map((interest) => (
              <span key={interest}>{interest}</span>
            ))}
          </div>
        </div>
        <div className="about-pictures">
          <Image
            src="/life_work_pics/reliving_memories_at_real_madrid.JPG"
            alt="A visit to Real Madrid’s stadium"
            width={280}
            height={330}
            sizes="(max-width: 760px) 42vw, 220px"
            className="life-photo stadium-photo"
          />
          <Image
            src="/life_work_pics/graduation.jpeg"
            alt="Kabeer at his UC Davis graduation"
            width={220}
            height={280}
            sizes="(max-width: 760px) 35vw, 180px"
            className="life-photo graduation-photo"
          />
        </div>
      </section>
      <section className="content-section resume-section" id="resume">
        <SectionHeading
          number="05"
          label="GO A LITTLE DEEPER"
          title="Read it. Or ask about it."
          description="Download my resume, browse the PDF, or ask the portfolio assistant about my work."
        />
        <div className="resume-grid">
          <div className="resume-document">
            <p className="eyebrow">THE FULL BACKGROUND</p>
            <h3>
              My experience,
              <br />
              in one document.
            </h3>
            <p>
              Roles, projects, education, and the technical skills behind the
              work.
            </p>
            <a
              className="button button-primary"
              href={RESUME_PDF_DOWNLOAD}
              download="Kabeer_Thockchom_Resume.pdf"
            >
              Download resume
              <Download size={17} />
            </a>
            <details
              onToggle={(event) => setResumeOpen(event.currentTarget.open)}
              className="resume-preview"
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
            <p className="resume-note">
              The assistant uses the published portfolio. The PDF is available
              directly above.
            </p>
          </div>
          <ResumeChat />
        </div>
      </section>
      <section className="contact-section" id="contact">
        <div className="contact-copy">
          <p className="eyebrow">06 / LET’S CONNECT</p>
          <h2>
            Have a hard problem?
            <br />
            <em>Let’s talk.</em>
          </h2>
          <p>
            AI architecture, data systems, or an idea worth building. I’d like
            to hear what you’re working on.
          </p>
          <a className="contact-email" href={`mailto:${EMAIL}`}>
            {EMAIL}
            <ArrowUpRight size={17} />
          </a>
          <div className="contact-social">
            <a
              href="https://www.linkedin.com/in/kabeerthockchom"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
              <ArrowUpRight size={14} />
            </a>
            <a
              href="https://github.com/KabeerThockchom"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
              <ArrowUpRight size={14} />
            </a>
          </div>
        </div>
        <div className="contact-form-card">
          <h3>Start a conversation.</h3>
          <p>This opens your email app. You send the message there.</p>
          <ContactForm />
        </div>
      </section>
    </main>
  )
}
