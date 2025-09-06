import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { CommentService } from '@/lib/services/comment.service'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { postId, prompt, imageUrl, parentId } = body

    // Validate required fields
    if (!postId || !prompt || !imageUrl) {
      return NextResponse.json(
        { error: 'Missing required fields: postId, prompt, imageUrl' }, 
        { status: 400 }
      )
    }

    const commentService = CommentService.create()
    const comment = await commentService.createComment({
      postId,
      userId: user.id,
      prompt,
      imageUrl,
      parentId: parentId || null
    })
    
    return NextResponse.json({ comment }, { status: 201 })
  } catch (error) {
    console.error('Error creating comment:', error)
    return NextResponse.json(
      { error: 'Failed to create comment' }, 
      { status: 500 }
    )
  }
}
