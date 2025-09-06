"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Heart, MessageSquare, Zap } from "lucide-react";
import { KeyboardNav } from "@/components/keyboard-nav";
import { useKeyboardNavigation } from "@/hooks/useKeyboardNavigation";
import { useComments } from "@/hooks/useComments";
import { useCreateComment } from "@/hooks/useCreateComment";
import { AddCommentModal } from "@/components/modal/add-comment-modal";
import { useAuth } from "@/contexts/auth-context";
import { useLikeComment } from "@/hooks/useLikeComment";

// Updated to match real API data structure
interface CommentTree {
  id: string
  post_id: string
  parent_id: string | null
  user_id: string
  prompt: string
  image_url: string
  created_at: string
  profiles: {
    id: string
    display_name: string | null
    avatar_url: string | null
  }
  children: CommentTree[]
  depth: number
  likes_count: number;
}

interface PostPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function PostPage({ params: paramsPromise }: PostPageProps) {
  const [params, setParams] = useState<{ id: string } | null>(null);
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [replyingTo, setReplyingTo] = useState<{
    id: string
    prompt: string
    author: string
  } | null>(null);

  const { user } = useAuth();
  
  // Resolve params
  useEffect(() => {
    paramsPromise.then(setParams);
  }, [paramsPromise]);

  // Use real API data
  const { comments, flattenedComments, loading, error, refetch, optimisticUpdateLikes } = useComments(params?.id || '');
  
  const { createComment } = useCreateComment();
  const { toggleLike } = useLikeComment();

  // Use keyboard navigation with real data
  const { selectedItemId, setSelectedItemId } = useKeyboardNavigation({
    items: flattenedComments,
    getItemId: (comment) => comment.id,
    initialSelectedId: flattenedComments.length > 0 ? flattenedComments[0].id : ''
  });

  useEffect(() => {
    if (flattenedComments.length > 0 && !selectedItemId) {
      // You might need to add setSelectedItemId to your hook's return value
    }
  }, [flattenedComments.length, selectedItemId]);

  const handleCommentSubmit = async (prompt: string) => {
    if (!params?.id) return;
    
    await createComment({
      postId: params.id,
      prompt,
      parentId: replyingTo?.id
    });
    
    await refetch(); // Refresh comments
    setReplyingTo(null); // Reset reply state
  };

  const handleAddPrompt = () => {
    if (!user) {
      alert('Please sign in to add comments');
      return;
    }
    setShowAddModal(true);
  };

  const handleReply = (comment: CommentTree) => {
    if (!user) {
      alert('Please sign in to reply');
      return;
    }
    
    setReplyingTo({
      id: comment.id,
      prompt: comment.prompt,
      author: comment.profiles.display_name || 'Anonymous'
    });
    setShowAddModal(true);
  };

  if (!params) return <div>Loading...</div>;

