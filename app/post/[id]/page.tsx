import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Heart, MessageSquare, Zap } from "lucide-react";

interface PostPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PostPage({ params }: PostPageProps) {
  const { id } = await params;
  
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
              <h1 className="text-xl font-bold">Post #{id}</h1>
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
            
            {/* Image navigation */}
            <div className="flex gap-2 justify-center">
              <Button size="sm" variant="outline" className="border-2 border-black hover:bg-black hover:text-white transition-colors">
                ← Prev Edit
              </Button>
              <Button size="sm" variant="outline" className="border-2 border-black hover:bg-black hover:text-white transition-colors">
                Next Edit →
              </Button>
            </div>
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
                  {/* Sample comment */}
                  <div className="border-2 border-black bg-gray-50 p-4 rotate-[-0.5deg] hover:rotate-0 transition-transform cursor-pointer">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-bold">
                        U
                      </div>
                      <span className="font-semibold">user123</span>
                      <Badge variant="outline" className="text-xs border-black">Root</Badge>
                    </div>
                    <p className="text-sm mb-3 font-mono">"Add a rainbow in the sky"</p>
                    <div className="flex gap-3">
                      <Button size="sm" variant="ghost" className="text-xs hover:bg-black hover:text-white">
                        <Heart className="w-3 h-3 mr-1" />
                        12
                      </Button>
                      <Button size="sm" variant="ghost" className="text-xs hover:bg-black hover:text-white">
                        Reply
                      </Button>
                    </div>
                  </div>
                  
                  {/* Nested comment */}
                  <div className="ml-6 border-2 border-black bg-yellow-100 p-4 rotate-[1deg] hover:rotate-0 transition-transform cursor-pointer">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-gray-800 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        A
                      </div>
                      <span className="font-semibold">artist_ai</span>
                      <Badge variant="outline" className="text-xs border-black">Child</Badge>
                    </div>
                    <p className="text-sm mb-3 font-mono">"Make it double rainbow!"</p>
                    <div className="flex gap-3">
                      <Button size="sm" variant="ghost" className="text-xs hover:bg-black hover:text-white">
                        <Heart className="w-3 h-3 mr-1" />
                        8
                      </Button>
                      <Button size="sm" variant="ghost" className="text-xs hover:bg-black hover:text-white">
                        Reply
                      </Button>
                    </div>
                  </div>
                  
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
    </div>
  );
}
