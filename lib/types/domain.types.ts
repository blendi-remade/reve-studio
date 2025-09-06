import type { Database } from './database.types'

export type Profile = Database['public']['Tables']['profiles']['Row']
export type Post = Database['public']['Tables']['posts']['Row']
export type Comment = Database['public']['Tables']['comments']['Row']
export type PostLike = Database['public']['Tables']['post_likes']['Row']
export type CommentLike = Database['public']['Tables']['comment_likes']['Row']

// Extended types with relations
export type PostWithProfile = Post & {
  profile?: Profile
}

export type CommentWithProfile = Comment & {
  profile?: Profile
  children?: CommentWithProfile[]
}
