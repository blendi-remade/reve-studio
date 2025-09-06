import { useState } from 'react'

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

      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postId,
          prompt,
          imageUrl: 'https://placeholder-image.jpg', // Temporary until Nano Banana
          parentId: parentId || null
        })
      })

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Please sign in to add comments')
        }
        throw new Error(`Failed to create comment: ${response.status}`)
      }

      const data = await response.json()
      console.log('Comment created:', data.comment)
      
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
