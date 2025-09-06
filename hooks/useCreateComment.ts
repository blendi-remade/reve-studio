import { useState } from 'react'
import { useAuth } from '@/contexts/auth-context'

interface UseCreateCommentResult {
  createComment: (params: {
    postId: string
    prompt: string
    parentId?: string
  }) => Promise<void>
  creating: boolean
  error: string | null
}

export function useCreateComment(): UseCreateCommentResult {
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  const createComment = async ({ 
    postId, 
    prompt, 
    parentId 
  }: {
    postId: string
    prompt: string
    parentId?: string
  }) => {
    try {
      setCreating(true)
      setError(null)

      if (!user) {
        throw new Error('Please sign in to add comments')
      }

      // Call the correct endpoint with postId in the path
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.id}` // Add auth header
        },
        body: JSON.stringify({
          prompt,
          parentId: parentId || null
        })
      })

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Please sign in to add comments')
        }
        const errorData = await response.json()
        throw new Error(errorData.error || `Failed to create comment: ${response.status}`)
      }

      const data = await response.json()
      console.log('Comment created with generation:', data)
      
    } catch (err) {
      console.error('Error creating comment:', err)
      setError(err instanceof Error ? err.message : 'Failed to create comment')
      throw err // Re-throw so modal can handle it
    } finally {
      setCreating(false)
    }
  }

  return {
    createComment,
    creating,
    error
  }
}
