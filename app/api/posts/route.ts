import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { PostService } from '@/lib/services/post.service'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const sortBy = searchParams.get('sort') || 'likes' // 'likes' or 'date'
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    const postService = PostService.create()
    
    let posts
    if (sortBy === 'date') {
      posts = await postService.getPostsByDate(limit, offset)
    } else {
      posts = await postService.getPostsByLikes(limit, offset)
    }
    
    return NextResponse.json({ posts })
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, image_url } = body

    if (!title || !image_url) {
      return NextResponse.json({ error: 'Title and image URL are required' }, { status: 400 })
    }

    const postService = PostService.create()
    const post = await postService.createPost(user.id, title, image_url)
    
    return NextResponse.json({ post })
  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}