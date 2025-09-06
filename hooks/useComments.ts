import { useState, useEffect } from 'react'

// Extended comment type that matches what our API returns
interface CommentWithProfile {
  id: string
  post_id: string
  parent_id: string | null
  user_id: string
  prompt: string
  image_url: string
  created_at: string
  status?: 'pending' | 'generating' | 'completed' | 'failed'
  error?: string
  profiles: {
    id: string
    display_name: string | null
    avatar_url: string | null
  }
}

interface CommentTree extends CommentWithProfile {
  children: CommentTree[]
  depth: number
  likes_count: number
}

interface UseCommentsResult {
  comments: CommentTree[]
  flattenedComments: CommentTree[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
  optimisticUpdateLikes: (commentId: string, increment: boolean) => void
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

  const optimisticUpdateLikes = (commentId: string, increment: boolean) => {
    setComments(prev => updateCommentLikes(prev, commentId, increment))
    setFlattenedComments(prev => updateCommentLikes(prev, commentId, increment))
  }

  const updateCommentLikes = (comments: CommentTree[], commentId: string, increment: boolean): CommentTree[] => {
    return comments.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          likes_count: Math.max(0, comment.likes_count + (increment ? 1 : -1))
        }
      }
      if (comment.children.length > 0) {
        return {
          ...comment,
          children: updateCommentLikes(comment.children, commentId, increment)
        }
      }
      return comment
    })
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
    refetch: fetchComments,
    optimisticUpdateLikes
  }
}
