"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Loader2, Zap, LogIn } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useSearchParams } from "next/navigation"

interface SignInModalProps {
  redirectUrl?: string;
}

export function SignInModal({ redirectUrl: propRedirectUrl }: SignInModalProps = {}) {
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const { signInWithGoogle } = useAuth()
  const searchParams = useSearchParams()
  const urlRedirectUrl = searchParams.get('redirect')
  
  // Use prop redirect URL if provided, otherwise fall back to URL search params
  const redirectUrl = propRedirectUrl || urlRedirectUrl

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true)
      setError(null)
      await signInWithGoogle()
    } catch (err: any) {
      console.error('Google sign in error:', err)
      setError(err.message || "Failed to sign in. Please try again.")
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <div className="absolute inset-0 bg-white/80"></div>
      
      <Card className="w-full max-w-md relative border-2 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] rotate-[-1deg] hover:rotate-0 transition-transform bg-white">
        {/* Fun corner decorations */}
        <div className="absolute -top-3 -right-3 w-12 h-12 bg-yellow-200 rotate-12 border-2 border-black"></div>
        <div className="absolute -bottom-2 -left-2 w-8 h-8 bg-black rotate-45"></div>
        
        <CardHeader className="text-center border-b-2 border-black border-dashed pb-6">
          <div className="flex justify-center mb-4">
            <div className="bg-black text-white p-4 rotate-[2deg] hover:rotate-0 transition-transform">
              <Zap className="w-12 h-12" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold font-mono">
            ✨ Reve Studio
          </CardTitle>
          <p className="text-sm text-gray-600 mt-2 rotate-[-0.5deg]">
            AI image remixing, Reddit-style
          </p>
        </CardHeader>
        
        <CardContent className="space-y-4 pt-6 pb-6">
          {error && (
            <div className="bg-red-100 border-2 border-red-500 p-3 rotate-[0.5deg] text-sm text-red-700">
              {error}
            </div>
          )}
          
          <div className="space-y-3">
            <div className="text-center mb-4">
              <p className="text-sm font-mono rotate-[1deg] inline-block">
                Ready to remix some images?
              </p>
            </div>
            
            <Button 
              onClick={handleGoogleSignIn} 
              disabled={loading}
              className="w-full h-12 bg-white text-black border-2 border-black hover:bg-black hover:text-white transition-all duration-200 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] font-semibold rotate-[-0.5deg] hover:rotate-0"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <GoogleIcon className="h-5 w-5 mr-2" />
                  Sign in with Google
                </>
              )}
            </Button>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-black border-dashed"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-2 text-gray-500 font-mono rotate-[2deg]">
                  AI powered
                </span>
              </div>
            </div>
            
            <Button 
              variant="outline"
              disabled
              className="w-full h-12 border-2 border-gray-300 text-gray-400 cursor-not-allowed rotate-[0.5deg]"
            >
              <LogIn className="h-5 w-5 mr-2" />
              More providers coming soon™
            </Button>
          </div>
        </CardContent>
        
        <CardFooter className="border-t-2 border-black border-dashed">
          <div className="w-full space-y-2">
            <p className="text-xs text-center text-gray-600 font-mono rotate-[-0.5deg]">
              Built with ✨ and creativity
            </p>
            <div className="flex justify-center gap-2">
              <div className="w-2 h-2 bg-black rotate-45"></div>
              <div className="w-2 h-2 bg-yellow-200 border border-black rotate-12"></div>
              <div className="w-2 h-2 bg-black rotate-45"></div>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
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