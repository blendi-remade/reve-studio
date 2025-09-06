'use client'

import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'
import { Zap } from 'lucide-react'
import Image from 'next/image';

export default function HomePage() {
  const { signInWithGoogle, loading } = useAuth()

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
    <main className="min-h-screen flex items-center justify-center p-6 bg-white">
      <div className="max-w-md w-full">
        <div className="text-center space-y-8">
          {/* Logo */}
          <div className="flex justify-center">
            <div className="p-8 rotate-[2deg] hover:rotate-0 transition-transform inline-block border-2 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] bg-white">
              <Image 
                src="/logo.png"
                alt="Banana Peel Logo"
                width={200}
                height={200}
                className="object-contain"
                priority
              />
            </div>
          </div>

          {/* Title */}
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-2xl text-black font-bold rotate-[0.5deg]">
                Where images evolve through prompts
              </p>
              <p className="text-xl text-gray-600 font-mono rotate-[0.5deg]">
                Drop a comment, watch the magic happen ✨
              </p>
            </div>
          </div>

          {/* Sign in button */}
          <div className="pt-8">
            <Button 
              onClick={signInWithGoogle}
              disabled={loading}
              className="w-full max-w-sm h-14 bg-white text-black border-2 border-black hover:bg-black hover:text-white transition-all duration-200 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[6px] active:translate-y-[6px] text-lg font-semibold rotate-[-0.5deg] hover:rotate-0"
            >
              <GoogleIcon className="h-6 w-6 mr-3" />
              Sign in with Google
            </Button>
          </div>

          {/* Footer decorations */}
          <div className="pt-12 space-y-4">
            <p className="text-sm text-gray-500 font-mono rotate-[1deg]">
              Built with 🍌 at the hackathon
            </p>
            <div className="flex justify-center gap-3">
              <div className="w-3 h-3 bg-black rotate-45"></div>
              <div className="w-3 h-3 bg-yellow-200 border-2 border-black rotate-12"></div>
              <div className="w-3 h-3 bg-black rotate-45"></div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

const GoogleIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
)