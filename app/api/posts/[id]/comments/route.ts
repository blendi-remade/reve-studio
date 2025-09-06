import { NextResponse } from 'next/server'
import { CommentService } from '@/lib/services/comment.service'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: postId } = await params
    
    const commentService = CommentService.create()
    const comments = await commentService.getCommentsByPost(postId)
    const commentTree = commentService.buildCommentTree(comments)
    const flattenedComments = commentService.flattenCommentTree(commentTree)
    
    return NextResponse.json({ 
      comments: commentTree,
      flattened: flattenedComments,
      total: comments.length 
    })
  } catch (error) {
    console.error('Error fetching comments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch comments' }, 
      { status: 500 }
    )
  }
}
