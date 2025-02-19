// components/SignOutButton.tsx
'use client'

import { supabase } from '@/lib/supabase'

export function SignOutButton() {
  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  return (
    <button
      onClick={handleSignOut}
      className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
    >
      Sign Out
    </button>
  )
}