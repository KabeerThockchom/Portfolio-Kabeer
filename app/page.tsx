'use client'
import { motion } from 'motion/react'
import { XIcon, BriefcaseIcon, CodeIcon, FileTextIcon, MailIcon, HeartIcon, DownloadIcon, MessageSquareIcon, UserIcon, FolderIcon } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { Spotlight } from '@/components/ui/spotlight'
import { Magnetic } from '@/components/ui/magnetic'
import {
  MorphingDialog,
  MorphingDialogTrigger,
  MorphingDialogContent,
  MorphingDialogClose,
  MorphingDialogContainer,
} from '@/components/ui/morphing-dialog'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { AnimatedBackground } from '@/components/ui/animated-background'
import { ContactForm } from '@/components/ui/contact-form'
import { TextEffect } from '@/components/ui/text-effect'
import {
  PROJECTS,
  WORK_EXPERIENCE,
  BLOG_POSTS,
  EMAIL,
  SOCIAL_LINKS,
  EDUCATION,
  SKILLS,
  CERTIFICATIONS,
  AWARDS,
} from './data'

type TabType = 'about' | 'projects' | 'experience' | 'blog' | 'resume' | 'contact'

const VARIANTS_CONTAINER = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
}

const VARIANTS_SECTION = {
  hidden: { opacity: 0, y: 20, filter: 'blur(8px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
}

const TRANSITION_SECTION = {
  duration: 0.3,
}

type ProjectVideoProps = {
  src: string
}

function ProjectVideo({ src }: ProjectVideoProps) {
  const getEmbedUrl = (url: string) => {
    if (url.includes('drive.google.com')) {
      const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || url.match(/id=([a-zA-Z0-9_-]+)/)
      if (match) {
        return `https://drive.google.com/file/d/${match[1]}/preview`
      }
    }
    if (url.includes('loom.com')) {
      const match = url.match(/loom\.com\/share\/([a-zA-Z0-9_-]+)/)
      if (match) {
        return `https://www.loom.com/embed/${match[1]}`
      }
    }
    return url
  }

  const isEmbeddable = src.includes('drive.google.com') || src.includes('loom.com')
  const embedUrl = getEmbedUrl(src)

  return (
    <MorphingDialog
      transition={{
        type: 'spring',
        bounce: 0,
        duration: 0.3,
      }}
    >
      <MorphingDialogTrigger>
        {isEmbeddable ? (
          <iframe
            src={embedUrl}
            className="aspect-video w-full cursor-zoom-in rounded-xl"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <video
            src={src}
            autoPlay
            loop
            muted
            className="aspect-video w-full cursor-zoom-in rounded-xl"
          />
        )}
      </MorphingDialogTrigger>
      <MorphingDialogContainer>
        <MorphingDialogContent className="relative aspect-video rounded-2xl bg-zinc-50 p-1 ring-1 ring-zinc-200/50 ring-inset dark:bg-zinc-950 dark:ring-zinc-800/50">
          {isEmbeddable ? (
            <iframe
              src={embedUrl}
              className="aspect-video h-[50vh] w-full rounded-xl md:h-[70vh]"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <video
              src={src}
              autoPlay
              loop
              muted
              className="aspect-video h-[50vh] w-full rounded-xl md:h-[70vh]"
            />
          )}
        </MorphingDialogContent>
        <MorphingDialogClose
          className="fixed top-6 right-6 h-fit w-fit rounded-full bg-white p-1"
          variants={{
            initial: { opacity: 0 },
            animate: {
              opacity: 1,
              transition: { delay: 0.3, duration: 0.1 },
            },
            exit: { opacity: 0, transition: { duration: 0 } },
          }}
        >
          <XIcon className="h-5 w-5 text-zinc-500" />
        </MorphingDialogClose>
      </MorphingDialogContainer>
    </MorphingDialog>
  )
}

function MagneticSocialLink({
  children,
  link,
}: {
  children: React.ReactNode
  link: string
}) {
  return (
    <Magnetic springOptions={{ bounce: 0 }} intensity={0.3}>
      <a
        href={link}
        className="group relative inline-flex shrink-0 items-center gap-[1px] rounded-full bg-zinc-100 px-2.5 py-1 text-sm text-black transition-colors duration-200 hover:bg-zinc-950 hover:text-zinc-50 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
      >
        {children}
        <svg
          width="15"
          height="15"
          viewBox="0 0 15 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-3 w-3"
        >
          <path
            d="M3.64645 11.3536C3.45118 11.1583 3.45118 10.8417 3.64645 10.6465L10.2929 4L6 4C5.72386 4 5.5 3.77614 5.5 3.5C5.5 3.22386 5.72386 3 6 3L11.5 3C11.6326 3 11.7598 3.05268 11.8536 3.14645C11.9473 3.24022 12 3.36739 12 3.5L12 9.00001C12 9.27615 11.7761 9.50001 11.5 9.50001C11.2239 9.50001 11 9.27615 11 9.00001V4.70711L4.35355 11.3536C4.15829 11.5488 3.84171 11.5488 3.64645 11.3536Z"
            fill="currentColor"
            fillRule="evenodd"
            clipRule="evenodd"
          ></path>
        </svg>
      </a>
    </Magnetic>
  )
}

type ChatMessage = {
  role: 'user' | 'assistant'
  content: string
}

type CarouselImage = {
  src: string
  caption: string
  alt: string
}

const LIFE_WORK_IMAGES: CarouselImage[] = [
  {
    src: '/life_work_pics/family.JPG',
    caption: 'Family moments that keep me grounded',
    alt: 'Family photo'
  },
  {
    src: '/life_work_pics/giving_back_uc_davis.jpg',
    caption: 'Giving back to the UC Davis community',
    alt: 'Giving back at UC Davis'
  },
  {
    src: '/life_work_pics/graduation.jpeg',
    caption: 'Graduation day - achieving academic milestones',
    alt: 'Graduation photo'
  },
  {
    src: '/life_work_pics/me_&_mr_theo.jpeg',
    caption: 'Me and my dog Theo - my loyal companion',
    alt: 'With my dog Theo'
  },
  {
    src: '/life_work_pics/quant_intern_at_EY.jpeg',
    caption: 'Quantitative Consulting Intern at Ernst & Young',
    alt: 'Quant intern at EY'
  },
  {
    src: '/life_work_pics/reliving_memories_at_real_madrid.JPG',
    caption: 'Traveling and creating memories at Real Madrid',
    alt: 'At Real Madrid stadium'
  }
]

function ImageCarousel({ onImageClick }: { onImageClick: (src: string) => void }) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === LIFE_WORK_IMAGES.length - 1 ? 0 : prevIndex + 1
    )
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? LIFE_WORK_IMAGES.length - 1 : prevIndex - 1
    )
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide()
    }, 4000) // Auto-advance every 4 seconds

    return () => clearInterval(timer)
  }, [currentIndex])

  return (
    <div className="relative w-full h-52 bg-zinc-50/40 rounded-lg overflow-hidden ring-1 ring-zinc-200/50 ring-inset dark:bg-zinc-950/40 dark:ring-zinc-800/50">
      {/* Image */}
      <div className="relative h-36 overflow-hidden bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center">
        <img
          src={LIFE_WORK_IMAGES[currentIndex].src}
          alt={LIFE_WORK_IMAGES[currentIndex].alt}
          className="max-w-full max-h-full object-contain transition-opacity duration-500 cursor-pointer hover:opacity-90"
          onClick={() => onImageClick(LIFE_WORK_IMAGES[currentIndex].src)}
        />
        
        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white rounded-full p-1.5 hover:bg-black/70 transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white rounded-full p-1.5 hover:bg-black/70 transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* Caption */}
      <div className="p-2">
        <p className="text-xs text-zinc-600 dark:text-zinc-400 text-center leading-tight">
          {LIFE_WORK_IMAGES[currentIndex].caption}
        </p>
      </div>

      {/* Dots Indicator */}
      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex space-x-1.5">
        {LIFE_WORK_IMAGES.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-1.5 h-1.5 rounded-full transition-colors ${
              index === currentIndex 
                ? 'bg-white shadow-sm' 
                : 'bg-white/50 hover:bg-white/75'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

export default function Personal() {
  const [activeTab, setActiveTab] = useState<TabType>('about')
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: "👋 Hi! I'm an AI assistant that knows all about Kabeer's background, experience, and skills. Ask me anything about his resume!"
    }
  ])
  const [chatInput, setChatInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showTooltip, setShowTooltip] = useState<string | null>(null)
  const [expandedJobs, setExpandedJobs] = useState<Set<string>>(new Set())
  const [expandedSkills, setExpandedSkills] = useState<Set<string>>(new Set())
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const sendMessage = async (message: string) => {
    if (!message.trim() || isLoading) return

    const userMessage: ChatMessage = { role: 'user', content: message }
    setChatMessages(prev => [...prev, userMessage])
    setChatInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      const data = await response.json()
      const assistantMessage: ChatMessage = { role: 'assistant', content: data.response }
      setChatMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage: ChatMessage = { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again.' 
      }
      setChatMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSuggestedQuestion = (question: string) => {
    sendMessage(question)
  }

  const handleTabClick = (tab: TabType) => {
    setActiveTab(tab)
    // Show tooltip on mobile (screen < 640px) when tab is clicked
    if (window.innerWidth < 640) {
      setShowTooltip(tab)
      // Auto-hide tooltip after 2 seconds
      setTimeout(() => {
        setShowTooltip(null)
      }, 2000)
    }
  }

  const toggleJobExpansion = (jobId: string) => {
    const newExpanded = new Set(expandedJobs)
    if (newExpanded.has(jobId)) {
      newExpanded.delete(jobId)
    } else {
      newExpanded.add(jobId)
    }
    setExpandedJobs(newExpanded)
  }

  const toggleSkillExpansion = (index: number) => {
    const newExpanded = new Set(expandedSkills)
    const key = index.toString()
    if (newExpanded.has(key)) {
      newExpanded.delete(key)
    } else {
      newExpanded.add(key)
    }
    setExpandedSkills(newExpanded)
  }

  return (
    <motion.div
      className="flex h-full flex-col"
      variants={VARIANTS_CONTAINER}
      initial="hidden"
      animate="visible"
    >
      {/* Tabs Navigation */}
      <motion.div
        className="mb-3 flex justify-center"
        variants={VARIANTS_SECTION}
        transition={TRANSITION_SECTION}
      >
        <div className="grid grid-cols-3 gap-2 rounded-lg bg-zinc-100 p-2 dark:bg-zinc-800/70 sm:flex sm:gap-1 sm:p-1">
          <button
            className={`group relative flex items-center justify-center rounded-md px-3 py-3 text-xs sm:px-3 sm:py-1.5 sm:text-sm font-medium transition-all ${activeTab === 'about' ? 'bg-white text-zinc-900 shadow dark:bg-zinc-700 dark:text-zinc-100' : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300'}`}
            onClick={() => handleTabClick('about')}
            title="About"
          >
            <CodeIcon className="h-5 w-5 sm:mr-1.5 sm:h-3.5 sm:w-3.5" />
            <span className="hidden sm:inline">About</span>
            <div className={`absolute -top-8 left-1/2 transform -translate-x-1/2 bg-zinc-800 text-white px-2 py-1 rounded text-xs transition-all duration-300 pointer-events-none sm:hidden ${showTooltip === 'about' ? 'opacity-100 scale-100' : 'opacity-0 scale-95'} sm:opacity-0 sm:group-hover:opacity-100`}>
              About
            </div>
          </button>
          <button
            className={`group relative flex items-center justify-center rounded-md px-3 py-3 text-xs sm:px-3 sm:py-1.5 sm:text-sm font-medium transition-all ${activeTab === 'projects' ? 'bg-white text-zinc-900 shadow dark:bg-zinc-700 dark:text-zinc-100' : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300'}`}
            onClick={() => handleTabClick('projects')}
            title="Projects"
          >
            <FolderIcon className="h-5 w-5 sm:mr-1.5 sm:h-3.5 sm:w-3.5" />
            <span className="hidden sm:inline">Projects</span>
            <div className={`absolute -top-8 left-1/2 transform -translate-x-1/2 bg-zinc-800 text-white px-2 py-1 rounded text-xs transition-all duration-300 pointer-events-none sm:hidden ${showTooltip === 'projects' ? 'opacity-100 scale-100' : 'opacity-0 scale-95'} sm:opacity-0 sm:group-hover:opacity-100`}>
              Projects
            </div>
          </button>
          <button
            className={`group relative flex items-center justify-center rounded-md px-3 py-3 text-xs sm:px-3 sm:py-1.5 sm:text-sm font-medium transition-all ${activeTab === 'experience' ? 'bg-white text-zinc-900 shadow dark:bg-zinc-700 dark:text-zinc-100' : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300'}`}
            onClick={() => handleTabClick('experience')}
            title="Experience"
          >
            <BriefcaseIcon className="h-5 w-5 sm:mr-1.5 sm:h-3.5 sm:w-3.5" />
            <span className="hidden sm:inline">Experience</span>
            <div className={`absolute -top-8 left-1/2 transform -translate-x-1/2 bg-zinc-800 text-white px-2 py-1 rounded text-xs transition-all duration-300 pointer-events-none sm:hidden ${showTooltip === 'experience' ? 'opacity-100 scale-100' : 'opacity-0 scale-95'} sm:opacity-0 sm:group-hover:opacity-100`}>
              Experience
            </div>
          </button>
          <button
            className={`group relative flex items-center justify-center rounded-md px-3 py-3 text-xs sm:px-3 sm:py-1.5 sm:text-sm font-medium transition-all ${activeTab === 'blog' ? 'bg-white text-zinc-900 shadow dark:bg-zinc-700 dark:text-zinc-100' : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300'}`}
            onClick={() => handleTabClick('blog')}
            title="Blog"
          >
            <FileTextIcon className="h-5 w-5 sm:mr-1.5 sm:h-3.5 sm:w-3.5" />
            <span className="hidden sm:inline">Blog</span>
            <div className={`absolute -top-8 left-1/2 transform -translate-x-1/2 bg-zinc-800 text-white px-2 py-1 rounded text-xs transition-all duration-300 pointer-events-none sm:hidden ${showTooltip === 'blog' ? 'opacity-100 scale-100' : 'opacity-0 scale-95'} sm:opacity-0 sm:group-hover:opacity-100`}>
              Blog
            </div>
          </button>
          <button
            className={`group relative flex items-center justify-center rounded-md px-3 py-3 text-xs sm:px-3 sm:py-1.5 sm:text-sm font-medium transition-all ${activeTab === 'resume' ? 'bg-white text-zinc-900 shadow dark:bg-zinc-700 dark:text-zinc-100' : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300'}`}
            onClick={() => handleTabClick('resume')}
            title="Resume"
          >
            <UserIcon className="h-5 w-5 sm:mr-1.5 sm:h-3.5 sm:w-3.5" />
            <span className="hidden sm:inline">Resume</span>
            <div className={`absolute -top-8 left-1/2 transform -translate-x-1/2 bg-zinc-800 text-white px-2 py-1 rounded text-xs transition-all duration-300 pointer-events-none sm:hidden ${showTooltip === 'resume' ? 'opacity-100 scale-100' : 'opacity-0 scale-95'} sm:opacity-0 sm:group-hover:opacity-100`}>
              Resume
            </div>
          </button>
          <button
            className={`group relative flex items-center justify-center rounded-md px-3 py-3 text-xs sm:px-3 sm:py-1.5 sm:text-sm font-medium transition-all ${activeTab === 'contact' ? 'bg-white text-zinc-900 shadow dark:bg-zinc-700 dark:text-zinc-100' : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300'}`}
            onClick={() => handleTabClick('contact')}
            title="Contact"
          >
            <MailIcon className="h-5 w-5 sm:mr-1.5 sm:h-3.5 sm:w-3.5" />
            <span className="hidden sm:inline">Contact</span>
            <div className={`absolute -top-8 left-1/2 transform -translate-x-1/2 bg-zinc-800 text-white px-2 py-1 rounded text-xs transition-all duration-300 pointer-events-none sm:hidden ${showTooltip === 'contact' ? 'opacity-100 scale-100' : 'opacity-0 scale-95'} sm:opacity-0 sm:group-hover:opacity-100`}>
              Contact
            </div>
          </button>
        </div>
      </motion.div>

      {/* Tab Content */}
      <motion.div
        className="flex-1 overflow-hidden rounded-lg bg-zinc-50/40 p-2 ring-1 ring-zinc-200/50 ring-inset dark:bg-zinc-950/40 dark:ring-zinc-800/50"
        variants={VARIANTS_SECTION}
        transition={TRANSITION_SECTION}
        style={{ height: 'calc(100vh - 140px)' }}
      >
        {/* About Tab */}
        {activeTab === 'about' && (
          <div className="h-full overflow-auto pb-1 pt-1 pr-1">
            <div>
              <div className="w-full">
                <h3 className="mb-2 text-base font-medium">About Me</h3>
                
                <motion.p 
                  className="mb-3 border-l-2 border-zinc-300 pl-3 text-sm italic text-zinc-600 dark:border-zinc-700 dark:text-zinc-400"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  My mission is to bridge the gap between cutting-edge AI technology and practical business solutions, creating products that not only showcase technical excellence but genuinely solve real-world problems.
                </motion.p>
                
                <p className="mb-3 text-sm text-zinc-600 dark:text-zinc-400">
                  Driving AI innovation from concept to completion. Translating customer insights into impactful products across startup and enterprise environments.
                </p>
                
                <div className="mt-4">
                  <h4 className="mb-2 flex items-center text-sm font-medium">
                    <HeartIcon className="mr-2 h-4 w-4 text-rose-500" /> 
                    Passions & Interests
                  </h4>
                  
                  <div className="space-y-2">
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      Fascinated by the intersection of AI, business, and human-centered design.
                    </p>
                    
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      Outside of work, I'm a dog lover, tea enthusiast, and avid hiker.
                    </p>
                    
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      I believe in building technology that enhances human capabilities rather than replacing them.
                    </p>
                  </div>
                  
                  <div className="mt-3 flex flex-wrap gap-2">
                    {['GenAI Explainability', 'LLM Evals', 'RAG Systems', 'AI Alignment', 'Prompt Engineering', 'Hiking', 'Community Service', 'Music Production', 'Human & Animal Rights'].map((tag) => (
                      <span 
                        key={tag} 
                        className="rounded-full bg-zinc-100 px-3 py-1 text-sm text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Projects Tab */}
        {activeTab === 'projects' && (
          <div className="h-full overflow-auto pb-1 pt-1 pr-1">
            <h3 className="mb-3 text-lg font-medium">Selected Projects</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {PROJECTS.map((project) => (
                <div key={project.name} className="space-y-1">
                  <div className="relative rounded-lg bg-zinc-50/40 p-1 ring-1 ring-zinc-200/50 ring-inset dark:bg-zinc-950/40 dark:ring-zinc-800/50">
                    <ProjectVideo src={project.video} />
                  </div>
                  <div className="px-1">
                    <a
                      className="font-base group relative inline-block text-sm font-[450] text-zinc-900 dark:text-zinc-50"
                      href={project.link}
                      target="_blank"
                    >
                      {project.name}
                      <span className="absolute bottom-0.5 left-0 block h-[1px] w-full max-w-0 bg-zinc-900 transition-all duration-200 group-hover:max-w-full"></span>
                    </a>
                    <MorphingDialog
                      transition={{
                        type: 'spring',
                        bounce: 0,
                        duration: 0.3,
                      }}
                    >
                      <MorphingDialogTrigger>
                        <p className="cursor-pointer text-sm text-zinc-600 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors">
                          {project.description.length > 150 
                            ? `${project.description.substring(0, 150)}...` 
                            : project.description}
                        </p>
                      </MorphingDialogTrigger>
                      <MorphingDialogContainer>
                        <MorphingDialogContent className="relative max-w-2xl rounded-2xl bg-white p-6 ring-1 ring-zinc-200/50 ring-inset dark:bg-zinc-950 dark:ring-zinc-800/50">
                          <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                              {project.name}
                            </h3>
                            <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                              {project.description}
                            </p>
                            <a
                              href={project.link}
                              target="_blank"
                              className="inline-flex items-center gap-2 rounded-lg bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700 transition-colors"
                            >
                              View Project
                              <svg
                                width="15"
                                height="15"
                                viewBox="0 0 15 15"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-3 w-3"
                              >
                                <path
                                  d="M3.64645 11.3536C3.45118 11.1583 3.45118 10.8417 3.64645 10.6465L10.2929 4L6 4C5.72386 4 5.5 3.77614 5.5 3.5C5.5 3.22386 5.72386 3 6 3L11.5 3C11.6326 3 11.7598 3.05268 11.8536 3.14645C11.9473 3.24022 12 3.36739 12 3.5L12 9.00001C12 9.27615 11.7761 9.50001 11.5 9.50001C11.2239 9.50001 11 9.27615 11 9.00001V4.70711L4.35355 11.3536C4.15829 11.5488 3.84171 11.5488 3.64645 11.3536Z"
                                  fill="currentColor"
                                  fillRule="evenodd"
                                  clipRule="evenodd"
                                ></path>
                              </svg>
                            </a>
                          </div>
                        </MorphingDialogContent>
                        <MorphingDialogClose
                          className="fixed top-6 right-6 h-fit w-fit rounded-full bg-white p-2 shadow-lg ring-1 ring-zinc-200 dark:bg-zinc-900 dark:ring-zinc-800"
                          variants={{
                            initial: { opacity: 0 },
                            animate: {
                              opacity: 1,
                              transition: { delay: 0.3, duration: 0.1 },
                            },
                            exit: { opacity: 0, transition: { duration: 0 } },
                          }}
                        >
                          <XIcon className="h-5 w-5 text-zinc-500" />
                        </MorphingDialogClose>
                      </MorphingDialogContainer>
                    </MorphingDialog>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Experience Tab */}
        {activeTab === 'experience' && (
          <div className="h-full overflow-auto pb-1 pt-1 pr-1">
            {/* Image Carousel */}
            <div className="mb-6">
              <h3 className="mb-3 text-lg font-semibold">Life & Work Journey</h3>
              <ImageCarousel onImageClick={setSelectedImage} />
            </div>

            {/* Experience Layout - Mobile: Stack, Desktop: Side by side */}
            <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
              {/* Work Experience Timeline - Main Content */}
              <div className="xl:col-span-3">
                <h3 className="mb-4 text-lg font-semibold">Career Timeline</h3>
                
                {/* Timeline Container */}
                <div className="relative">
                  {/* Timeline Line */}
                  <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-zinc-400 to-zinc-600 hidden sm:block"></div>
                  
                  {/* Timeline Items */}
                  <div className="space-y-6">
                    {WORK_EXPERIENCE.map((job, index) => (
                      <motion.div
                        key={job.id}
                        className="relative"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      >
                        {/* Timeline Dot */}
                        <div className="absolute left-4 w-4 h-4 bg-white border-4 border-blue-500 rounded-full hidden sm:block shadow-lg z-10"></div>
                        
                        {/* Experience Card */}
                        <div className="sm:ml-12 bg-white dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800 p-5 shadow-sm hover:shadow-md transition-shadow">
                          {/* Header */}
                          <div className="mb-3">
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                              <div>
                                <h4 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                                  {job.title}
                                </h4>
                                <a 
                                  href={job.link}
                                  target="_blank"
                                  className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium hover:underline"
                                >
                                  {job.company}
                                </a>
                              </div>
                              <div className="text-right">
                                <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                                  {job.start} - {job.end}
                                </div>
                                <div className="text-sm text-zinc-500 dark:text-zinc-400">
                                  {job.location}
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Accomplishments */}
                          <div className="space-y-2">
                            {(expandedJobs.has(job.id) ? job.accomplishments : job.accomplishments.slice(0, 3)).map((accomplishment, index) => (
                              <div key={index} className="flex items-start">
                                <div className="w-2 h-2 bg-zinc-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                                  {accomplishment}
                                </p>
                              </div>
                            ))}
                            
                            {job.accomplishments.length > 3 && (
                              <button
                                onClick={() => toggleJobExpansion(job.id)}
                                className="mt-2 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium hover:underline"
                              >
                                {expandedJobs.has(job.id) 
                                  ? 'Show less' 
                                  : `View ${job.accomplishments.length - 3} more accomplishments`
                                }
                              </button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Sidebar - Education, Skills, etc. */}
              <div className="xl:col-span-2 space-y-6">
                {/* Education Section */}
                <div>
                  <h3 className="mb-3 text-lg font-semibold">Education</h3>
                  <div className="space-y-3">
                    {EDUCATION.map((edu) => (
                      <motion.div
                        key={edu.id}
                        className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950 shadow-sm"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="mb-2">
                          <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{edu.school}</h4>
                          <div className="text-sm text-zinc-500 dark:text-zinc-400">{edu.start} - {edu.end}</div>
                        </div>
                        <div className="text-sm font-medium text-zinc-800 dark:text-zinc-200 mb-1">{edu.degree}</div>
                        <div className="text-sm text-zinc-600 dark:text-zinc-400">{edu.location}</div>
                        
                        {edu.focus && (
                          <div className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                            <span className="font-medium">Focus:</span> {edu.focus}
                          </div>
                        )}
                        
                        {edu.gpa && (
                          <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                            <span className="font-medium">GPA:</span> {edu.gpa}
                          </div>
                        )}
                        
                        {edu.minors && edu.minors.length > 0 && (
                          <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                            <span className="font-medium">Minors:</span> {edu.minors.join(', ')}
                          </div>
                        )}
                        
                        {edu.honors && edu.honors.length > 0 && (
                          <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                            <span className="font-medium">Honors:</span> {edu.honors.join(', ')}
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
                
                {/* Skills Section */}
                <div>
                  <h3 className="mb-3 text-lg font-semibold">Key Skills</h3>
                  <div className="space-y-3">
                    {SKILLS.slice(0, 6).map((skillCategory, index) => (
                      <motion.div
                        key={index}
                        className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950 shadow-sm"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                      >
                        <h4 className="mb-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                          {skillCategory.category}
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {(expandedSkills.has(index.toString()) ? skillCategory.items : skillCategory.items.slice(0, 4)).map((skill, skillIndex) => (
                            <span 
                              key={skillIndex}
                              className="whitespace-nowrap rounded-full bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1 text-xs font-medium text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700"
                            >
                              {skill}
                            </span>
                          ))}
                          {skillCategory.items.length > 4 && (
                            <button
                              onClick={() => toggleSkillExpansion(index)}
                              className="whitespace-nowrap rounded-full bg-blue-50 dark:bg-blue-900/50 px-2.5 py-1 text-xs font-medium text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/70 transition-colors"
                            >
                              {expandedSkills.has(index.toString()) 
                                ? 'Show less' 
                                : `+${skillCategory.items.length - 4} more`
                              }
                            </button>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
                
                {/* Certifications Section */}
                <div>
                  <h3 className="mb-3 text-lg font-semibold">Certifications</h3>
                  <div className="space-y-3">
                    {CERTIFICATIONS.map((cert) => (
                      <motion.div
                        key={cert.id}
                        className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950 shadow-sm"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-1">{cert.name}</h4>
                        <div className="text-sm text-zinc-600 dark:text-zinc-400">{cert.issuer}</div>
                        <div className="text-sm text-zinc-500 dark:text-zinc-500">{cert.year}</div>
                      </motion.div>
                    ))}
                  </div>
                </div>
                
                {/* Awards Section */}
                <div>
                  <h3 className="mb-3 text-lg font-semibold">Honors & Awards</h3>
                  <div className="space-y-3">
                    {AWARDS.map((award) => (
                      <motion.div
                        key={award.id}
                        className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950 shadow-sm"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-1">{award.name}</h4>
                        <div className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">{award.issuer}</div>
                        <div className="text-sm text-zinc-500 dark:text-zinc-500 mb-2">{award.date}</div>
                        {award.description && (
                          <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                            {award.description}
                          </p>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Blog Tab */}
        {activeTab === 'blog' && (
          <div className="h-full overflow-auto pb-1 pt-1 pr-1">
            <h3 className="mb-3 text-lg font-medium">Blog</h3>
            <div className="flex flex-col space-y-0">
              <AnimatedBackground
                enableHover
                className="h-full w-full rounded-lg bg-zinc-100 dark:bg-zinc-900/80"
                transition={{
                  type: 'spring',
                  bounce: 0,
                  duration: 0.2,
                }}
              >
                {BLOG_POSTS.map((post) => (
                  <Link
                    key={post.uid}
                    className="-mx-3 rounded-xl px-3 py-2"
                    href={post.link}
                    data-id={post.uid}
                  >
                    <div className="flex flex-col space-y-1">
                      <h4 className="text-sm font-normal dark:text-zinc-100">
                        {post.title}
                      </h4>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        {post.description}
                      </p>
                    </div>
                  </Link>
                ))}
              </AnimatedBackground>
            </div>
          </div>
        )}

        {/* Resume Tab */}
        {activeTab === 'resume' && (
          <div className="h-full overflow-auto pb-1 pt-1 pr-1">
            <h3 className="mb-2 text-base font-medium">Resume</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">
              {/* Chatbot Section - First on mobile, first on desktop */}
              <div className="space-y-3 order-1">
                <div className="flex items-center gap-2">
                  <MessageSquareIcon className="h-4 w-4" />
                  <h4 className="text-sm font-medium">Chat with my Resume</h4>
                </div>
                <div className="h-full min-h-[350px] rounded-lg bg-zinc-50/40 p-3 ring-1 ring-zinc-200/50 ring-inset dark:bg-zinc-950/40 dark:ring-zinc-800/50">
                  <div className="flex h-full flex-col">
                    {/* Chat Messages */}
                    <div className="flex-1 space-y-2 overflow-auto max-h-64">
                      {chatMessages.map((message, index) => (
                        <div
                          key={index}
                          className={`rounded-lg p-2 ${
                            message.role === 'assistant'
                              ? 'bg-zinc-100 dark:bg-zinc-800'
                              : 'bg-blue-100 ml-6 dark:bg-blue-900/50'
                          }`}
                        >
                          {message.role === 'assistant' ? (
                            <div className="text-xs text-zinc-600 dark:text-zinc-400 prose prose-sm max-w-none prose-headings:text-zinc-800 dark:prose-headings:text-zinc-200 prose-p:text-zinc-600 dark:prose-p:text-zinc-400 prose-strong:text-zinc-800 dark:prose-strong:text-zinc-200 prose-ul:text-zinc-600 dark:prose-ul:text-zinc-400 prose-li:text-zinc-600 dark:prose-li:text-zinc-400">
                              <ReactMarkdown>{message.content}</ReactMarkdown>
                            </div>
                          ) : (
                            <p className="text-xs text-zinc-600 dark:text-zinc-400 whitespace-pre-wrap">
                              {message.content}
                            </p>
                          )}
                        </div>
                      ))}
                      {isLoading && (
                        <div className="rounded-lg bg-zinc-100 p-3 dark:bg-zinc-800">
                          <div className="flex items-center space-x-2">
                            <div className="flex space-x-1">
                              <div className="h-2 w-2 bg-zinc-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                              <div className="h-2 w-2 bg-zinc-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                              <div className="h-2 w-2 bg-zinc-500 rounded-full animate-bounce"></div>
                            </div>
                            <p className="text-xs text-zinc-600 dark:text-zinc-400">
                              Thinking...
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Chat Input */}
                    <div className="mt-3 space-y-2">
                      <form
                        onSubmit={(e) => {
                          e.preventDefault()
                          sendMessage(chatInput)
                        }}
                        className="flex gap-2"
                      >
                        <input
                          type="text"
                          value={chatInput}
                          onChange={(e) => setChatInput(e.target.value)}
                          placeholder="Ask about Kabeer's experience, skills..."
                          className="flex-1 rounded-lg border border-zinc-200 bg-white px-2 py-1.5 text-xs placeholder-zinc-500 focus:border-zinc-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder-zinc-400 dark:focus:border-zinc-500"
                          disabled={isLoading}
                        />
                        <button 
                          type="submit"
                          disabled={isLoading || !chatInput.trim()}
                          className="rounded-lg bg-zinc-900 px-3 py-1.5 text-xs text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isLoading ? 'Sending...' : 'Send'}
                        </button>
                      </form>
                      <div className="flex flex-wrap gap-1">
                        <button 
                          onClick={() => handleSuggestedQuestion("What's his experience at EY?")}
                          disabled={isLoading}
                          className="rounded-full bg-zinc-100 px-2 py-1 text-xs text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700 transition-colors disabled:opacity-50"
                        >
                          Experience at EY?
                        </button>
                        <button 
                          onClick={() => handleSuggestedQuestion("Tell me about his AI projects")}
                          disabled={isLoading}
                          className="rounded-full bg-zinc-100 px-2 py-1 text-xs text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700 transition-colors disabled:opacity-50"
                        >
                          AI projects?
                        </button>
                        <button 
                          onClick={() => handleSuggestedQuestion("What are his technical skills?")}
                          disabled={isLoading}
                          className="rounded-full bg-zinc-100 px-2 py-1 text-xs text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700 transition-colors disabled:opacity-50"
                        >
                          Technical skills?
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* PDF Viewer Section - Second on mobile, second on desktop */}
              <div className="space-y-3 order-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">PDF Viewer</h4>
                  <a
                    href="https://drive.google.com/uc?export=download&id=1gEhKBfnrB6aSulOJC2eM6R2u6wx8cZWb"
                    download="Kabeer_Thockchom_Resume.pdf"
                    className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-2 py-1.5 text-xs text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 transition-colors"
                  >
                    <DownloadIcon className="h-3 w-3" />
                    Download PDF
                  </a>
                </div>
                <div className="aspect-[3/4] w-full rounded-lg bg-zinc-50/40 ring-1 ring-zinc-200/50 ring-inset dark:bg-zinc-950/40 dark:ring-zinc-800/50">
                  <iframe
                    src="https://drive.google.com/file/d/1gEhKBfnrB6aSulOJC2eM6R2u6wx8cZWb/preview"
                    className="h-full w-full rounded-lg"
                    allow="autoplay"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Contact Tab */}
        {activeTab === 'contact' && (
          <div className="h-full overflow-auto pb-1 pt-1 pr-1">
            <h3 className="mb-3 text-lg font-medium">Contact Me</h3>
            <ContactForm />
          </div>
        )}
      </motion.div>

      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative w-full h-full flex items-center justify-center">
            <img
              src={selectedImage}
              alt="Enlarged view"
              className="max-w-none max-h-full w-auto object-contain"
              onClick={(e) => e.stopPropagation()}
              style={{ maxWidth: '90vw', maxHeight: '90vh' }}
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-6 right-6 bg-white/20 backdrop-blur-sm text-white rounded-full p-3 hover:bg-white/30 transition-colors z-10"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      )}
    </motion.div>
  )
}
