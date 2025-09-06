"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Heart, MessageSquare, Zap } from "lucide-react";
import { KeyboardNav } from "@/components/keyboard-nav";

interface Comment {
  id: string;
  author: string;
  prompt: string;
  parentId: string | null;
  createdAt: string;
  likes: number;
  isRoot: boolean;
}

interface PostPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function PostPage({ params: paramsPromise }: PostPageProps) {
  const [params, setParams] = useState<{ id: string } | null>(null);
  const [selectedCommentId, setSelectedCommentId] = useState<string>('comment-1');
  
  // Resolve params
  useEffect(() => {
    paramsPromise.then(setParams);
  }, [paramsPromise]);

  // Mock data - this will come from your backend later
  const mockComments: Comment[] = [
    {
      id: 'comment-1',
      author: 'user123',
      prompt: 'Add a rainbow in the sky',
      parentId: null,
      createdAt: '2024-01-01',
      likes: 12,
      isRoot: true,
    },
    {
      id: 'comment-2', 
      author: 'artist_ai',
      prompt: 'Make it double rainbow!',
      parentId: 'comment-1',
      createdAt: '2024-01-01',
      likes: 8,
      isRoot: false,
    },
    {
      id: 'comment-3',
      author: 'colormaster',
      prompt: 'Add some clouds too',
      parentId: 'comment-2',
      createdAt: '2024-01-01', 
      likes: 5,
      isRoot: false,
    },
  ];

  // Create navigation order (flattened tree for J/K navigation)
  const navigationOrder = mockComments.map(c => c.id);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'j' || e.key === 'k') {
        e.preventDefault();
        const currentIndex = navigationOrder.indexOf(selectedCommentId);
        
        if (e.key === 'j' && currentIndex < navigationOrder.length - 1) {
          setSelectedCommentId(navigationOrder[currentIndex + 1]);
        } else if (e.key === 'k' && currentIndex > 0) {
          setSelectedCommentId(navigationOrder[currentIndex - 1]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedCommentId, navigationOrder]);

  if (!params) return <div>Loading...</div>;

  const CommentComponent = ({ comment }: { comment: Comment }) => {
    const isSelected = selectedCommentId === comment.id;
    const isChild = !comment.isRoot;
    
    return (
      <div className="relative">
        {/* Threading line for child comments */}
        {isChild && (
          <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-black opacity-20"></div>
        )}
        
        <div 
          className={`
            border-2 border-black p-2 cursor-pointer transition-all duration-200 relative
            ${isChild ? 'ml-8 bg-yellow-100' : 'bg-gray-50'}
            ${isSelected 
              ? 'ring-4 ring-black ring-opacity-50 rotate-0 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] scale-[1.02]' 
              : 'rotate-[-0.5deg] hover:rotate-0 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
            }
          `}
        >
          {/* Connection line to parent for child comments */}
          {isChild && (
            <div className="absolute -left-8 top-2 w-8 h-0.5 bg-black opacity-20"></div>
          )}
          
          <div className="flex items-center gap-2 mb-1">
            <div className={`w-6 h-6 text-white rounded-full flex items-center justify-center text-xs font-bold ${isChild ? 'bg-gray-800' : 'bg-black'}`}>
              {comment.author.charAt(0).toUpperCase()}
            </div>
            <span className="font-semibold text-sm">{comment.author}</span>
            <Badge variant="outline" className="text-xs border-black px-1 py-0">
              {comment.isRoot ? 'Root' : 'Child'}
            </Badge>
          </div>
          <p className="text-xs mb-1 font-mono">"{comment.prompt}"</p>
          <div className="flex gap-2">
            <Button size="sm" variant="ghost" className="text-xs hover:bg-black hover:text-white h-6 px-2">
              <Heart className="w-3 h-3 mr-1" />
              {comment.likes}
            </Button>
            <Button size="sm" variant="ghost" className="text-xs hover:bg-black hover:text-white h-6 px-2">
              Reply
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Quirky header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" className="rotate-[-2deg] hover:rotate-0 transition-transform">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="border-2 border-black bg-yellow-200 px-4 py-2 rotate-[1deg] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <h1 className="text-xl font-bold">Post #{params.id}</h1>
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
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Image display area - left side */}
          <div className="space-y-4">
            <Card className="border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rotate-[-0.5deg] hover:rotate-0 transition-transform">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-mono">Current Edit</CardTitle>
              </CardHeader>
              <CardContent>
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
            <Card className="border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rotate-[0.5deg] hover:rotate-0 transition-transform">
              <CardHeader className="border-b-2 border-black border-dashed">
                <div className="flex items-center justify-between">
                  <CardTitle className="font-mono flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Prompt Comments
                  </CardTitle>
                  <Button size="sm" className="bg-black text-white hover:bg-gray-800 rotate-[-2deg] hover:rotate-0 transition-transform">
                    + Add Prompt
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {mockComments.map(comment => (
                    <CommentComponent key={comment.id} comment={comment} />
                  ))}
                  
                  <div className="text-center py-8">
                    <p className="text-gray-500 font-mono text-sm rotate-[-1deg]">
                      More prompts loading...
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <KeyboardNav />
    </div>
  );
}
