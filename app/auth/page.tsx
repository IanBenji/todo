'use client'

import { useState, useEffect } from 'react'
import { SignIn, SignUp } from '@/components/auth'
import { useSupabaseAuth } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function AuthPage() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const { user } = useSupabaseAuth()
  const router = useRouter()

  // Move the redirect to useEffect
  useEffect(() => {
    if (user) {
      router.push('/')
    }
  }, [user, router])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md mx-auto pt-12">
        <div className="flex justify-center space-x-4 mb-8">
          <button
            onClick={() => setMode('signin')}
            className={`px-4 py-2 rounded-md ${
              mode === 'signin'
                ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setMode('signup')}
            className={`px-4 py-2 rounded-md ${
              mode === 'signup'
                ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            Sign Up
          </button>
        </div>
        {mode === 'signin' ? <SignIn /> : <SignUp />}
      </div>
    </div>
  )
}