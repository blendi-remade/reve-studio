'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { X, Zap } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'

interface AddCommentModalProps {
  postId: string
  parentComment?: {
    id: string
    prompt: string
    author: string
  }
  onClose: () => void
  onSubmit: (prompt: string) => Promise<void>
}

export function AddCommentModal({ 
  postId, 
  parentComment, 
  onClose, 
  onSubmit 
}: AddCommentModalProps) {
  const { user, profile } = useAuth()
  const [prompt, setPrompt] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (!user || !profile) {
    return null // Should not render if not authenticated
  }

  const handleSubmit = async () => {
    if (!prompt.trim()) return
    
    try {
      setSubmitting(true)
      await onSubmit(prompt.trim())
      onClose()
    } catch (error) {
      console.error('Failed to submit comment:', error)
      // Keep modal open on error
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="border-2 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] rotate-[-1deg] hover:rotate-0 transition-transform w-full max-w-lg">
        <CardHeader className="border-b-2 border-black border-dashed pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="font-mono flex items-center gap-2">
              <Zap className="w-5 h-5" />
              {parentComment ? 'Reply to Prompt' : 'Add New Prompt'}
            </CardTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose}
              className="hover:bg-black hover:text-white"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          {parentComment && (
            <div className="mt-3 p-3 bg-yellow-100 border-2 border-black rotate-[0.5deg]">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline" className="text-xs border-black">
                  Replying to
                </Badge>
                <span className="font-semibold text-sm">{parentComment.author}</span>
              </div>
              <p className="text-xs font-mono">"{parentComment.prompt}"</p>
            </div>
          )}
        </CardHeader>
        
        <CardContent className="p-6">
          {/* User info */}
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-bold">
              {(profile.display_name || 'Anonymous').charAt(0).toUpperCase()}
            </div>
            <span className="font-semibold">{profile.display_name || 'Anonymous'}</span>
          </div>

          {/* Prompt input */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-mono font-semibold mb-2">
                Your Prompt:
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe what you want to change or add to the image..."
                className="w-full p-3 border-2 border-black font-mono text-sm resize-none h-24 focus:outline-none focus:ring-2 focus:ring-black"
                disabled={submitting}
              />
            </div>

            {/* Mock image upload area */}
            <div className="border-2 border-dashed border-black p-4 text-center bg-gray-50">
              <p className="text-sm text-gray-600 font-mono">
                ✨ AI will generate the image based on your prompt
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 justify-end">
              <Button 
                variant="outline" 
                onClick={onClose}
                disabled={submitting}
                className="border-2 border-black hover:bg-black hover:text-white"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSubmit}
                disabled={!prompt.trim() || submitting}
                className="bg-black text-white hover:bg-gray-800 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
              >
                {submitting ? 'Submitting...' : parentComment ? 'Reply' : 'Add Prompt'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
