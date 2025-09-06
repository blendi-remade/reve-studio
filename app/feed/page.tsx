'use client'

import { useEffect, useState } from 'react'
import { CreatePostModal } from '@/components/modal/create-post-modal'
import { PostCard } from '@/components/post-card'
import { Button } from '@/components/ui/button'
import { Plus, TrendingUp, Clock } from 'lucide-react'
import { PostWithProfile } from '@/lib/types/domain.types'

export default function FeedPage() {
  const [showCreatePost, setShowCreatePost] = useState(false)
  const [posts, setPosts] = useState<PostWithProfile[]>([])
  const [sortBy, setSortBy] = useState<'likes' | 'date'>('likes')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPosts()
  }, [sortBy])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/posts?sort=${sortBy}`)
      if (response.ok) {
        const { posts } = await response.json()
        setPosts(posts)
      }
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLikeUpdate = (postId: string, newLikesCount: number, isLiked: boolean) => {
    // Update the local posts state with the new like count
    setPosts(currentPosts => 
      currentPosts.map(post => 
        post.id === postId 
          ? { ...post, likes_count: newLikesCount }
          : post
      )
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-black rotate-45 mx-auto mb-4 animate-pulse"></div>
          <p className="font-mono">Loading posts...</p>
        </div>
      </div>
    )
  }

  return (
    <main className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Hero section */}
        <div className="text-center py-8 mb-6">
          <h2 className="text-3xl font-bold mb-4 rotate-[-1deg]">
            {posts.length === 0 ? "Start the remix chain!" : "Latest remixes"}
          </h2>
          
          {posts.length === 0 && (
            <Button
              onClick={() => setShowCreatePost(true)}
              className="bg-black text-white border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[6px] active:translate-y-[6px] text-lg px-6 py-3 rotate-[-1deg] hover:rotate-0"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create First Post
            </Button>
          )}
        </div>

        {posts.length > 0 && (
          <>
            {/* Sort buttons */}
            <div className="flex gap-2 mb-6">
              <Button
                onClick={() => setSortBy('likes')}
                variant={sortBy === 'likes' ? 'default' : 'outline'}
                className={`border-2 border-black ${
                  sortBy === 'likes' 
                    ? 'bg-black text-white' 
                    : 'bg-white hover:bg-gray-100'
                } rotate-[-1deg] hover:rotate-0`}
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Hot
              </Button>
              <Button
                onClick={() => setSortBy('date')}
                variant={sortBy === 'date' ? 'default' : 'outline'}
                className={`border-2 border-black ${
                  sortBy === 'date' 
                    ? 'bg-black text-white' 
                    : 'bg-white hover:bg-gray-100'
                } rotate-[1deg] hover:rotate-0`}
              >
                <Clock className="w-4 h-4 mr-2" />
                New
              </Button>
            </div>

            {/* Posts grid using PostCard component */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post, index) => (
                <PostCard
                  key={post.id}
                  post={post}
                  index={index}
                  onLikeUpdate={handleLikeUpdate}
                />
              ))}
            </div>
          </>
        )}

        {posts.length === 0 && (
          <div className="text-center py-20">
            <div className="space-y-6">
              <div className="w-24 h-24 bg-yellow-200 border-2 border-black mx-auto rotate-12 flex items-center justify-center">
                <Plus className="w-12 h-12" />
              </div>
              <p className="text-gray-500 font-mono rotate-[-1deg] text-lg">
                No posts yet. Be the first to create one!
              </p>
            </div>
          </div>
        )}
      </div>
      
      {/* Floating create post button */}
      {posts.length > 0 && (
        <Button
          onClick={() => setShowCreatePost(true)}
          className="fixed bottom-6 right-6 bg-black text-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] w-14 h-14 rounded-full p-0"
        >
          <Plus className="w-6 h-6" />
        </Button>
      )}
      
      {/* Create post modal */}
      {showCreatePost && (
        <CreatePostModal onClose={() => setShowCreatePost(false)} />
      )}
    </main>
  )
}