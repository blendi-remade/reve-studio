import { NextRequest, NextResponse } from 'next/server'
import { FalWebhookPayload } from '@/lib/services/fal.service'
import { CommentService } from '@/lib/services/comment.service'

export async function POST(req: NextRequest) {
  try {
    const commentService = CommentService.create()

    // Parse payload directly
    const payload: FalWebhookPayload = await req.json()
    const requestId = payload.request_id

    // Find the comment by fal_request_id
    const comment = await commentService.getCommentByFalRequestId(requestId)
    if (!comment) {
      console.error('Comment not found for request:', requestId)
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 })
    }

    if (payload.status === 'OK' && payload.payload?.images?.[0]) {
      // Just use the fal.ai image URL directly
      const generatedImageUrl = payload.payload.images[0].url

      // Update comment with the generated image URL
      await commentService.updateCommentGeneration({
        commentId: comment.id,
        status: 'completed',
        imageUrl: generatedImageUrl
      })

      console.log('Successfully processed generation for comment:', comment.id)
    } else {
      // Handle error case
      const errorMessage = payload.error || 'Unknown error during generation'
      
      await commentService.updateCommentGeneration({
        commentId: comment.id,
        status: 'failed',
        error: errorMessage
      })

      console.error('Generation failed for comment:', comment.id, errorMessage)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Webhook processing error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