  const CommentComponent = ({ comment }: { comment: CommentTree }) => {
    const isSelected = selectedItemId === comment.id;
    const isRoot = comment.depth === 0;
    
    // Use inline styles for reliable indentation
    const indentStyle = {
      marginLeft: comment.depth * 24 + 'px', // 24px per level
      position: 'relative' as const
    };

    return (
      <div className="relative">
        {/* Threading line for non-root comments */}
        {comment.depth > 0 && (
          <div 
            className="absolute w-0.5 bg-black opacity-20"
            style={{
              left: (comment.depth * 24 - 12) + 'px',
              top: 0,
              bottom: 0
            }}
          />
        )}
        
        <div 
          style={indentStyle}
          className={`
            border-2 border-black p-2 cursor-pointer transition-all duration-200
            ${comment.depth > 0 ? 'bg-yellow-100' : 'bg-gray-50'}
            ${isSelected 
              ? 'ring-4 ring-black ring-opacity-50 rotate-0 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] scale-[1.02]' 
              : 'rotate-[-0.5deg] hover:rotate-0 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
            }
          `}
        >
          {/* Connection line to parent */}
          {comment.depth > 0 && (
            <div 
              className="absolute h-0.5 bg-black opacity-20"
              style={{
                left: '-12px',
                top: '12px',
                width: '12px'
              }}
            />
          )}
          
          {/* Rest of your component stays the same */}
          <div className="flex items-center gap-2 mb-1">
            <div className={`w-6 h-6 text-white rounded-full flex items-center justify-center text-xs font-bold ${comment.depth === 0 ? 'bg-black' : 'bg-gray-800'}`}>
              {(comment.profiles.display_name || 'Anonymous').charAt(0).toUpperCase()}
            </div>
            <span className="font-semibold text-sm">
              {comment.profiles.display_name || 'Anonymous'}
            </span>
            <Badge variant="outline" className="text-xs border-black px-1 py-0">
              {comment.depth === 0 ? 'Root' : `Level ${comment.depth}`}
            </Badge>
          </div>
          <p className="text-xs mb-1 font-mono">&quot;{comment.prompt}&quot;</p>
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="ghost" 
              className="text-xs hover:bg-black hover:text-white h-6 px-2"
              onClick={async () => {
                try {
                  // Optimistic update first
                  optimisticUpdateLikes(comment.id, comment.likes_count === 0);
                  
                  // Then make API call (no refetch needed!)
                  await toggleLike(comment.id);
                } catch (error) {
                  // On error, refetch to restore correct state
                  await refetch();
                }
              }}
            >
              <Heart className="w-3 h-3 mr-1" />
              {comment.likes_count || 0}
            </Button>
            <Button 
              size="sm" 
              variant="ghost" 
              className="text-xs hover:bg-black hover:text-white h-6 px-2"
              onClick={() => handleReply(comment)}
            >
              Reply
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen bg-white p-3 overflow-hidden">
      <div className="max-w-6xl mx-auto h-full flex flex-col">
        {/* Quirky header */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" className="rotate-[-2deg] hover:rotate-0 transition-transform">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="border-2 border-black bg-yellow-200 px-4 py-2 rotate-[1deg] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <h1 className="text-xl font-bold">Post #{params.id.slice(-8)}</h1>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Badge variant="outline" className="rotate-[-1deg] border-2 border-black font-mono">
              🍌 nano banana
            </Badge>
            <Badge variant="outline" className="rotate-[2deg] border-2 border-black">
              LIVE
            </Badge>
          </div>
        </div>
        
        {/* Main content area */}
        <div className="grid lg:grid-cols-2 gap-6 flex-1 min-h-0">
          {/* Image display area - left side */}
          <div className="space-y-4">
            <Card className="border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rotate-[-0.5deg] hover:rotate-0 transition-transform h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-mono">Current Edit</CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-dashed border-black rounded-lg flex items-center justify-center relative overflow-hidden">
                  <div className="text-center p-8">
                    <Zap className="w-12 h-12 mx-auto mb-4 rotate-12" />
                    <p className="text-lg font-semibold mb-2">Original Image</p>
                    <p className="text-sm text-gray-600 font-mono">Ready for nano banana magic ✨</p>
                  </div>
                  
                  {/* Playful corner decoration */}
                  <div className="absolute top-2 right-2 w-8 h-8 bg-black rotate-45"></div>
                  <div className="absolute bottom-2 left-2 w-6 h-6 bg-yellow-200 rotate-12 border-2 border-black"></div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Comments area - right side */}
          <div className="space-y-4">
            <Card className="border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rotate-[0.5deg] hover:rotate-0 transition-transform h-full flex flex-col">
              <CardHeader className="border-b-2 border-black border-dashed pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="font-mono flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Prompt Comments
                  </CardTitle>
                  <Button 
                    size="sm" 
                    className="bg-black text-white hover:bg-gray-800 rotate-[-2deg] hover:rotate-0 transition-transform"
                    onClick={handleAddPrompt}
                  >
                    + Add Prompt
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-4 flex-1 overflow-y-auto">
                {/* Loading State */}
                {loading && (
                  <div className="text-center py-8">
                    <div className="w-8 h-8 bg-black rotate-45 mx-auto mb-4 animate-pulse"></div>
                    <p className="font-mono text-sm">Loading comments...</p>
                  </div>
                )}

                {/* Error State */}
                {error && (
                  <div className="text-center py-8">
                    <p className="text-red-600 font-mono text-sm">⚠️ {error}</p>
                  </div>
                )}

                {/* Comments */}
                {!loading && !error && (
                  <div className="space-y-4">
                    {comments.length > 0 ? (
                      <>
                        {flattenedComments.map(comment => (
                          <CommentComponent key={comment.id} comment={comment} />
                        ))}
                      </>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-500 font-mono text-sm rotate-[-1deg]">
                          No comments yet. Be the first to add a prompt! 🎨
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <KeyboardNav />
      
      {showAddModal && (
        <AddCommentModal
          postId={params.id}
          parentComment={replyingTo || undefined}
          onClose={() => {
            setShowAddModal(false);
            setReplyingTo(null);
          }}
          onSubmit={handleCommentSubmit}
        />
      )}
    </div>
  );
}
