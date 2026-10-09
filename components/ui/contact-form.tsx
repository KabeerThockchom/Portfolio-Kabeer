'use client'
import { useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { EMAIL } from '@/app/data'

export function ContactForm() {
  const [data, setData] = useState({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [status, setStatus] = useState('')
  function submit(event: React.FormEvent) {
    event.preventDefault()
    const next: Record<string, string> = {}
    if (!data.name.trim()) next.name = 'Enter your name.'
    if (!/^\S+@\S+\.\S+$/.test(data.email.trim()))
      next.email = 'Enter a valid email address.'
    if (!data.message.trim()) next.message = 'Add a message.'
    setErrors(next)
    if (Object.keys(next).length) return
    const subject = encodeURIComponent(
      `Portfolio Contact from ${data.name.trim()}`,
    )
    const body = encodeURIComponent(
      `Name: ${data.name.trim()}\nEmail: ${data.email.trim()}\n\n${data.message.trim()}`,
    )
    window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`
    setStatus('Review and send the draft in your email app.')
  }
  function change(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = event.target
    setData((previous) => ({ ...previous, [name]: value }))
    setErrors((previous) => ({ ...previous, [name]: '' }))
    setStatus('')
  }
  return (
    <form className="contact-form" noValidate onSubmit={submit}>
      <div className="contact-inputs">
        {(['name', 'email'] as const).map((field) => (
          <div key={field}>
            <label htmlFor={`contact-${field}`}>
              {field === 'name' ? 'Your name' : 'Your email'}
            </label>
            <input
              id={`contact-${field}`}
              name={field}
              type={field === 'email' ? 'email' : 'text'}
              autoComplete={field}
              value={data[field]}
              onChange={change}
              aria-invalid={Boolean(errors[field])}
              aria-describedby={errors[field] ? `error-${field}` : undefined}
              placeholder={field === 'name' ? 'Name' : 'you@example.com'}
            />
            {errors[field] && (
              <p className="form-error" id={`error-${field}`}>
                {errors[field]}
              </p>
            )}
          </div>
        ))}
      </div>
      <label htmlFor="contact-message">What are you working on?</label>
      <textarea
        id="contact-message"
        name="message"
        rows={4}
        value={data.message}
        onChange={change}
        aria-invalid={Boolean(errors.message)}
        aria-describedby={errors.message ? 'error-message' : undefined}
        placeholder="A problem, a project, or a question…"
      />
      {errors.message && (
        <p className="form-error" id="error-message">
          {errors.message}
        </p>
      )}
      <button className="button button-primary" type="submit">
        Open email draft
        <ArrowUpRight size={16} />
      </button>
      <p className="form-status" role="status">
        {status}
      </p>
    </form>
  )
}
