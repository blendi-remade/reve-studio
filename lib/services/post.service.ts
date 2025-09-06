import { DatabaseService } from './database.service'
import { Post, PostLike, PostWithProfile } from '@/lib/types/domain.types'

export class PostService {
  private db: DatabaseService
  
  constructor() {
    this.db = DatabaseService.create()
  }

  static create() {
    return new PostService()
  }

  // Get posts ordered by likes (hot feed)
  async getPostsByLikes(limit = 20, offset = 0): Promise<PostWithProfile[]> {
    return this.db.query<PostWithProfile>('posts', {
      select: '*, profile:profiles(*)',
      orderBy: { column: 'likes_count', ascending: false },
      limit,
      offset
    })
  }

  // Get posts ordered by creation date (new feed)
  async getPostsByDate(limit = 20, offset = 0): Promise<PostWithProfile[]> {
    return this.db.query<PostWithProfile>('posts', {
      select: '*, profile:profiles(*)',
      orderBy: { column: 'created_at', ascending: false },
      limit,
      offset
    })
  }

  // Get a single post
  async getPost(postId: string): Promise<PostWithProfile | null> {
    const posts = await this.db.query<PostWithProfile>('posts', {
      select: '*, profile:profiles(*)',
      eq: { id: postId }
    })
    return posts[0] || null
  }

  // Create a new post
  async createPost(userId: string, title: string, imageUrl: string): Promise<Post> {
    return this.db.insert<Post>('posts', {
      user_id: userId,
      title,
      image_url: imageUrl,
      likes_count: 0
    })
  }

  // Delete a post
  async deletePost(postId: string): Promise<void> {
    return this.db.delete('posts', postId)
  }

  // Like/unlike a post
  async toggleLike(postId: string, userId: string): Promise<{ liked: boolean; likesCount: number }> {
    // Check if already liked
    const existingLikes = await this.db.query<PostLike>('post_likes', {
      eq: { post_id: postId, user_id: userId }
    })

    if (existingLikes.length > 0) {
      // Unlike
      await this.db.delete('post_likes', existingLikes[0].id)
      const post = await this.getPost(postId)
      return { liked: false, likesCount: post?.likes_count || 0 }
    } else {
      // Like
      await this.db.insert<PostLike>('post_likes', {
        post_id: postId,
        user_id: userId
      })
      const post = await this.getPost(postId)
      return { liked: true, likesCount: post?.likes_count || 0 }
    }
  }

  // Check if user has liked a post
  async hasUserLiked(postId: string, userId: string): Promise<boolean> {
    const likes = await this.db.query<PostLike>('post_likes', {
      eq: { post_id: postId, user_id: userId }
    })
    return likes.length > 0
  }

  // Get posts by user
  async getPostsByUser(userId: string, limit = 20, offset = 0): Promise<PostWithProfile[]> {
    return this.db.query<PostWithProfile>('posts', {
      select: '*, profile:profiles(*)',
      eq: { user_id: userId },
      orderBy: { column: 'created_at', ascending: false },
      limit,
      offset
    })
  }
}