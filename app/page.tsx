'use client'

import { useAuth } from '@/contexts/auth-context'
import { SignInModal } from '@/components/modal/sign-in-modal'
import { CreatePostModal } from '@/components/modal/create-post-modal'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useEffect, useState } from 'react'
import { Plus, Heart, MessageSquare, TrendingUp, Clock } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const { user, loading } = useAuth()
  const [showSignIn, setShowSignIn] = useState(false)
  const [showCreatePost, setShowCreatePost] = useState(false)
  const [posts, setPosts] = useState<any[]>([])
  const [sortBy, setSortBy] = useState<'likes' | 'date'>('likes')
  const router = useRouter()

  useEffect(() => {
    // Show sign in modal if not authenticated after loading
    if (!loading && !user) {
      setShowSignIn(true)
    }
  }, [loading, user])

  useEffect(() => {
    // Fetch posts
    if (!loading) {
      fetchPosts()
    }
  }, [loading, sortBy])

  const fetchPosts = async () => {
    try {
      const response = await fetch(`/api/posts?sort=${sortBy}`)
      if (response.ok) {
        const { posts } = await response.json()
        setPosts(posts)
      }
    } catch (error) {
      console.error('Error fetching posts:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-black rotate-45 mx-auto mb-4 animate-pulse"></div>
          <p className="font-mono">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <main className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Hero section */}
        <div className="text-center py-12 mb-8">
          <h2 className="text-4xl font-bold mb-4 rotate-[-1deg]">
            Welcome to Banana Peel!
          </h2>
          <p className="text-lg text-gray-600 font-mono rotate-[0.5deg] mb-8">
            AI image remixing, Reddit-style 🎨
          </p>
          
          {user && (
            <Button
              onClick={() => setShowCreatePost(true)}
              className="bg-black text-white border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[6px] active:translate-y-[6px] text-lg px-6 py-3 rotate-[-1deg] hover:rotate-0"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create First Post
            </Button>
          )}
        </div>

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

        {/* Posts grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post, index) => (
            <Card
              key={post.id}
              onClick={() => router.push(`/post/${post.id}`)}
              className={`border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] cursor-pointer transition-all duration-200 rotate-[${index % 2 === 0 ? '-' : ''}0.5deg] hover:rotate-0`}
            >
              <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 border-b-2 border-black">
                {/* Image will go here */}
                <div className="w-full h-full flex items-center justify-center">
                  <p className="font-mono text-gray-500">Image Preview</p>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2">{post.title}</h3>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      {post.likes_count}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-4 h-4" />
                      0
                    </span>
                  </div>
                  <Badge variant="outline" className="border-black text-xs">
                    by {post.profile?.display_name || 'Anonymous'}
                  </Badge>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 font-mono rotate-[-1deg]">
              No posts yet. Be the first to create one!
            </p>
          </div>
        )}
      </div>
      
      {/* Create post button (floating) */}
      {user && posts.length > 0 && (
        <Button
          onClick={() => setShowCreatePost(true)}
          className="fixed bottom-6 right-6 bg-black text-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] w-14 h-14 rounded-full p-0"
        >
          <Plus className="w-6 h-6" />
        </Button>
      )}
      
      {/* Modals */}
      {showSignIn && !user && <SignInModal />}
      {showCreatePost && <CreatePostModal onClose={() => setShowCreatePost(false)} />}
      
      {/* Sign in button if not authenticated */}
      {!user && (
        <Button 
          onClick={() => setShowSignIn(true)}
          className="fixed bottom-6 right-6 bg-black text-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[4px] active:translate-y-[4px]"
        >
          Sign In
        </Button>
      )}
    </main>
  )
}
