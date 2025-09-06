import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { PostService } from '@/lib/services/post.service'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const { postId } = await params;
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const postService = PostService.create()
    const result = await postService.toggleLike(postId, user.id)
    
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error toggling like:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}