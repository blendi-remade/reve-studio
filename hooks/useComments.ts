import { useState, useEffect } from 'react'
import { Comment } from '@/lib/types/domain.types'

// Extended comment type that matches what our API returns
interface CommentWithProfile {
  id: string
  post_id: string
  parent_id: string | null
  user_id: string
  prompt: string
  image_url: string
  created_at: string
  profiles: {
    id: string
    display_name: string | null
    avatar_url: string | null
  }
}

interface CommentTree extends CommentWithProfile {
  children: CommentTree[]
  depth: number
}

interface UseCommentsResult {
  comments: CommentTree[]
  flattenedComments: CommentTree[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useComments(postId: string): UseCommentsResult {
  const [comments, setComments] = useState<CommentTree[]>([])
  const [flattenedComments, setFlattenedComments] = useState<CommentTree[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchComments = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/posts/${postId}/comments`)
      
      if (!response.ok) {
        if (response.status === 500) {
          throw new Error('Invalid post ID format')
        }
        throw new Error(`Failed to fetch comments: ${response.status}`)
      }

      const data = await response.json()
      
      setComments(data.comments || [])
      setFlattenedComments(data.flattened || [])
    } catch (err) {
      console.error('Error fetching comments:', err)
      setError(err instanceof Error ? err.message : 'Failed to load comments')
      setComments([])
      setFlattenedComments([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (postId) {
      fetchComments()
    }
  }, [postId])

  return {
    comments,
    flattenedComments,
    loading,
    error,
    refetch: fetchComments
  }
}
