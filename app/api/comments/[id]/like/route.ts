import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service-role'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: commentId } = await params
    const serviceSupabase = createServiceClient()

    // Check if user already liked this comment
    const { data: existingLike } = await serviceSupabase
      .from('comment_likes')
      .select('id')
      .eq('comment_id', commentId)
      .eq('user_id', user.id)
      .single()

    if (existingLike) {
      // Unlike: Remove the like
      const { error } = await serviceSupabase
        .from('comment_likes')
        .delete()
        .eq('comment_id', commentId)
        .eq('user_id', user.id)

      if (error) throw error

      return NextResponse.json({ liked: false, message: 'Unliked' })
    } else {
      // Like: Add the like
      const { error } = await serviceSupabase
        .from('comment_likes')
        .insert({
          comment_id: commentId,
          user_id: user.id
        })

      if (error) throw error

      return NextResponse.json({ liked: true, message: 'Liked' })
    }
  } catch (error) {
    console.error('Error toggling comment like:', error)
    return NextResponse.json(
      { error: 'Failed to toggle like' }, 
      { status: 500 }
    )
  }
}
