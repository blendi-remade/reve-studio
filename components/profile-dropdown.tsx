'use client'

import { useState, useRef, useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { LogOut, User, Zap, Settings } from 'lucide-react'

export function ProfileDropdown() {
  const { user, profile, signOut } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (!user || !profile) return null

  // Get initials for avatar
  const initials = profile.display_name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase() || 'U'

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 border-2 border-black bg-white px-3 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all duration-200 rotate-[-1deg] hover:rotate-0"
      >
        {/* Avatar */}
        {profile.avatar_url ? (
          <img
            src={profile.avatar_url}
            alt={profile.display_name || 'User'}
            className="w-8 h-8 rounded-full border-2 border-black"
          />
        ) : (
          <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-bold">
            {initials}
          </div>
        )}
        
        {/* Name */}
        <span className="font-mono text-sm hidden sm:block">
          {profile.display_name || profile.email || 'User'}
        </span>
        
        {/* Dropdown arrow */}
        <div className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 z-50">
          <Card className="w-56 border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rotate-[1deg] bg-white">
            <CardContent className="p-2">
              {/* User info */}
              <div className="border-b-2 border-black border-dashed pb-3 mb-3">
                <div className="flex items-center gap-3 p-2">
                  {profile.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt={profile.display_name || 'User'}
                      className="w-10 h-10 rounded-full border-2 border-black"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-yellow-200 border-2 border-black rounded-full flex items-center justify-center text-sm font-bold">
                      {initials}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-mono text-sm font-semibold truncate">
                      {profile.display_name || 'User'}
                    </p>
                    <p className="text-xs text-gray-600 truncate">
                      {profile.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Menu items */}
              <div className="space-y-1">
                <button
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm font-mono hover:bg-black hover:text-white transition-colors duration-200 rounded rotate-[-0.5deg] hover:rotate-0"
                  onClick={() => {
                    // Navigate to profile page
                    setIsOpen(false)
                  }}
                >
                  <User className="w-4 h-4" />
                  <span>My Profile</span>
                </button>

                <button
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm font-mono hover:bg-black hover:text-white transition-colors duration-200 rounded rotate-[0.5deg] hover:rotate-0"
                  onClick={() => {
                    // Navigate to settings
                    setIsOpen(false)
                  }}
                >
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </button>

                <div className="border-t-2 border-black border-dashed my-2"></div>

                <button
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm font-mono hover:bg-red-500 hover:text-white transition-colors duration-200 rounded rotate-[-0.5deg] hover:rotate-0"
                  onClick={async () => {
                    await signOut()
                    setIsOpen(false)
                  }}
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>

              {/* Fun footer */}
              <div className="mt-3 pt-3 border-t-2 border-black border-dashed">
                <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                  <Zap className="w-3 h-3" />
                  <span className="font-mono rotate-[2deg]">Powered by 🍌</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
