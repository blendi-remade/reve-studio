'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Heart, MessageSquare } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { PostWithProfile } from '@/lib/types/domain.types'
import { useAuth } from '@/contexts/auth-context'

interface PostCardProps {
  post: PostWithProfile
  index: number
  initialLikeStatus?: boolean // Pass this from parent to avoid individual API calls
  onLikeUpdate?: (postId: string, newLikesCount: number, isLiked: boolean) => void
}

export function PostCard({ post, index, initialLikeStatus, onLikeUpdate }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(initialLikeStatus ?? false)
  const [likesCount, setLikesCount] = useState(post.likes_count || 0)
  const [isLiking, setIsLiking] = useState(false)
  const { user } = useAuth()
  const router = useRouter()

  // Only fetch like status if not provided as prop
  useEffect(() => {
    if (user && initialLikeStatus === undefined) {
      fetchLikeStatus()
    }
  }, [user, post.id, initialLikeStatus])

  const fetchLikeStatus = async () => {
    try {
      const response = await fetch(`/api/posts/${post.id}/liked`)
      if (response.ok) {
        const { liked } = await response.json()
        setIsLiked(liked)
      }
    } catch (error) {
      console.error('Error fetching like status:', error)
    }
  }

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent card click when clicking like button
    
    if (!user || isLiking) {
      return
    }

    // Optimistic update - update UI immediately
    const wasLiked = isLiked
    const previousCount = likesCount
    const newLiked = !wasLiked
    const newCount = wasLiked ? previousCount - 1 : previousCount + 1

    // Update UI immediately for instant feedback
    setIsLiked(newLiked)
    setLikesCount(newCount)
    setIsLiking(true)

    // Notify parent immediately with optimistic values
    onLikeUpdate?.(post.id, newCount, newLiked)
    
    try {
      const response = await fetch(`/api/posts/${post.id}/like`, {
        method: 'POST'
      })

      if (response.ok) {
        const { liked, likesCount: serverLikesCount } = await response.json()
        
        // Update with server response (in case of discrepancy)
        setIsLiked(liked)
        setLikesCount(serverLikesCount)
        onLikeUpdate?.(post.id, serverLikesCount, liked)
      } else {
        // Revert on error
        setIsLiked(wasLiked)
        setLikesCount(previousCount)
        onLikeUpdate?.(post.id, previousCount, wasLiked)
      }
    } catch (error) {
      console.error('Error toggling like:', error)
      // Revert on error
      setIsLiked(wasLiked)
      setLikesCount(previousCount)
      onLikeUpdate?.(post.id, previousCount, wasLiked)
    } finally {
      setIsLiking(false)
    }
  }

  const handleCardClick = () => {
    router.push(`/post/${post.id}`)
  }

  return (
    <Card
      onClick={handleCardClick}
      className={`border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] cursor-pointer transition-all duration-200 rotate-[${index % 2 === 0 ? '-' : ''}0.5deg] hover:rotate-0`}
    >
      {/* Image */}
      <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 border-b-2 border-black relative overflow-hidden">
        {post.image_url ? (
          <img
            src={post.image_url}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <p className="font-mono text-gray-500">Image Preview</p>
          </div>
        )}
        
        {/* Floating like button on image */}
        {user && (
          <Button
            onClick={handleLike}
            disabled={false} // Never disable for better UX
            className={`absolute top-3 right-3 w-10 h-10 p-0 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all duration-200 rotate-[5deg] hover:rotate-0 ${
              isLiked 
                ? 'bg-red-500 text-white hover:bg-red-600' 
                : 'bg-white text-black hover:bg-gray-100'
            }`}
          >
            <Heart 
              className={`w-4 h-4 ${isLiked ? 'fill-current' : ''} transition-all duration-200`} 
            />
          </Button>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title and Author in a row */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-lg line-clamp-2 flex-1 mr-3">{post.title}</h3>
          
          {/* Author info - matching post page style */}
          <div className="flex items-center gap-2 border-2 border-black bg-gray-100 px-2 py-1 rotate-[-0.5deg] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-xs">
            <div className="w-5 h-5 bg-black text-white rounded-full flex items-center justify-center text-xs font-bold">
              {(post.profile?.display_name || 'Anonymous').charAt(0).toUpperCase()}
            </div>
            <span className="font-semibold">
              {post.profile?.display_name || 'Anonymous'}
            </span>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-3">
            {/* Likes count */}
            <span className="flex items-center gap-1 font-mono">
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-current text-red-500' : ''} transition-colors duration-200`} />
              <span className="transition-all duration-200">{likesCount}</span>
            </span>
            
            {/* Comments count - use real data instead of hardcoded 0 */}
            <span className="flex items-center gap-1 font-mono">
              <MessageSquare className="w-4 h-4" />
              {post.comments_count || 0}
            </span>
          </div>
        </div>
      </div>
    </Card>
  )
}
