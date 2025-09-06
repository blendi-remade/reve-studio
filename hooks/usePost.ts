import { useState, useEffect } from 'react'
import { Post } from '@/lib/types/domain.types'

interface UsePostResult {
  post: Post | null
  loading: boolean
  error: string | null
}

export function usePost(postId: string): UsePostResult {
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!postId) return

    const fetchPost = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`/api/posts/${postId}`)
        
        if (!response.ok) {
          throw new Error(`Failed to fetch post: ${response.status}`)
        }

        const data = await response.json()
        setPost(data.post)
      } catch (err) {
        console.error('Error fetching post:', err)
        setError(err instanceof Error ? err.message : 'Failed to load post')
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [postId])

  return { post, loading, error }
}
