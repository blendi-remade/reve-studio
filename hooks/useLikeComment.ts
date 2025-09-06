import { useState } from 'react'

interface UseLikeCommentResult {
  toggleLike: (commentId: string) => Promise<void>
  isLiking: boolean
  error: string | null
}

export function useLikeComment(): UseLikeCommentResult {
  const [isLiking, setIsLiking] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const toggleLike = async (commentId: string) => {
    try {
      setIsLiking(true)
      setError(null)

      const response = await fetch(`/api/comments/${commentId}/like`, {
        method: 'POST',
      })

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Please sign in to like comments')
        }
        throw new Error(`Failed to toggle like: ${response.status}`)
      }

      const data = await response.json()
      console.log('Like toggled:', data)
      
    } catch (err) {
      console.error('Error toggling like:', err)
      setError(err instanceof Error ? err.message : 'Failed to toggle like')
      throw err
    } finally {
      setIsLiking(false)
    }
  }

  return {
    toggleLike,
    isLiking,
    error
  }
}
