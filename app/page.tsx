'use client'
import { motion } from 'motion/react'
import { XIcon, BriefcaseIcon, CodeIcon, FileTextIcon, MailIcon, HeartIcon, DownloadIcon, MessageSquareIcon, UserIcon, FolderIcon } from 'lucide-react'
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

export default function Personal() {
  const [activeTab, setActiveTab] = useState<TabType>('about')

  return (
    <motion.div
      className="flex h-full flex-col"
      variants={VARIANTS_CONTAINER}
      initial="hidden"
      animate="visible"
    >
      {/* Tabs Navigation */}
      <motion.div
        className="mb-3 flex justify-center overflow-x-auto"
        variants={VARIANTS_SECTION}
        transition={TRANSITION_SECTION}
      >
        <div className="flex rounded-lg bg-zinc-100 p-1 dark:bg-zinc-800/70 min-w-max">
          <button
            className={`flex items-center rounded-md px-2.5 py-1.5 text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${activeTab === 'about' ? 'bg-white text-zinc-900 shadow dark:bg-zinc-700 dark:text-zinc-100' : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300'}`}
            onClick={() => setActiveTab('about')}
          >
            <CodeIcon className="mr-1 sm:mr-1.5 h-3 w-3 sm:h-3.5 sm:w-3.5" /> <span className="hidden xs:inline">About</span><span className="xs:hidden">About</span>
          </button>
          <button
            className={`flex items-center rounded-md px-2.5 py-1.5 text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${activeTab === 'projects' ? 'bg-white text-zinc-900 shadow dark:bg-zinc-700 dark:text-zinc-100' : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300'}`}
            onClick={() => setActiveTab('projects')}
          >
            <CodeIcon className="mr-1 sm:mr-1.5 h-3 w-3 sm:h-3.5 sm:w-3.5" /> Projects
          </button>
          <button
            className={`flex items-center rounded-md px-2.5 py-1.5 text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${activeTab === 'experience' ? 'bg-white text-zinc-900 shadow dark:bg-zinc-700 dark:text-zinc-100' : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300'}`}
            onClick={() => setActiveTab('experience')}
          >
            <BriefcaseIcon className="mr-1 sm:mr-1.5 h-3 w-3 sm:h-3.5 sm:w-3.5" /> Experience
          </button>
          <button
            className={`flex items-center rounded-md px-2.5 py-1.5 text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${activeTab === 'blog' ? 'bg-white text-zinc-900 shadow dark:bg-zinc-700 dark:text-zinc-100' : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300'}`}
            onClick={() => setActiveTab('blog')}
          >
            <FileTextIcon className="mr-1 sm:mr-1.5 h-3 w-3 sm:h-3.5 sm:w-3.5" /> Blog
          </button>
          <button
            className={`flex items-center rounded-md px-2.5 py-1.5 text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${activeTab === 'resume' ? 'bg-white text-zinc-900 shadow dark:bg-zinc-700 dark:text-zinc-100' : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300'}`}
            onClick={() => setActiveTab('resume')}
          >
            <UserIcon className="mr-1 sm:mr-1.5 h-3 w-3 sm:h-3.5 sm:w-3.5" /> Resume
          </button>
          <button
            className={`flex items-center rounded-md px-2.5 py-1.5 text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${activeTab === 'contact' ? 'bg-white text-zinc-900 shadow dark:bg-zinc-700 dark:text-zinc-100' : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300'}`}
            onClick={() => setActiveTab('contact')}
          >
            <MailIcon className="mr-1 sm:mr-1.5 h-3 w-3 sm:h-3.5 sm:w-3.5" /> Contact
          </button>
        </div>
      </motion.div>

      {/* Tab Content */}
      <motion.div
        className="flex-1 overflow-hidden rounded-lg bg-zinc-50/40 p-2 sm:p-3 ring-1 ring-zinc-200/50 ring-inset dark:bg-zinc-950/40 dark:ring-zinc-800/50"
        variants={VARIANTS_SECTION}
        transition={TRANSITION_SECTION}
        style={{ height: 'calc(100vh - 160px)' }}
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
                    {['AI/ML', 'Economics', 'Product Dev / Mgmt', 'Dogs', 'Tea', 'Hiking', 'Movies'].map((tag) => (
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
            <div className="grid grid-cols-1 gap-3 xl:grid-cols-3">
              {/* Work Experience Section */}
              <div className="xl:col-span-2">
                <h3 className="mb-2 text-base font-medium">Work Experience</h3>
                <div className="space-y-3">
                  {WORK_EXPERIENCE.map((job) => (
                    <motion.div
                      key={job.id}
                      className="relative overflow-hidden rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="mb-1 flex flex-col justify-between space-y-1 sm:flex-row sm:items-center sm:space-y-0">
                        <div>
                          <h4 className="font-medium text-zinc-900 dark:text-zinc-100">
                            {job.title}
                          </h4>
                          <div className="flex flex-col sm:flex-row sm:items-center">
                            <a 
                              href={job.link}
                              target="_blank"
                              className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
                            >
                              {job.company}
                            </a>
                            <span className="hidden text-zinc-400 sm:mx-2 sm:inline">&middot;</span>
                            <span className="text-sm text-zinc-500 dark:text-zinc-500">{job.location}</span>
                          </div>
                        </div>
                        <div className="text-sm font-light text-zinc-500 dark:text-zinc-400">
                          {job.start} - {job.end}
                        </div>
                      </div>
                      
                      <ul className="mt-1 space-y-0.5 text-xs">
                        {job.accomplishments.map((accomplishment, index) => (
                          <li key={index} className="flex items-start">
                            <span className="mr-2 mt-1 text-xs text-zinc-400">•</span>
                            <span className="text-zinc-700 dark:text-zinc-300">{accomplishment}</span>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  ))}
                </div>
              </div>
              
              {/* Education and Skills Column */}
              <div className="space-y-3">
                {/* Education Section */}
                <div>
                  <h3 className="mb-2 text-base font-medium">Education</h3>
                  <div className="space-y-3">
                    {EDUCATION.map((edu) => (
                      <motion.div
                        key={edu.id}
                        className="rounded-lg border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-950"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="mb-1 flex justify-between">
                          <h4 className="font-medium text-zinc-900 dark:text-zinc-100">{edu.school}</h4>
                          <div className="text-xs text-zinc-500">{edu.start} - {edu.end}</div>
                        </div>
                        <div className="text-sm text-zinc-700 dark:text-zinc-300">{edu.degree}</div>
                        <div className="text-xs text-zinc-500">{edu.location}</div>
                        
                        {edu.focus && (
                          <div className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
                            <span className="font-medium">Focus:</span> {edu.focus}
                          </div>
                        )}
                        
                        {edu.gpa && (
                          <div className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
                            <span className="font-medium">GPA:</span> {edu.gpa}
                          </div>
                        )}
                        
                        {edu.minors && edu.minors.length > 0 && (
                          <div className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
                            <span className="font-medium">Minors:</span> {edu.minors.join(', ')}
                          </div>
                        )}
                        
                        {edu.honors && edu.honors.length > 0 && (
                          <div className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
                            <span className="font-medium">Honors:</span> {edu.honors.join(', ')}
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
                
                {/* Skills Section */}
                <div>
                  <h3 className="mb-2 text-base font-medium">Skills</h3>
                  <div className="space-y-3">
                    {SKILLS.map((skillCategory, index) => (
                      <motion.div
                        key={index}
                        className="rounded-lg border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-950"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                      >
                        <h4 className="mb-1 text-sm font-medium text-zinc-900 dark:text-zinc-100">
                          {skillCategory.category}
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {skillCategory.items.map((skill, skillIndex) => (
                            <span 
                              key={skillIndex}
                              className="whitespace-nowrap rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
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
            <h3 className="mb-3 text-lg font-medium">Resume</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">
              {/* PDF Viewer Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-medium">PDF Viewer</h4>
                  <a
                    href="https://drive.google.com/uc?export=download&id=1gEhKBfnrB6aSulOJC2eM6R2u6wx8cZWb"
                    download="Kabeer_Thockchom_Resume.pdf"
                    className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-3 py-1.5 text-sm text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 transition-colors"
                  >
                    <DownloadIcon className="h-4 w-4" />
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

              {/* Chatbot Section */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <MessageSquareIcon className="h-5 w-5" />
                  <h4 className="text-base font-medium">Chat with my Resume</h4>
                </div>
                <div className="h-full min-h-[400px] rounded-lg bg-zinc-50/40 p-4 ring-1 ring-zinc-200/50 ring-inset dark:bg-zinc-950/40 dark:ring-zinc-800/50">
                  <div className="flex h-full flex-col">
                    {/* Chat Messages */}
                    <div className="flex-1 space-y-3 overflow-auto">
                      <div className="rounded-lg bg-zinc-100 p-3 dark:bg-zinc-800">
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                          👋 Hi! I'm an AI assistant that knows all about Kabeer's background, experience, and skills. Ask me anything about his resume!
                        </p>
                      </div>
                    </div>
                    
                    {/* Chat Input */}
                    <div className="mt-4 space-y-2">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Ask about Kabeer's experience, skills, projects..."
                          className="flex-1 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm placeholder-zinc-500 focus:border-zinc-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder-zinc-400 dark:focus:border-zinc-500"
                        />
                        <button className="rounded-lg bg-zinc-900 px-4 py-2 text-sm text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 transition-colors">
                          Send
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button className="rounded-full bg-zinc-100 px-3 py-1 text-xs text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700 transition-colors">
                          What's his experience at EY?
                        </button>
                        <button className="rounded-full bg-zinc-100 px-3 py-1 text-xs text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700 transition-colors">
                          Tell me about his AI projects
                        </button>
                        <button className="rounded-full bg-zinc-100 px-3 py-1 text-xs text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700 transition-colors">
                          What are his technical skills?
                        </button>
                      </div>
                    </div>
                  </div>
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
    </motion.div>
  )
}
