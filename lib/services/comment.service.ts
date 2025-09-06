import { DatabaseService } from './database.service'
import { Comment, Profile } from '@/lib/types/domain.types'
import { createServiceClient } from '@/lib/supabase/service-role'

interface CommentWithProfile extends Comment {
  profiles: Pick<Profile, 'id' | 'display_name' | 'avatar_url'>
}

interface CommentTree extends CommentWithProfile {
  children: CommentTree[]
  depth: number
}

export class CommentService extends DatabaseService {
  constructor() {
    super(createServiceClient())
  }

  static create() {
    return new CommentService()
  }

  /**
   * Get all comments for a post with user profiles
   */
  async getCommentsByPost(postId: string): Promise<CommentWithProfile[]> {
    const { data, error } = await this.supabase
      .from('comments')
      .select(`
        *,
        profiles:user_id (
          id,
          display_name,
          avatar_url
        )
      `)
      .eq('post_id', postId)
      .order('created_at', { ascending: true })

    if (error) throw error
    return data as CommentWithProfile[]
  }

  /**
   * Create a new comment (root or reply)
   */
  async createComment({
    postId,
    userId,
    prompt,
    imageUrl,
    parentId = null
  }: {
    postId: string
    userId: string
    prompt: string
    imageUrl: string
    parentId?: string | null
  }): Promise<CommentWithProfile> {
    const { data, error } = await this.supabase
      .from('comments')
      .insert({
        post_id: postId,
        user_id: userId,
        prompt,
        image_url: imageUrl,
        parent_id: parentId
      })
      .select(`
        *,
        profiles:user_id (
          id,
          display_name,
          avatar_url
        )
      `)
      .single()

    if (error) throw error
    return data as CommentWithProfile
  }

  /**
   * Build hierarchical comment tree structure
   */
  buildCommentTree(comments: CommentWithProfile[]): CommentTree[] {
    const commentMap = new Map<string, CommentTree>()
    const rootComments: CommentTree[] = []

    // First pass: create all comment objects with children array
    comments.forEach(comment => {
      const commentWithChildren: CommentTree = {
        ...comment,
        children: [],
        depth: 0
      }
      commentMap.set(comment.id, commentWithChildren)
    })

    // Second pass: organize into tree structure
    comments.forEach(comment => {
      const commentNode = commentMap.get(comment.id)!
      
      if (comment.parent_id) {
        // This is a child comment
        const parent = commentMap.get(comment.parent_id)
        if (parent) {
          commentNode.depth = parent.depth + 1
          parent.children.push(commentNode)
        }
      } else {
        // This is a root comment
        rootComments.push(commentNode)
      }
    })

    return rootComments
  }

  /**
   * Get flattened comment list for keyboard navigation
   */
  flattenCommentTree(commentTree: CommentTree[]): CommentTree[] {
    const flattened: CommentTree[] = []
    
    const traverse = (comments: CommentTree[]) => {
      comments.forEach(comment => {
        flattened.push(comment)
        if (comment.children.length > 0) {
          traverse(comment.children)
        }
      })
    }
    
    traverse(commentTree)
    return flattened
  }

  /**
   * Delete a comment (and all its children due to CASCADE)
   */
  async deleteComment(commentId: string, userId: string): Promise<void> {
    // First verify the user owns this comment
    const { data: comment, error: fetchError } = await this.supabase
      .from('comments')
      .select('user_id')
      .eq('id', commentId)
      .single()

    if (fetchError) throw fetchError
    if (comment.user_id !== userId) {
      throw new Error('Unauthorized: You can only delete your own comments')
    }

    const { error } = await this.supabase
      .from('comments')
      .delete()
      .eq('id', commentId)

    if (error) throw error
  }
}
