import { useState, useEffect } from 'react'
import { PostWithProfile } from '@/lib/types/domain.types'

interface UsePostResult {
  post: PostWithProfile | null
  loading: boolean
  error: string | null
}

export function usePost(postId: string): UsePostResult {
  const [post, setPost] = useState<PostWithProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`/api/posts/${postId}`)
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Post not found')
          }
          throw new Error(`Failed to fetch post: ${response.status}`)
        }

        const data = await response.json()
        setPost(data.post)
      } catch (err) {
        console.error('Error fetching post:', err)
        setError(err instanceof Error ? err.message : 'Failed to load post')
        setPost(null)
      } finally {
        setLoading(false)
      }
    }

    if (postId) {
      fetchPost()
    }
  }, [postId])

  return { post, loading, error }
}
