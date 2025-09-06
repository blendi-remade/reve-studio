import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { CommentService } from '@/lib/services/comment.service'

export async function DELETE(
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
    
    const commentService = CommentService.create()
    await commentService.deleteComment(commentId, user.id)
    
    return NextResponse.json({ message: 'Comment deleted successfully' })
  } catch (error) {
    console.error('Error deleting comment:', error)
    
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return NextResponse.json({ error: error.message }, { status: 403 })
    }
    
    return NextResponse.json(
      { error: 'Failed to delete comment' }, 
      { status: 500 }
    )
  }
}
