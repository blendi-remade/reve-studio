import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { PostService } from '@/lib/services/post.service'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const { postId } = await params;
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ liked: false })
    }

    const postService = PostService.create()
    const liked = await postService.hasUserLiked(postId, user.id)
    
    return NextResponse.json({ liked })
  } catch (error) {
    console.error('Error checking like status:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
