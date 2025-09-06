import { NextResponse } from 'next/server'
import { DatabaseService } from '@/lib/services/database.service'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const { postId } = await params
    
    const db = DatabaseService.create()
    const post = await db.findById('posts', postId)
    
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }
    
    return NextResponse.json({ post })
  } catch (error) {
    console.error('Error fetching post:', error)
    return NextResponse.json(
      { error: 'Failed to fetch post' }, 
      { status: 500 }
    )
  }
}
