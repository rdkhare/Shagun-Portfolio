'use client'

import dynamic from 'next/dynamic'
import config from '../../../sanity.config'
import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'

const NextStudio = dynamic(() => import('next-sanity/studio').then((mod) => mod.NextStudio), { ssr: false })

export default function StudioPage({ params }: { params: Promise<{ index: string[] }> }) {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [isVerified, setIsVerified] = useState(false)
  const [error, setError] = useState(false)

  // Unwrap the params promise
  const resolvedParams = use(params)

  const studioPassword = process.env.NEXT_PUBLIC_STUDIO_PROTECT_PASSWORD

  // Redirect to structure tool if no tool is specified
  useEffect(() => {
    if (!studioPassword || isVerified) {
      if (!resolvedParams.index || resolvedParams.index.length === 0) {
        router.replace('/studio/structure')
      }
    }
  }, [resolvedParams.index, studioPassword, isVerified, router])

  // if no password is required, or if password is verified
  if (!studioPassword || isVerified) {
    // Don't render NextStudio if we're redirecting
    if (!resolvedParams.index || resolvedParams.index.length === 0) {
      return <div>Redirecting...</div>
    }
    return <NextStudio config={config} />
  }

  const handlePasswordSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (password === studioPassword) {
      setIsVerified(true)
      setError(false)
      // Redirect to structure tool after successful authentication
      if (!resolvedParams.index || resolvedParams.index.length === 0) {
        router.replace('/studio/structure')
      }
    } else {
      setError(true)
    }
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      gap: '1rem',
      fontFamily: 'sans-serif'
    }}>
      <form onSubmit={handlePasswordSubmit} style={{display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center'}}>
        <h1>Enter Password to Access Studio</h1>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          style={{padding: '0.5rem', fontSize: '1rem', width: '250px'}}
        />
        <button type="submit" style={{padding: '0.5rem 1rem', fontSize: '1rem', cursor: 'pointer'}}>
          Enter
        </button>
        {error && <p style={{color: 'red', margin: 0}}>Incorrect password.</p>}
      </form>
    </div>
  )
} 