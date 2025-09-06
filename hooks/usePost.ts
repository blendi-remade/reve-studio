import { useState, useEffect } from 'react'
import { Post } from '@/lib/types/domain.types'

interface PostWithProfile {
  id: string
  user_id: string
  title: string
  image_url: string
  likes_count: number
  created_at: string
  profiles: {
    id: string
    display_name: string | null
    avatar_url: string | null
  }
}

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
