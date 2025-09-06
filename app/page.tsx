'use client'

import { useAuth } from '@/contexts/auth-context'
import { SignInModal } from '@/components/modal/sign-in-modal'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'

export default function HomePage() {
  const { user, loading } = useAuth()
  const [showSignIn, setShowSignIn] = useState(false)

  useEffect(() => {
    // Show sign in modal if not authenticated after loading
    if (!loading && !user) {
      setShowSignIn(true)
    }
  }, [loading, user])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-black rotate-45 mx-auto mb-4 animate-pulse"></div>
          <p className="font-mono">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white p-6">
      {/* Your existing page content */}
      
      {/* Show sign in modal if needed */}
      {showSignIn && !user && <SignInModal />}
      
      {/* Or trigger it with a button */}
      {!user && (
        <Button 
          onClick={() => setShowSignIn(true)}
          className="fixed bottom-6 right-6 bg-black text-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[4px] active:translate-y-[4px]"
        >
          Sign In
        </Button>
      )}
    </div>
  )
}
