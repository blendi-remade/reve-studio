import { NextRequest, NextResponse } from 'next/server'
import { CommentService } from '@/lib/services/comment.service'
import { ProfileService } from '@/lib/services/profile.service'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const { postId } = await params
    const body = await req.json()
    const { prompt, parentId } = body

    // Get user from auth header
    const authHeader = req.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = authHeader.replace('Bearer ', '')
    
    // Verify user exists
    const profileService = new ProfileService
    const profile = await profileService.getProfile(userId)
    if (!profile) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Create comment with generation
    const commentService = CommentService.create()
    const comment = await commentService.createCommentWithGeneration({
      postId,
      userId,
      prompt,
      parentId
    })

    return NextResponse.json(comment)
  } catch (error) {
    console.error('Create comment error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create comment' },
      { status: 500 }
    )
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const { postId } = await params
    
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
