'use client'

import { useState } from 'react'
import { motion } from 'motion/react'
import { SendIcon } from 'lucide-react'
import { EMAIL } from '@/app/data'

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validate()) {
      return
    }
    
    setStatus('loading')
    
    // This uses mailto to open the user's email client with the form data pre-filled
    // You can replace this with a backend API call if you have one
    try {
      const mailtoLink = `mailto:${EMAIL}?subject=${encodeURIComponent(
        `Portfolio Contact from ${formData.name}`
      )}&body=${encodeURIComponent(
        `Name: ${formData.name}\nEmail: ${formData.email}\n\n${formData.message}`
      )}`
      
      window.location.href = mailtoLink
      setStatus('success')
      
      // Reset form after successful submission
      setFormData({
        name: '',
        email: '',
        message: '',
      })
      
      // Reset status after 3 seconds
      setTimeout(() => {
        setStatus('idle')
      }, 3000)
    } catch (error) {
      setStatus('error')
      
      // Reset status after 3 seconds
      setTimeout(() => {
        setStatus('idle')
      }, 3000)
    }
  }

  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label htmlFor="name" className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`block w-full rounded-md border ${
              errors.name ? 'border-red-500' : 'border-zinc-300 dark:border-zinc-700'
            } bg-white px-3 py-1.5 text-sm shadow-sm focus:border-zinc-500 focus:outline-none focus:ring-zinc-500 dark:bg-zinc-900 dark:text-zinc-100`}
            placeholder="Your name"
          />
          {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
        </div>
        
        <div>
          <label htmlFor="email" className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`block w-full rounded-md border ${
              errors.email ? 'border-red-500' : 'border-zinc-300 dark:border-zinc-700'
            } bg-white px-3 py-1.5 text-sm shadow-sm focus:border-zinc-500 focus:outline-none focus:ring-zinc-500 dark:bg-zinc-900 dark:text-zinc-100`}
            placeholder="your.email@example.com"
          />
          {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
        </div>
        
        <div>
          <label htmlFor="message" className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            rows={3}
            value={formData.message}
            onChange={handleChange}
            className={`block w-full rounded-md border ${
              errors.message ? 'border-red-500' : 'border-zinc-300 dark:border-zinc-700'
            } bg-white px-3 py-1.5 text-sm shadow-sm focus:border-zinc-500 focus:outline-none focus:ring-zinc-500 dark:bg-zinc-900 dark:text-zinc-100`}
            placeholder="Your message here..."
          />
          {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message}</p>}
        </div>
        
        <div className="flex items-center justify-between">
          <button
            type="submit"
            disabled={status === 'loading'}
            className={`inline-flex items-center rounded-md border border-transparent ${
              status === 'loading'
                ? 'bg-zinc-300 dark:bg-zinc-700'
                : 'bg-zinc-900 hover:bg-zinc-700 dark:bg-zinc-100 dark:hover:bg-zinc-300'
            } px-3 py-1.5 text-sm font-medium ${
              status === 'loading'
                ? 'text-zinc-500 dark:text-zinc-400'
                : 'text-white dark:text-zinc-900'
            } shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`}
          >
            {status === 'loading' ? 'Sending...' : 'Send'}
            {status !== 'loading' && <SendIcon className="ml-1.5 h-3.5 w-3.5" />}
          </button>
          
          {status === 'success' && (
            <p className="text-xs text-green-500">Message sent!</p>
          )}
          
          {status === 'error' && (
            <p className="text-xs text-red-500">
              Error sending message. Please try again.
            </p>
          )}
        </div>
      </form>
    </motion.div>
  )
}
